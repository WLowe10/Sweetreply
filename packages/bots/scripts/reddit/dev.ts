import { RedditBot } from "../../src/bots/reddit";
import { redditInfo } from "../../secrets";

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	console.log("logging in");

	await bot.login();

	await new Promise((res) => setTimeout(res, 1000));

	await bot.comment({
		postId: "1c4dbi3",
		content: "nested reply",
		subredditName: "replyon",
	});
}

test();
