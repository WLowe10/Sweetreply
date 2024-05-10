import { sleepRange } from "@sweetreply/shared/lib/utils";
import { RedditBrowserBot, type RedditSessionType } from "../../src/reddit/browser";
import type { Bot } from "@sweetreply/prisma";

const botAccount: Bot = {
	username: "Kindly-Confusion-95",
	password: String.raw`+9n5\pJ7713;`,
	proxy_host: "62.164.225.162",
	proxy_port: 7475,
	proxy_user: "dgopvclh",
	proxy_pass: "wm3sf17c7jcu",
};

const session: RedditSessionType = {
	cookies: [
		{
			name: "token_v2",
			value: "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzE1MzE4NjYzLjg1NDEzOCwiaWF0IjoxNzE1MjMyMjYzLjg1NDEzOCwianRpIjoiMjRpenFITXBsakVsalJnQVUtcC0tYll5WnpmdWlBIiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml96Y3p0bmxtajEiLCJhaWQiOiJ0Ml96Y3p0bmxtajEiLCJsY2EiOjE3MTQ0NDc3NDk5NjYsInNjcCI6ImVKeGtrZEdPdERBSWhkLWwxejdCX3lwX05odHNjWWFzTFFhb2szbjdEVm9jazcwN2NMNGlIUDhuS0lxRkxFMnVCS0drS1dFRld0T1VOaUx2NTh5OU9aRUZTeUZUUjg0M3l3b2thVXBQVW1ONXB5bFJ3V1prTGxmYXNVS0RCNllwVlM2WjIwS1BTNXZRM0kxRnowNk1xbHhXSHRUWW8zSnBiR01LMnhQanpjWnFReXF1eTZsTVlGa29uOFdMZnZ5Ry10WS1mN2JmaEhZd3JLZ0tEX1RPdUZ4d1lfSERGSGJfbnByMGJGMndxTDNYZzlRLTEtTjI3Yk5tb2RtNV9WelB2emFTY1RtRzVpZll2N3QtQ1IxNDVIbVpVUWN3WWcwX3lyQWo2X0N2T29ES0JRV01KWWhQSTVBcmwyX19KZGl1VGY4YXR5ZC0tR2JFVFdfNHJSbW81eExFb1VfajZ6Y0FBUF9fWERfZTR3IiwicmNpZCI6ImZjTXVQT2c1cUpwemhDV0JzQWFDQi14VGs5VkJ5NGFLdDVRRHVXRFo4eU0iLCJmbG8iOjJ9.qYGW3xFDYo6xZVMyDVzVmHL-mQGESJhL4443cBY48iFkZDWHbnC4ZIJqInnDjKESw2s7wbo_9_hKh2wrlzzURea9ajsfFiCqKzNhzfDZIQ5l8drnFe_YFOcwJ6sNF_OsHj97RhI87u1Mpg6ZZxwIbtibT8xovHewJsIjTg8_rOwUntyovSEadSAwMCAy6emAsowRbcG_9toYkuq0LaIo8jAomxC71Olq7hKL-SLvNoKWt80Z47xWVXOCov7triDtmiboLXgL33FmBKnh5B7J9szaHQTMGbQeQkF_FaKiSecIEGTKYzFJvAuiDMrykVJR4m7n0IAzaWrJNIhb6Ss5cg",
			domain: ".reddit.com",
			path: "/",
			expires: 1715318662.804979,
			size: 1291,
			httpOnly: true,
			secure: true,
			session: false,
			priority: "Medium",
			sameParty: false,
			sourceScheme: "Secure",
		},
		{
			name: "loid",
			value: "000000000zcztnlmj1.2.1714447749966.Z0FBQUFBQm1QRjRIcVM4LVM1WGVSSVFYcWd4SDFWbGx1NGFfOHpGZF9jVUtEV3Y3bDZkdldKZzMyems3VDdMdG1yTW5XOGVaXzIyOGltSnRTR192dVR5V0RvbGkteFNJYVhrTk1RRVpSYzFZYXZfMDAtZld4SGRmby1ETUoxdTZ2V0dRMG5QYXp3WW4",
			domain: ".reddit.com",
			path: "/",
			expires: 1749792262.804878,
			size: 226,
			httpOnly: false,
			secure: true,
			session: false,
			sameSite: "None",
			priority: "Medium",
			sameParty: false,
			sourceScheme: "Secure",
		},
		{
			name: "reddit_session",
			value: '"99757197271117,2024-05-09T05:24:23,2d25ef7af6265d739e0e27aff312cd8dd77bccba"',
			domain: ".reddit.com",
			path: "/",
			expires: 1749792262.349981,
			size: 91,
			httpOnly: true,
			secure: true,
			session: false,
			priority: "Medium",
			sameParty: false,
			sourceScheme: "Secure",
		},
		{
			name: "csv",
			value: "2",
			domain: ".reddit.com",
			path: "/",
			expires: 1749792259.194557,
			size: 4,
			httpOnly: false,
			secure: true,
			session: false,
			sameSite: "None",
			priority: "Medium",
			sameParty: false,
			sourceScheme: "Secure",
		},
		{
			name: "edgebucket",
			value: "ZayC9QuNjrw5Yf3dFC",
			domain: ".reddit.com",
			path: "/",
			expires: 1749792259.117767,
			size: 28,
			httpOnly: false,
			secure: true,
			session: false,
			priority: "Medium",
			sameParty: false,
			sourceScheme: "Secure",
		},
	],
};

async function start() {
	const bot = new RedditBrowserBot(botAccount);

	await bot.setup();

	// const loaded = await bot.loadSession(session);

	const session = await bot.generateSession();

	console.log(session);

	// const reply = await bot.reply({
	// 	type: "post",
	// 	remote_id: "1cab5bp",
	// 	group: "replyon",
	// 	reply_text: "test post 1",
	// });

	// console.log(reply);

	await bot.deleteReply({
		type: "post",
		group: "replyon",
		remote_id: "1cnh1b9",
		reply_remote_id: "l38oy7t",
	});

	await bot.teardown();
}

start();
