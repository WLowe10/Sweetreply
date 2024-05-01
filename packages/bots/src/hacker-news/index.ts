import axios, { Axios } from "axios";
import parse from "node-html-parser";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { UserAgents } from "../constants";

const hackerNewsAPIBaseUrl = new URL("https://news.ycombinator.com");

export class HackerNewsBot {
	private username: string;
	private password: string;
	private client: Axios;
	private cookieJar: CookieJar;

	constructor(opts: { username: string; password: string }) {
		this.username = opts.username;
		this.password = opts.password;

		this.cookieJar = new CookieJar();
		this.client = wrapper(
			axios.create({
				jar: this.cookieJar,
				headers: {
					"User-Agent": UserAgents.chrome,
				},
			})
		);
	}

	public async login() {
		const loginData = new URLSearchParams({
			goto: "news",
			acct: this.username,
			pw: this.password,
		});

		const loginResponse = await this.client.post(`${hackerNewsAPIBaseUrl}login`, loginData, {
			headers: {
				"accept":
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
				"accept-language": "en-US,en;q=0.5",
				"cache-control": "max-age=0",
				"content-type": "application/x-www-form-urlencoded",
				"origin": "https://news.ycombinator.com",
				"referer": "https://news.ycombinator.com/",
				"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"sec-gpc": "1",
				"upgrade-insecure-requests": "1",
			},
		});

		return loginResponse;
	}

	public async comment({ postId, content }: { postId: string; content: string }) {
		const getItemResponse = await this.client.get(`${hackerNewsAPIBaseUrl}item`, {
			params: {
				id: postId,
			},
			headers: {
				"accept":
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
				"accept-language": "en-US,en;q=0.5",
				"cache-control": "max-age=0",
				"referer": "https://news.ycombinator.com/",
				"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"sec-gpc": "1",
				"upgrade-insecure-requests": "1",
			},
		});

		const root = parse(getItemResponse.data);
		const hmacInput = root.querySelector("input[name='hmac']");
		const hmac = hmacInput?.getAttribute("value");

		if (!hmac) {
			throw new Error("Failed to comment: hmac not found");
		}

		const commentPostResponse = await this.client.post(
			`${hackerNewsAPIBaseUrl}comment`,
			new URLSearchParams({
				parent: postId,
				goto: `item?id=${postId}`,
				hmac: hmac,
				text: content,
			}),
			{
				headers: {
					"accept":
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
					"accept-language": "en-US,en;q=0.5",
					"cache-control": "max-age=0",
					"origin": "https://news.ycombinator.com",
					"referer": "https://news.ycombinator.com/",
					"sec-ch-ua": '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Windows"',
					"sec-fetch-dest": "document",
					"sec-fetch-mode": "navigate",
					"sec-fetch-site": "same-origin",
					"sec-fetch-user": "?1",
					"sec-gpc": "1",
					"upgrade-insecure-requests": "1",
				},
			}
		);

		return commentPostResponse;
	}
}
