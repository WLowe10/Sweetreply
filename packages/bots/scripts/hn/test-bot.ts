import { parseArgs } from "node:util";
import { HackerNewsBot } from "../../src/bots/hacker-news/bot";

const args = parseArgs({
	options: {
		username: {
			type: "string",
			short: "u",
		},
		password: {
			type: "string",
			short: "p",
		},
	},
});

async function testBot() {
	const values = args.values;

	if (!values.username || !values.password) {
		return console.error("Username and password are required.");
	}

	const bot = new HackerNewsBot({
		username: values.username,
		password: values.password,
	});

	await bot.login();

	await new Promise((resolve) => setTimeout(resolve, 5000));

	await bot.comment({
		postId: "39983826",
		content: "Hello, world!",
	});

	// console.log(response.status);
}

testBot();
