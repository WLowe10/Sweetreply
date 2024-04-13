import { RedditBot } from "../../src/engines/reddit/bot";
import { redditInfo } from "../../secrets";

async function testBot() {
	const redditBot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	await redditBot.login();

	// should consider delays between significant requests (POST)

	await redditBot.comment({
		postId: "1bxqprr",
		subredditName: "tarkovroyale",
		content: `Hello world ${Date.now()}`,
	});
}

testBot();
