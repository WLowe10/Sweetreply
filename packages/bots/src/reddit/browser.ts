import puppeteer from "../lib/puppeteer";
import parse from "node-html-parser";
import { Browser, Page, Cookie } from "puppeteer";
import { BotError } from "../errors";
import { extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import { proxyIsDefined } from "../utils";
import { z } from "zod";
import type { Bot } from "@sweetreply/prisma";
import type { DeleteReplyInputData, IBot, ReplyInputData } from "../types";

const redditURL = "https://www.reddit.com";

const redditSessionSchema = z.object({
	cookies: z.array(
		z.object({
			name: z.string(),
			value: z.string(),
			domain: z.string(),
			path: z.string(),
			expires: z.number(),
			size: z.number(),
			httpOnly: z.boolean(),
			secure: z.boolean(),
			session: z.boolean(),
			sameSite: z.enum(["Strict", "Lax", "None"]).optional(),
			priority: z.enum(["Low", "Medium", "High"]).optional(),
			sameParty: z.boolean().optional(),
			sourceScheme: z.enum(["Unset", "NonSecure", "Secure"]).optional(),
			partitionKey: z.string().optional(),
			partitionKeyOpaque: z.boolean().optional(),
		})
	),
});

export type RedditSessionType = z.infer<typeof redditSessionSchema>;

export class RedditBrowserBot implements IBot {
	private browser: Browser | undefined;
	private page: Page | undefined;
	private botAccount: Bot;

	constructor(botAccount: Bot) {
		this.botAccount = botAccount;
	}

	// todo make proxy optional
	public async setup() {
		const botUsesProxy = proxyIsDefined(this.botAccount);

		const args: string[] = [];

		if (botUsesProxy) {
			args.push(`--proxy-server=${this.botAccount.proxy_host}:${this.botAccount.proxy_port}`);
		}

		this.browser = await puppeteer.launch({
			// headless: false, // ? false during dev testing
			timeout: 5000,
			ignoreDefaultArgs: ["--disable-extensions"],
			args,
		});

		this.page = await this.browser.newPage();

		this.page.setDefaultTimeout(5000);

		if (botUsesProxy) {
			await this.page.authenticate({
				username: this.botAccount.proxy_user!,
				password: this.botAccount.proxy_pass!,
			});
		}
	}

	public async teardown() {
		if (!this.browser) {
			throw new Error("Browser is not initialized");
		}

		console.log("closing browser");
		await this.browser.close();
	}

	public parseSessionDump(data: object): RedditSessionType {
		return redditSessionSchema.parse(data);
	}

	public async loadSession(session: RedditSessionType) {
		if (!this.browser || !this.page) {
			throw new Error("Browser is not initialized");
		}

		for (const cookie of session.cookies) {
			this.page.setCookie(cookie);
		}

		await this.page.goto(redditURL, {
			waitUntil: "domcontentloaded",
		});

		const shredditApp = await this.page.waitForSelector("shreddit-app");

		if (!shredditApp) {
			return false;
		}

		const userLoggedIn = await this.page.$eval("shreddit-app", (el) =>
			el.getAttribute("user-logged-in")
		);

		return userLoggedIn === "true";
	}

	public async dumpSession(): Promise<RedditSessionType> {
		if (!this.page) {
			throw new Error("Browser is not initialized");
		}

		const cookies = await this.page.cookies(redditURL);
		const validCookies = cookies.filter((cookie) => cookie.expires > 0);

		return {
			cookies: validCookies,
		};
	}

	public async generateSession(): Promise<RedditSessionType> {
		if (!this.browser || !this.page) {
			throw new Error("Browser is not initialized");
		}

		await this.page.goto(`${redditURL}/login`);

		const usernameInput = await this.page.waitForSelector('input[name="username"]');
		const passwordInput = await this.page.waitForSelector('input[name="password"]');

		if (!usernameInput || !passwordInput) {
			throw new Error("Failed to find auth inputs");
		}

		await usernameInput.type(this.botAccount.username);
		await passwordInput.type(this.botAccount.password);

		const loginButton = await this.page.waitForSelector(">>> button.login:not([disabled])");

		if (!loginButton) {
			throw new Error("Failed to find login button");
		}

		// try to figure out how to not need this
		// await sleepRange(750, 1000);

		await loginButton.click();

		const response = await this.page.waitForResponse(`${redditURL}/svc/shreddit/account/login`);
		const body = await response.text();

		if (body.trim().length > 0) {
			const resDoc = parse(body);
			const faceplateAlert = resDoc.querySelector("faceplate-alert");

			if (faceplateAlert) {
				const message = faceplateAlert.getAttribute("message");

				if (message === "Invalid username or password.") {
					throw new BotError("INVALID_CREDENTIALS");
				}

				throw new BotError("UNKNOWN", message);
			}
		}

		return this.dumpSession();
	}

	// ? doesn't work for replying to comments yet, only posts
	public async reply(lead: ReplyInputData) {
		if (!this.browser || !this.page) {
			throw new Error("Browser is not initialized");
		}

		await this.page.goto(`${redditURL}/r/${lead.group}/comments/${lead.remote_id}`, {
			waitUntil: "networkidle2",
		});

		const triggerButton = await this.page.waitForSelector(
			"comment-composer-host > faceplate-tracker > button[data-testid='trigger-button']"
		);

		if (!triggerButton) {
			throw new BotError("REPLY_LOCKED");
		}

		await triggerButton.click();

		const textarea = await this.page.waitForSelector(
			"shreddit-composer > div[role='textbox'][contenteditable='true']",
			{
				visible: true,
			}
		);

		if (!textarea) {
			throw new Error("Failed to find comment textarea");
		}

		await textarea.type(lead.reply_text);

		const submitButton = await this.page.waitForSelector(
			"shreddit-composer > button[type='submit'][slot='submit-button']"
		);

		if (!submitButton) {
			throw new Error("Failed to find submit button");
		}

		await submitButton.click();

		const response = await this.page.waitForResponse(
			`${redditURL}/svc/shreddit/t3_${lead.remote_id}/create-comment`,
			{
				timeout: 5000,
			}
		);

		const body = await response.text();

		const resDoc = parse(body);

		const shredditComment = resDoc.querySelector("shreddit-comment");

		if (shredditComment) {
			const newCommentId = extractIdFromThing(shredditComment.getAttribute("thingId")!);

			return {
				reply_remote_id: newCommentId,
				reply_remote_url: `https://www.reddit.com/r/replyon/comments/${lead.remote_id}/comment/${newCommentId}`,
			};
		} else {
			let message;

			const faceplateAlert = resDoc.querySelector("faceplate-alert[level='error']");

			if (faceplateAlert) {
				message = faceplateAlert.getAttribute("message");
			}

			throw new BotError("UNKNOWN", message);
		}
	}

	public async deleteReply(lead: DeleteReplyInputData) {
		if (!this.browser || !this.page) {
			throw new Error("Browser is not initialized");
		}

		await this.page.goto(
			`${redditURL}/r/${lead.group}/comments/${lead.remote_id}/comment/${lead.reply_remote_id}`
		);

		const menuButton = await this.page.waitForSelector("shreddit-overflow-menu >>> button");

		if (!menuButton) {
			throw new Error("Failed to find menu button");
		}

		await menuButton.click();

		const initDeleteButton = await this.page.waitForSelector(
			">>> li.delete-comment-menu-button",
			{
				visible: true,
			}
		);

		if (!initDeleteButton) {
			throw new Error("Failed to delete button");
		}

		await initDeleteButton.click();

		const confirmDeleteButton = await this.page.waitForSelector(
			"shreddit-comment-deletion-modal >>> button.button-destructive",
			{
				visible: true,
			}
		);

		if (!confirmDeleteButton) {
			throw new Error("Failed to delete button");
		}

		await confirmDeleteButton.click();

		const response = await this.page.waitForResponse(`${redditURL}/svc/shreddit/graphql`, {
			timeout: 5000,
		});

		const body = await response.json();
		const data = body.data;

		if (body.data) {
			const deleteComment = data.deleteComment;

			if (deleteComment && deleteComment.ok !== true) {
				throw new Error("Failed to delete reply");
			}
		}
	}
}
