import axios from "axios";
import { userAgents } from "../../src/lib/constants";

async function test() {
	const client = axios.create({
		headers: {
			"User-Agent": userAgents.chrome,
		},
	});
}
