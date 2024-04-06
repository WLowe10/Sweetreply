import { IReplyEngine } from "./types";

export class Processor {
	private engine: IReplyEngine;

	constructor(replyEngine: IReplyEngine) {
		this.engine = replyEngine;
	}

	public async start() {
		const leads = await this.engine.getLeads({
			keywords: ["123awd646"],
		});

		console.log(leads);

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

	private async generateReply() {
		return "Check us out: https://example.com";
	}
}
