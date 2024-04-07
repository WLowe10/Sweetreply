import { RedditReplyEngine } from "../src/engines/reddit";
import { redditInfo } from "../secrets";

async function start() {
	const engine = new RedditReplyEngine({
		clientId: redditInfo.clientId,
		clientSecret: redditInfo.clientSecret,
		username: redditInfo.username,
		password: redditInfo.password,
	});

	const leads = await engine.getLeads({
		keywords: ["123awd646"],
		meta: {
			subreddit: "replyon",
		},
	});

	console.log(leads);
}

start();
