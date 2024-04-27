import "dotenv/config";
import { parse, highlight, test } from "liqe";

async function start() {
	// const text = "I am looking for place to repair my lawn mower in California!";
	const text = "I am looking for a lawn mowing gang in California!";
	const query = parse(
		`lawn AND mowing AND (service OR company OR crew) AND california NOT repair`
	);

	console.log("checking match");
	const isMatch = test(query, {
		text,
	});

	console.log(isMatch);
}

start();
