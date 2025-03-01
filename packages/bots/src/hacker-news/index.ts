import got, { type Got } from "got";
import parse from "node-html-parser";
import { CookieJar } from "tough-cookie";
import { UserAgents } from "@sweetreply/shared/constants";

const hackerNewsAPIBaseUrl = new URL("https://news.ycombinator.com");

export class HackerNewsBot {
	private username: string;
	private password: string;
	private client: Got;
	private cookieJar: CookieJar;

	constructor(opts: { username: string; password: string }) {
		this.username = opts.username;
		this.password = opts.password;

		this.cookieJar = new CookieJar();

		this.client = got.extend({
			cookieJar: this.cookieJar,
			timeout: 10000,
			headers: {
				"User-Agent": UserAgents.chrome,
			},
		});
	}

	public async login() {
		const loginData = {
			goto: "news",
			acct: this.username,
			pw: this.password,
		};

		const loginResponse = await this.client.post(`${hackerNewsAPIBaseUrl}login`, {
			form: loginData,
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
			searchParams: {
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

		const document = parse(getItemResponse.body);
		const hmacInput = document.querySelector("input[name='hmac']");
		const hmac = hmacInput?.getAttribute("value");

		if (!hmac) {
			throw new Error("Failed to comment: hmac not found");
		}

		const data = {
			parent: postId,
			goto: `item?id=${postId}`,
			hmac: hmac,
			text: content,
		};

		const commentPostResponse = await this.client.post(`${hackerNewsAPIBaseUrl}comment`, {
			form: data,
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
		});

		return commentPostResponse;
	}
}
