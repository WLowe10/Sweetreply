import OpenAI from "openai";

export class BaseReplyEngine {
	private openAI: OpenAI;

	constructor(openAIKey: string) {
		this.openAI = new OpenAI({
			apiKey: openAIKey,
		});
	}

	protected async generateReply() {
		const completion = await this.openAI.chat.completions.create({
			messages: [{ role: "system", content: "You are a helpful assistant." }],
			model: "gpt-3.5-turbo",
		});

		return completion.choices[0].message.content;
	}

	protected generateReplyTemplate() {
		return ``;
	}
}
