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
		postId: "kzub0mc",
		targetType: "comment",
		content: "nested reply first automated test",
		subredditName: "replyon",
	});
}

test();
