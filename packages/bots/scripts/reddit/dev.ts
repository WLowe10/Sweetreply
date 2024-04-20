import { RedditBot } from "../../src/bots/reddit";
import { redditInfo } from "../../secrets";

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	await bot.login();

	await new Promise((res) => setTimeout(res, 1000));

	// console.log("commenting");

	// const result = await bot.comment({
	// 	postId: "1blgh0s",
	// 	targetType: "post",
	// 	content: `hello world post test ${Date.now()}`,
	// 	subredditName: "replyon",
	// });

	// console.log(result.contentText);

	// --- Delete Comment ---

	console.log("deleting comment");

	await bot.deleteComment({
		commentId: "l0gg",
		subredditName: "replyon",
	});

	console.log("deleted comment");
}

test();
