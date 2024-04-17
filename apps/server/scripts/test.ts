import "dotenv/config";
import { generateReplyQueue } from "../src/features/lead-engine/queues/process-lead";

async function start() {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	generateReplyQueue.add({
		lead_id: "45345572-53ee-43ab-9a74-449db033f533",
	});
}

start();
