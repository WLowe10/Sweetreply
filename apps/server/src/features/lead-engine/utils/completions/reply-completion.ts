import { openAI } from "@lib/client/openai";
import Replicate from "replicate";
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

	// this model is generating good replies after a couple tests

	// const replicate = new Replicate({
	// 	auth: "",
	// });

	// const result = await replicate.run("meta/meta-llama-3-70b-instruct", {
	// 	input: {
	// 		top_k: 0,
	// 		top_p: 0.9,
	// 		prompt,
	// 		max_tokens: 512,
	// 		min_tokens: 0,
	// 		temperature: 0.25,
	// 		system_prompt: "You are a helpful assistant",
	// 		length_penalty: 1,
	// 		stop_sequences: "<|end_of_text|>,<|eot_id|>",
	// 		prompt_template:
	// 			"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
	// 		presence_penalty: 1.15,
	// 		log_performance_metrics: false,
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
