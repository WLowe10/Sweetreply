import { RedditBot } from "../../src/reddit";
import { redditInfo } from "../../secrets";
import { sleepRange } from "@sweetreply/shared/lib/utils";

const session = {
	cookies: [
		"loid=000000000zvjlde6cx.2.1715097571894.Z0FBQUFBQm1Pa19rOWZtc01SMXdQQlRkQXBjZlhPRVBiUTMtNDNxUExOWjlOeGJ5Nmx3emVuV01EZXRFQ09wSUhYQXpNUVJTa3Q4TG92YTBaS1dKa3hjenI4Um8xc3J3ZVI2Ulg2R052TFkwNHkzTGpyN1Q0MWs0LWYwdjB1aU1tbTkwZGYtWkZyX3k; Expires=Thu, 07 May 2026 15:59:32 GMT; Max-Age=63071999; Domain=reddit.com; Path=/; Secure",
		"session_tracker=hiommcmpdlhbrilojb.0.1715097571902.Z0FBQUFBQm1Pa19rYmNpUDNWXzh5MzQ2WGdYd1p6aHJDa0J5bFpieU1uWGFxYnMwZDUyOVkzUFVHb2FIYkVCQVdtZ0JEVDhaTlJzc2hNaXRuTXY2MTZKbVRENjlDMWFiN0FRVU1qY3RITmYxdWNFYTBCcXFOVzZUeUFjb0xhMkFsdHZld2VWZU4yd3I; Expires=Tue, 07 May 2024 17:59:32 GMT; Max-Age=7199; Domain=reddit.com; Path=/; Secure",
		"reddit_session=100912551618637%2C2024-05-07T15%3A59%3A32%2C16be8cb54337a45313c615d7a2563b08efc63c40; Expires=Thu, 31 Dec 2037 23:59:59 GMT; Max-Age=430819226; Domain=reddit.com; Path=/; Secure; HttpOnly",
		"edgebucket=YdUid2f5eXa0CHM1S7; Max-Age=63071999; Domain=reddit.com; Path=/; Secure",
	],
};

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: "test",
		proxy_host: redditInfo.proxy_host,
		proxy_port: redditInfo.proxy_port,
		proxy_user: redditInfo.proxy_user,
		proxy_pass: redditInfo.proxy_pass,
	});

	// const newSession = await bot.generateSession();

	// console.log(newSession);

	const loaded = await bot.loadSession(session);

	if (!loaded) {
		await bot.generateSession();

		console.log("generated new session, sleeping");

		await sleepRange(5000, 10000);
	}

	// const result = await bot.reply({
	// 	remote_id: "1cl15rl",
	// 	type: "post",
	// 	reply_text: `hello world post test ${Date.now()}`,
	// 	group: "replyon",
	// });

	// console.log(result);

	// --- Delete Comment ---

	// console.log("deleting comment");

	// await bot.deleteReply({
	// 	type: "comment",
	// 	group: "replyon",
	// 	remote_parent_id: "1cl15rl",
	// 	reply_remote_id: "l300qap",
	// });

	console.log("done");
}

test();
