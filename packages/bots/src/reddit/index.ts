import got, { type Got } from "got";
import { CookieJar } from "tough-cookie";
import { HttpProxyAgent } from "http-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import { parse } from "node-html-parser";
import { z } from "zod";
import { UserAgents } from "@sweetreply/shared/constants";
import { createThing, extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import { buildProxyURL, sleepRange } from "@sweetreply/shared/lib/utils";
import { BotError } from "../errors";
import { proxyIsDefined } from "../utils";
import type { IBot } from "../types";
import type { RedditThingType } from "@sweetreply/shared/features/reddit/constants";
import type { Bot, Lead } from "@sweetreply/prisma";

const redditURL = "https://www.reddit.com";
const oldRedditURL = "https://old.reddit.com";
const redditAPIURL = redditURL + "/api";
const oldRedditAPIURL = oldRedditURL + "/api";

const redditSessionSchema = z.object({
	cookies: z.array(z.string()),
});

export type RedditBotSession = z.infer<typeof redditSessionSchema>;

export type TargetType = Extract<RedditThingType, "comment" | "link">;

export type RedditCommentData = {
	id: string;
	parent: string;
	content: string;
	contentText: string;
	contentHTML: string;
	link: string;
	replies: string;
};

export class RedditBot implements IBot {
	private username: string;
	private password: string;
	private client: Got;
	private jar: CookieJar;

	constructor(
		bot: Pick<
			Bot,
			"username" | "password" | "proxy_host" | "proxy_port" | "proxy_user" | "proxy_pass"
		>
	) {
		this.username = bot.username;
		this.password = bot.password;

		this.jar = new CookieJar();

		const proxy = proxyIsDefined(bot)
			? buildProxyURL({
					host: bot.proxy_host!,
					port: bot.proxy_port!,
					user: bot.proxy_user!,
					pass: bot.proxy_pass!,
				})
			: undefined;

		const agents = proxy
			? {
					http: new HttpProxyAgent(proxy),
					https: new HttpsProxyAgent(proxy),
				}
			: undefined;

		this.client = got.extend({
			timeout: 10000,
			cookieJar: this.jar,
			agent: agents,
			headers: {
				"User-Agent": UserAgents.chrome,
			},
		});
	}

	static async isBanned(username: string) {
		const response = await got.get(`https://www.reddit.com/user/${username}`);

		return response.body.includes('<span slot="title">This account has been suspended</span>');
	}

	public async generateSession(): Promise<RedditBotSession> {
		const formData = {
			op: "login",
			rem: "yes",
			api_type: "json",
			user: this.username,
			passwd: this.password,
		};

		// always returns 200, therefore if the request fails, we know it isnt the bot's fault
		const response = await this.client.post(`${redditAPIURL}/login/${this.username}`, {
			form: formData,
			headers: {
				"Host": "old.reddit.com",
				"Connection": "keep-alive",
				"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"X-Requested-With": "XMLHttpRequest",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"Sec-GPC": "1",
				"Accept-Language": "en-US,en;q=0.8",
				"Origin": "https://old.reddit.com",
				"Sec-Fetch-Site": "same-origin",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Dest": "empty",
				"Referer": "https://old.reddit.com/",
				"Accept-Encoding": "gzip, deflate, br, zstd",
			},
		});

		const body = JSON.parse(response.body);
		const errors = body.json.errors;

		if (errors.length > 0) {
			if (errors[0]) {
				if (errors[0][0] === "INCORRECT_USERNAME_PASSWORD") {
					throw new BotError("INVALID_CREDENTIALS");
				}
			}

			throw new BotError("AUTHENTICATION_FAILED");
		}

		return this.dumpSession();
	}

	public async loadSession(data: object) {
		const parseResult = redditSessionSchema.safeParse(data);

		if (!parseResult.success) {
			return false;
		}

		const session = parseResult.data;

		for (const cookieStr of session.cookies) {
			await this.jar.setCookie(cookieStr, oldRedditURL.toString());
		}

		const response = await this.client.get(oldRedditURL, {
			headers: {
				"accept":
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
				"accept-language": "en-US,en;q=0.9",
				"cache-control": "no-cache",
				"pragma": "no-cache",
				"priority": "u=0, i",
				"sec-ch-ua": '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "none",
				"sec-fetch-user": "?1",
				"sec-gpc": "1",
				"upgrade-insecure-requests": "1",
			},
		});

		const document = parse(response.body);
		const logoutForm = document.querySelector("form.logout");

		if (!logoutForm) {
			return false;
		}

		return true;
	}

	public async dumpSession(): Promise<RedditBotSession> {
		const cookieStrings = await this.jar.getSetCookieStrings(oldRedditURL.toString());

		return {
			cookies: cookieStrings,
		};
	}

	public async reply(lead: Lead) {
		if (!lead.group || !lead.reply_text) {
			throw new BotError("REPLY_LOCKED");
		}

		const subreddit = lead.group;
		const targetType: TargetType = lead.type === "post" ? "link" : "comment";
		const redditPrefixedId = createThing(targetType, lead.remote_id);

		const getPostResponse = await this.getPost(lead);

		// sleep between 2.5 and 5 seconds
		await sleepRange(2500, 5000);

		const modhash = this.parseModhash(getPostResponse.body);

		if (!modhash) {
			throw new Error("Failed to parse modhash");
		}

		let commentData: object | undefined;

		if (lead.type === "post") {
			const document = parse(getPostResponse.body);
			const commentForm = document.querySelector(".usertext.cloneable.warn-on-unload");

			if (!commentForm) {
				throw new BotError("REPLY_LOCKED");
			}

			const formId = commentForm.getAttribute("id");

			commentData = {
				thing_id: redditPrefixedId,
				r: subreddit,
				id: `#${formId}`,
				text: lead.reply_text,
				uh: modhash,
				renderstyle: "html",
			};
		} else {
			commentData = {
				thing_id: redditPrefixedId,
				r: subreddit,
				id: `#commentreply_${redditPrefixedId}`,
				text: lead.reply_text,
				uh: modhash,
				renderstyle: "html",
			};
		}

		// submit the actual comment
		const postCommentResponse = await this.client.post(`${oldRedditAPIURL}/comment`, {
			form: commentData,
			headers: {
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Accept-Language": "en-US,en;q=0.8",
				"Connection": "keep-alive",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Origin": "https://old.reddit.com",
				// "Referer": "https://old.reddit.com/r/replyon/comments/1bx1v9d/test_replyon/",
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "same-origin",
				"Sec-GPC": "1",
				"X-Requested-With": "XMLHttpRequest",
				"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
			},
		});

		const body = JSON.parse(postCommentResponse.body);
		const jquery = body.jquery;

		if (body.success === false) {
			const jqueryText = JSON.stringify(jquery);

			// console.log(jqueryText);

			if (jqueryText.includes(".error.RATELIMIT.field-ratelimit")) {
				throw new BotError("RATE_LIMITED");
			} else if (jqueryText.includes(".error.THREAD_LOCKED.field-parent")) {
				throw new BotError("REPLY_LOCKED");
			} else {
				throw new Error("Failed to reply");
			}
		}

		let result: RedditCommentData | undefined;

		for (const item of jquery) {
			const type = item[2];
			const value = item[3];

			if (type === "call" && Array.isArray(value)) {
				const dataArray = value[0];

				if (Array.isArray(dataArray)) {
					const newComment = dataArray[0];

					if (newComment) {
						result = newComment.data;
					}
				}
			}
		}

		if (!result) {
			// failed to reply, we mark the lead as locked
			throw new BotError("REPLY_LOCKED");
		}

		const remoteId = extractIdFromThing(result.id);

		return {
			reply_remote_id: remoteId,
			reply_remote_url: `https://www.reddit.com/r/${lead.group}/comments/${extractIdFromThing(result.link)}/comment/${remoteId}`,
		};
	}

	public async deleteReply(lead: Lead) {
		if (!lead.reply_remote_id || !lead.group) {
			throw new BotError("REPLY_LOCKED");
		}

		const thingId = createThing("comment", lead.reply_remote_id);

		const getPostResponse = await this.getPost(lead);

		// sleep between 2.5 and 5 seconds
		await sleepRange(2500, 5000);

		const modhash = this.parseModhash(getPostResponse.body);

		if (!modhash) {
			throw new Error("Failed to parse modhash");
		}

		const data = {
			id: thingId,
			r: lead.group,
			uh: modhash,
			executed: "deleted",
			renderstyle: "html",
		};

		const delResponse = await this.client.post(`${oldRedditAPIURL}/del`, {
			form: data,
			headers: {
				"accept": "application/json, text/javascript, */*; q=0.01",
				"accept-language": "en-US,en;q=0.5",
				"cache-control": "no-cache",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"origin": "https://old.reddit.com",
				"pragma": "no-cache",
				"priority": "u=1, i",
				// "referer": "https://old.reddit.com/r/replyon/comments/1blgh0s/hello_world/",
				"sec-ch-ua": '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"sec-gpc": "1",
				"x-requested-with": "XMLHttpRequest",
			},
		});

		const body = JSON.parse(delResponse.body);

		if (body.success === false) {
			throw new Error(`Failed to delete reply`);
		}
	}

	private async getPost(lead: Lead) {
		const postURL = `${oldRedditURL}/r/${lead.group}/comments/${lead.type === "post" ? lead.remote_id : lead.remote_parent_id}`;

		return this.client.get(postURL);
	}

	private parseModhash(body: string): string | null {
		const document = parse(body);
		const modhashInput = document.querySelector("input[name='uh'][type='hidden']");

		if (!modhashInput) {
			return null;
		}

		return modhashInput.getAttribute("value") || null;
	}
}
