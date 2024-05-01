import { RedditBot } from "../../src/reddit";
import { redditInfo } from "../../secrets";
import { sleep, sleepRange } from "@sweetreply/shared/lib/utils";

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
	});

	await bot.login();

	await sleepRange(5000, 10000);

	await bot.reply({
		type: "comment",
		channel: "replyon",
		remote_id: "l25db21",
		reply_text: "test reply",
	});

	// console.log("commenting");

	// const result = await bot.comment({
	// 	postId: "1blgh0d",
	// 	targetType: "link",
	// 	content: `hello world post test ${Date.now()}`,
	// 	subredditName: "replyon",
	// });

	// console.log(result.contentText);

	// --- Delete Comment ---

	// console.log("deleting comment");

	// await bot.deleteComment({
	// 	commentId: "l0gg",
	// 	subredditName: "replyon",
	// });

	console.log("done");
}

test();
