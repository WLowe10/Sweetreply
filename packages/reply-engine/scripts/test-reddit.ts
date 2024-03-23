import { Processor } from "../src/processor";
import { RedditReplyEngine } from "../src/engines/reddit";
import { redditInfo } from "../secrets";

async function start() {
	const processor = new Processor(
		new RedditReplyEngine({
			clientId: redditInfo.clientId,
			clientSecret: redditInfo.clientSecret,
			username: redditInfo.username,
			password: redditInfo.password,
		})
	);

	await processor.start();
}

start();
