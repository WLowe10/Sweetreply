import axios, { type Axios } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { UserAgents } from "../constants";
import { RedditThing, type RedditThingType } from "@sweetreply/shared/features/reddit/constants";
import type { IBot } from "../types";
import type { Bot, Lead } from "@sweetreply/prisma";
import { proxyIsDefined } from "../utils";
import { createThing, extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import { BotError, FatalBotError, LockLead } from "../errors";

const redditBase = new URL("https://www.reddit.com/api");
const oldRedditBase = new URL("https://old.reddit.com/api");

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
	private modhash: string | null;
	private client: Axios;
	private cookieJar: CookieJar;

	constructor(bot: Bot) {
		this.username = bot.username;
		this.password = bot.password;
		this.modhash = null;

		this.cookieJar = new CookieJar();
		this.client = wrapper(
			axios.create({
				jar: this.cookieJar,
				proxy: proxyIsDefined(bot) && {
					host: bot.proxy_host!,
					port: bot.proxy_port!,
					auth: {
						username: bot.proxy_user!,
						password: bot.proxy_pass!,
					},
				},
				headers: {
					"User-Agent": UserAgents.chrome,
				},
			})
		);
	}

	static async isBanned(username: string) {
		const response = await axios.get(`https://www.reddit.com/user/${username}`);

		return response.data.includes('<span slot="title">This account has been suspended</span>');
	}

	public isAuthenticated() {
		return this.modhash !== null;
	}

	public async login() {
		const formData = new URLSearchParams({
			op: "login",
			rem: "yes",
			api_type: "json",
			user: this.username,
			passwd: this.password,
		});

		// always returns 200, therefore if the request fails, we know it isnt the bot's fault
		const postLoginResponse = await this.client.post(
			`${redditBase}/login/${this.username}`,
			formData,
			{
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
			}
		);

		const { data } = postLoginResponse;
		const errors = data.json.errors;

		if (errors.length > 0) {
			if (errors[0]) {
				if (errors[0][0] === "INCORRECT_USERNAME_PASSWORD") {
					throw new FatalBotError("Incorrect username or password");
				}
			}

			throw new FatalBotError("Failed to authenticate");
		}

		const modhash = data.json.data.modhash;
		// const cookie = data.json.data.cookie;

		this.modhash = modhash;
	}

	public async reply(lead: Lead) {
		if (!this.isAuthenticated()) {
			throw new Error("Not authenticated");
		}

		if (!lead.reply_text || !lead.channel) {
			throw new Error("Lead has no reply text or channel");
		}

		const targetType: TargetType = lead.type === "post" ? "link" : "comment";
		const redditPrefixedId = createThing(targetType, lead.remote_id);

		// it seems like the id is optional. I'm not sure if it would minimize the change of being banned, but i'm ignoring it for now

		// let commentData;

		// if (targetType === "post") {
		// 	// get the page with the form id defined
		// 	const getCommentResponse = await axios.get(
		// 		`https://old.reddit.com/r/${subredditName}/comments/${postId}`,
		// 		{
		// 			maxRedirects: 1,
		// 			headers: {
		// 				"Accept":
		// 					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
		// 				"Accept-Language": "en-US,en;q=0.8",
		// 				"Connection": "keep-alive",
		// 				"Referer": `https://old.reddit.com/search?q=${subredditName}`,
		// 				"Sec-Fetch-Dest": "document",
		// 				"Sec-Fetch-Mode": "navigate",
		// 				"Sec-Fetch-Site": "same-origin",
		// 				"Sec-Fetch-User": "?1",
		// 				"Sec-GPC": "1",
		// 				"Upgrade-Insecure-Requests": "1",
		// 				"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
		// 				"sec-ch-ua-mobile": "?0",
		// 				"sec-ch-ua-platform": '"Windows"',
		// 			},
		// 		}
		// 	);

		// 	const root = parse(getCommentResponse.data);
		// 	const formElement = root.querySelector(".usertext.warn-on-unload");

		// 	if (!formElement) {
		// 		throw new Error("Could not parse form");
		// 	}

		// 	const formId = formElement.getAttribute("id");

		// 	commentData = new URLSearchParams({
		// 		thing_id: redditPrefixedId,
		// 		r: subredditName,
		// 		// id: `#${formId}`,
		// 		text: content,
		// 		uh: this.modhash as string,
		// 		renderstyle: "html",
		// 	});
		// } else {
		// 	commentData = new URLSearchParams({
		// 		thing_id: redditPrefixedId,
		// 		r: subredditName,
		// 		id: `#commentreply_${redditPrefixedId}`,
		// 		text: content,
		// 		uh: this.modhash as string,
		// 		renderstyle: "html",
		// 	});
		// }

		const commentData: any = {
			thing_id: redditPrefixedId,
			r: lead.channel,
			text: lead.reply_text,
			uh: this.modhash as string,
			renderstyle: "html",
		};

		if (targetType === "comment") {
			commentData.id = `#commentreply_${redditPrefixedId}`;
		}

		// submit the actual comment
		const postCommentResponse = await this.client.post(
			`${oldRedditBase}/comment`,
			new URLSearchParams(commentData),
			{
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
			}
		);

		const { data } = postCommentResponse;

		const jquery = data.jquery;

		if (postCommentResponse.data.success === false) {
			const jqueryText = JSON.stringify(jquery);

			// console.log(jqueryText);

			if (jqueryText.includes(".error.RATELIMIT.field-ratelimit")) {
				throw new FatalBotError("Rate limited");
			} else if (jqueryText.includes(".error.THREAD_LOCKED.field-parent")) {
				throw new LockLead();
			} else {
				throw new BotError("Failed to reply");
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
			// failed to reply, lead may be locked
			throw new LockLead();
		}

		const remoteId = extractIdFromThing(result.id);

		return {
			reply_remote_id: remoteId,
			reply_remote_url: `https://www.reddit.com/r/${lead.channel}/comments/${extractIdFromThing(result.link)}/comment/${remoteId}`,
		};
	}

	public async deleteReply(lead: Lead) {
		if (!this.isAuthenticated()) {
			throw new Error("Not authenticated");
		}

		if (!lead.reply_remote_id || !lead.channel) {
			throw new Error("Lead has no reply remote id or channel");
		}

		const thingId = createThing("comment", lead.reply_remote_id);

		const response = await this.client.post(
			`${oldRedditBase}/del`,
			new URLSearchParams({
				id: thingId,
				r: lead.channel,
				uh: this.modhash!,
				executed: "deleted",
				renderstyle: "html",
			}),
			{
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
			}
		);

		if (response.data.success === false) {
			throw new Error(`Failed to delete reply`);
		}
	}
}
