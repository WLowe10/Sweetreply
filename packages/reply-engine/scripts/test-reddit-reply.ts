import { RedditBot } from "../src/bots/reddit";
import { redditInfo } from "../secrets";

async function start() {
	const redditBot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	await redditBot.authenticate();

	await redditBot.comment({
		postId: "1bxqprr",
		subredditName: "tarkovroyale",
		content: "I love tarkov",
	});
}

start();
