import "dotenv/config";
import { parse, highlight, test } from "liqe";

async function start() {
	// const text = "I am looking for place to repair my lawn mower in California!";
	const text = "I am looking for an AI chat bot";
	const query = parse(`AI AND (chatbot OR chat bot)`);

	console.log("checking match");

	const isMatch = test(query, {
		text,
	});

	console.log(isMatch);
}

start();
