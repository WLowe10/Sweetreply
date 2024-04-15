import axios, { Axios } from "axios";
import parse from "node-html-parser";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { userAgents } from "../../lib/constants";

const redditBase = new URL("https://www.reddit.com/api");
const oldRedditBase = new URL("https://old.reddit.com/api");

export class RedditBot {
	private username: string;
	private password: string;
	private modhash: string | null;
	private client: Axios;
	private cookieJar: CookieJar;

	constructor(opts: { username: string; password: string }) {
		this.username = opts.username;
		this.password = opts.password;
		this.modhash = null;

		this.cookieJar = new CookieJar();
		this.client = wrapper(
			axios.create({
				jar: this.cookieJar,
				headers: {
					"User-Agent": userAgents.chrome,
				},
			})
		);
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
			throw new Error("Failed to authenticate");
		}

		const modhash = data.json.data.modhash;
		// const cookie = data.json.data.cookie;

		this.modhash = modhash;

		return postLoginResponse;
	}

	public async comment({
		postId,
		subredditName,
		content,
	}: {
		postId: string;
		subredditName: string;
		content: string;
	}) {
		if (!this.isAuthenticated()) {
			throw new Error("Not authenticated");
		}

		const redditPostTypeId = `t3_${postId}`;

		// get the page with the form id defined

		const getCommentResponse = await axios.get(
			`https://old.reddit.com/r/${subredditName}/comments/${postId}`,
			{
				maxRedirects: 1,
				headers: {
					"Accept":
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
					"Accept-Language": "en-US,en;q=0.8",
					"Connection": "keep-alive",
					"Referer": `https://old.reddit.com/search?q=${subredditName}`,
					"Sec-Fetch-Dest": "document",
					"Sec-Fetch-Mode": "navigate",
					"Sec-Fetch-Site": "same-origin",
					"Sec-Fetch-User": "?1",
					"Sec-GPC": "1",
					"Upgrade-Insecure-Requests": "1",
					"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Windows"',
				},
			}
		);

		const root = parse(getCommentResponse.data);
		const formElement = root.querySelector(".usertext.warn-on-unload");

		if (!formElement) {
			throw new Error("Could not parse form");
		}

		const formId = formElement.getAttribute("id");

		const commentData = new URLSearchParams({
			thing_id: redditPostTypeId,
			text: content,
			id: `#${formId}`,
			r: subredditName,
			uh: this.modhash as string,
			renderstyle: "html",
		});

		// submit the actual comment
		const postCommentResponse = await this.client.post(
			`${oldRedditBase}/comment`,
			commentData,
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

		return postCommentResponse;
	}

	public isAuthenticated() {
		return this.modhash !== null;
	}
}
