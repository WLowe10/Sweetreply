import { RedditEngine } from "../../src/bots/reddit/engine";
import { redditInfo } from "../../secrets";

async function start() {
	const engine = new RedditEngine({
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
