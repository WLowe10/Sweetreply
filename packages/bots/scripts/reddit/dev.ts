import { RedditBot } from "../../src/reddit";
import { redditInfo } from "../../secrets";
import { sleepRange } from "@sweetreply/shared/lib/utils";

const session = {
	cookies: [
		"loid=000000000yixu3u4ao.2.1713394883176.Z0FBQUFBQm1OUjhsR3VDTzFFV3R1a0ZkMW54dTN6QXhUUzVNNmlta0lSR0lnZ1FjTFFIMjAzeVNELTB1cnhUSS1ZaXc2Z1R5LVEtN2RESHp4VnpISG1SaXNlVTdyZEdRT29pQzRGT2tTZWpHSTFsYkJUb1RTOUpuQ092SGVTaDZ5amliQ2t3V3Z6WkY; Expires=Sun, 03 May 2026 17:30:13 GMT; Max-Age=63071999; Domain=reddit.com; Path=/; Secure",
		"session_tracker=mbffolcfrkpfpnbemr.0.1714757413931.Z0FBQUFBQm1OUjhtVm5iLXhoUjBRTk9sZ2dHZVNjUjg1VDZrR1hYUFFuUjg2cFR4aFFXOUJhSlFDek0xeV90ZEtzaFl6cWVrU3pfN01WdjZyVU9abnNpV0dybm40bFY1cFdyTGlZX3lVSmJFelROWmpNYlhVRmctTGdRTTlQWWRSbm9DUjVTczM4TG4; Expires=Fri, 03 May 2024 19:30:14 GMT; Max-Age=7199; Domain=reddit.com; Path=/; Secure",
		"reddit_session=97401946053696%2C2024-05-03T16%3A46%3A24%2Cbb36222cef20d138213010f7a7bdb5c3dfe461c9; Expires=Thu, 31 Dec 2037 23:59:59 GMT; Max-Age=431162014; Domain=reddit.com; Path=/; Secure; HttpOnly",
		"edgebucket=r2AVD8ETK9WoKCKleZ; Max-Age=63071999; Domain=reddit.com; Path=/; Secure",
		"csv=2; Max-Age=63072000; Domain=reddit.com; Path=/; Secure",
	],
};

async function test() {
	const bot = new RedditBot({
		username: redditInfo.username,
		password: redditInfo.password,
		proxy_host: null,
		proxy_port: null,
		proxy_user: null,
		proxy_pass: null,
	});

	const loaded = await bot.loadSession(session);

	if (!loaded) {
		const newSession = await bot.generateSession();

		console.log("generated new session, sleeping");

		await sleepRange(5000, 10000);
	}

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
