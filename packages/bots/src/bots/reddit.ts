import axios, { type Axios, type AxiosProxyConfig } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { userAgents } from "../constants";
import { createThing } from "@sweetreply/shared/features/reddit/utils";
import { type RedditThingType } from "@sweetreply/shared/features/reddit/constants";
import type { IBot } from "../types";

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
	private proxy: AxiosProxyConfig | undefined;
	private client: Axios;
	private cookieJar: CookieJar;

	constructor(opts: { username: string; password: string; proxy?: AxiosProxyConfig }) {
		this.username = opts.username;
		this.password = opts.password;
		this.proxy = opts.proxy;
		this.modhash = null;

		this.cookieJar = new CookieJar();
		this.client = wrapper(
			axios.create({
				jar: this.cookieJar,
				proxy: this.proxy,
				headers: {
					"User-Agent": userAgents.chrome,
				},
			})
		);
	}

	static async isBanned(username: string) {
		const response = await axios.get(`https://www.reddit.com/user/${username}`);

		return response.data.includes('<span slot="title">This account has been suspended</span>');
	}

	public async login() {
		const formData = new URLSearchParams({
			op: "login",
			rem: "yes",
			api_type: "json",
			user: this.username,
			passwd: this.password,
		});

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

		if (data.json.errors.length > 0) {
			throw new Error(`${this.username} failed to authenticate`);
		}

		const modhash = data.json.data.modhash;
		// const cookie = data.json.data.cookie;

		this.modhash = modhash;

		// return postLoginResponse;
	}

	public async comment({
		postId,
		targetType,
		subredditName,
		content,
	}: {
		postId: string;
		targetType: TargetType;
		subredditName: string;
		content: string;
	}): Promise<RedditCommentData> {
		if (!this.isAuthenticated()) {
			throw new Error("Not authenticated");
		}

		const redditPrefixedId = createThing(targetType, postId);

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
			r: subredditName,
			text: content,
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

		if (postCommentResponse.data.success === false) {
			const errorMsg = postCommentResponse.data.jquery[14][3];

			throw new Error(`Failed to comment: ${errorMsg}`);
		}

		let data;

		for (const item of postCommentResponse.data.jquery) {
			const type = item[2];
			const value = item[3];

			if (type === "call" && Array.isArray(value)) {
				const dataArray = value[0];

				if (Array.isArray(dataArray)) {
					const newComment = dataArray[0];

					if (newComment) {
						data = newComment.data;
					}
				}
			}
		}

		if (!data) {
			throw new Error("Failed to parse new Reddit comment");
		}

		return data;
	}

	public async deleteComment({
		commentId,
		subredditName,
	}: {
		commentId: string;
		subredditName: string;
	}) {
		// if (!this.isAuthenticated()) {
		// 	throw new Error("Not authenticated");
		// }

		const thingId = createThing("comment", commentId);

		const response = await this.client.post(
			`${oldRedditBase}/del`,
			new URLSearchParams({
				id: thingId,
				r: subredditName,
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
					// "cookie":
					// 	"csv=2; edgebucket=jePKTP09eoJfaGVVRx; reddit_session=97401946053696%2C2024-04-20T14%3A22%3A28%2Cfa454aa566a98713483443af40c9764b40596348; loid=000000000yixu3u4ao.2.1713394883176.Z0FBQUFBQm1JOC1sZ2hFdDZtSWpORTdscC1HQzlVQTdvYUhSMU1oNXFKN0RJNXo1WWVYc3U0ZzJQYUgyQ0Z2eUdyMGswMHZVU1JqRnlwQ3dqMU9PNHBmRUV4akxIR3NmLWdCdTVocjEzUTZSR1dIUjBmMmRMaXpsMGNyNnNvM0hRanhuRGdFYXlQYm8; pc=lx; Less-Tear-8895_recentclicks2=t3_1blgh0s%2C; session_tracker=mbkkmpigrmbeeielkd.0.1713622989010.Z0FBQUFBQm1JOF9OTm1fb3k3S2dBbTNNYU9abVpvSlFVcXd2c1p1Y2ZRdzFYQ2tTYUtPZU5jd0xEQzlNX1BTRExubFVlRExLZndHS2JqSmE4UmxrMzZ1WnRWeGZuT3g1SHNxN2YxR0VHYVhtNFF3NGxIS1VaVlNwU1ctTDJxQ29NT0dZUWthV0RWV1g",
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
			throw new Error(`Failed to delete comment ${commentId}`);
		}

		return response;
	}

	// todo
	public async upvote({
		postId,
		subredditName,
		targetType,
	}: {
		postId: string;
		subredditName: string;
		targetType: TargetType;
	}) {
		// if (!this.isAuthenticated()) {
		// 	throw new Error("Not authenticated");
		// }
		// const upvoteResponse = await this.client.post(
		// 	"https://old.reddit.com/api/vote",
		// 	new URLSearchParams({
		// 		id: createRedditThing(targetType, postId),
		// 		dir: "1", // 1 is upvote
		// 		// vh comes from the html of the page
		// 		vh: "qpDloBMTymxKq5IJOeCC4oWggtuacw6AELF/rG/2eqJ6YwJliYJllikO9CBwDrxkb6Nobmhcc02llv0u0eWQw/gAc3Z8KyzfctjZRQFy5GLafBikvE7T/wNnC83teb/rSp4pSTO9NMC80xU+hAr3x8Yp0iArmQiqfVNi30brWxA=",
		// 		isTrusted: "true",
		// 		vote_event_data: '{"page_type":"self","sort":"confidence"}',
		// 		r: "replyon",
		// 		uh: this.modhash!,
		// 		renderstyle: "html",
		// 	}),
		// 	{
		// 		params: {
		// 			dir: "1",
		// 			id: "t3_1blgh0s",
		// 			sr: "replyon",
		// 		},
		// 		headers: {
		// 			"accept": "application/json, text/javascript, */*; q=0.01",
		// 			"accept-language": "en-US,en;q=0.5",
		// 			"cache-control": "no-cache",
		// 			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
		// 			"origin": "https://old.reddit.com",
		// 			"pragma": "no-cache",
		// 			"priority": "u=1, i",
		// 			// "referer": "https://old.reddit.com/r/replyon/comments/1blgh0s/hello_world/",
		// 			"sec-ch-ua": '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
		// 			"sec-ch-ua-mobile": "?0",
		// 			"sec-ch-ua-platform": '"Windows"',
		// 			"sec-fetch-dest": "empty",
		// 			"sec-fetch-mode": "cors",
		// 			"sec-fetch-site": "same-origin",
		// 			"sec-gpc": "1",
		// 			"user-agent":
		// 				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
		// 			"x-requested-with": "XMLHttpRequest",
		// 		},
		// 	}
		// );
		// if (upvoteResponse.data.success === false) {
		// 	throw new Error("Failed to upvote");
		// }
	}

	public isAuthenticated() {
		return this.modhash !== null;
	}
}
