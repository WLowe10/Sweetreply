import { IReplyEngine } from "./types";

export class Processor {
	private engine: IReplyEngine;

	constructor(replyEngine: IReplyEngine) {
		this.engine = replyEngine;
	}

	public async start() {
		let leads;

		try {
			leads = await this.engine.getLeads({
				keywords: ["replyon", "check", "cool"],
				negativeKeywords: ["from"],
				// meta: {
				// 	subreddit: "replyon"
				// }
			});
		} catch (error) {
			throw new Error("Failed to get leads");
		}

		// for (const lead of leads) {
		// 	await this.engine.reply({
		// 		lead,
		// 		ctx: {
		// 			generateReply: this.generateReply,
		// 		},
		// 	});

		// 	// after a successful reply, subtract a credit from the user
		// }
	}
}
