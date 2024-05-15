import { openAI } from "@lib/client/openai";
import { replyPrompt } from "../prompts/reply-prompt-v2.5";
import { LeadPlatformType, ReplyCharacterLimit } from "@sweetreply/shared/features/leads/constants";
import type { ReplyPromptData } from "../prompts/reply-prompt-v2";

export const replyCompletion = async ({
	lead,
	project,
}: Omit<ReplyPromptData, "characterLimit">): Promise<string> => {
	const replyCharacterLimit = ReplyCharacterLimit[lead.platform as LeadPlatformType];
	const maxTokens =
		typeof replyCharacterLimit === "number" ? Math.ceil(replyCharacterLimit / 4) : 1250;

	const prompt = replyPrompt({ project, lead, characterLimit: replyCharacterLimit });

	// openai

	const completion = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 0.25,
		max_tokens: maxTokens,
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	let replyText = completion.choices[0].message.content as string;

	// ollama

	// const response = await ollama.chat({
	// 	model: "llama3",
	// 	options: {
	// 		temperature: 0.25,
	// 	},
	// 	messages: [
	// 		{
	// 			role: "user",
	// 			content: prompt,
	// 		},
	// 	],
	// });

	// let replyText = response.message.content;

	//

	// replicate

	// const replicate = new Replicate({
	// 	auth: "",
	// });

	// const result = await replicate.run("mistralai/mixtral-8x7b-instruct-v0.1", {
	// 	input: {
	// 		system_prompt: system,
	// 		prompt: user,
	// 		temperature: 0.6,
	// 		length_penalty: 1,
	// 		max_new_tokens: 1024,
	// 		prompt_template: "<s>[INST] {prompt} [/INST] ",
	// 		presence_penalty: 0,
	// 	},
	// });

	// let replyText = result.join("");

	//

	replyText = replyText.trim();

	if (replyText.length < 10) {
		throw new Error("Generated reply is too short");
	}

	if (replyText.length > replyCharacterLimit) {
		throw new Error("Generated reply is too long for the lead's platform");
	}

	const firstChar = replyText.charAt(0);
	const lastChar = replyText.charAt(replyText.length - 1);

	// sometimes the prompts include quotes, so we need to remove them
	if (firstChar === lastChar && (firstChar === `'` || firstChar === '"')) {
		replyText = replyText.slice(1, -1);
	}

	return replyText;
};
