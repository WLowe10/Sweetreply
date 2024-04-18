import { RedditBot } from "../../src/bots/reddit";
import { redditInfo } from "../../secrets";

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	await bot.login();

	await new Promise((res) => setTimeout(res, 1000));

	console.log("commenting");

	await bot.comment({
		postId: "1c6fb2j",
		targetType: "post",
		content: `hello world ${Date.now()}`,
		subredditName: "replyon",
	});
}

test();
