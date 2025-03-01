import { openAI } from "@lib/client/openai";
import { replyPrompt, type ReplyPromptData } from "../prompts/reply-prompt-v3";
import { LeadPlatformType, ReplyCharacterLimit } from "@sweetreply/shared/features/leads/constants";

export const replyCompletion = async ({
	lead,
	project,
}: Omit<ReplyPromptData, "characterLimit">): Promise<string> => {
	const replyCharacterLimit = ReplyCharacterLimit[lead.platform as LeadPlatformType];
	const maxTokens =
		typeof replyCharacterLimit === "number" ? Math.ceil(replyCharacterLimit / 4) : 250;

	const prompt = replyPrompt({ project, lead, characterLimit: replyCharacterLimit });

	// anthropic

	// const completion = await anthropic.messages.create({
	// 	model: "claude-3-5-sonnet-20240620",
	// 	temperature: 0.2,
	// 	max_tokens: maxTokens,
	// 	system: prompt.system,
	// 	messages: [
	// 		{
	// 			role: "user",
	// 			content: prompt.user,
	// 		},
	// 	],
	// });

	// let replyText = "";

	// for (const chunk of completion.content) {
	// 	if (chunk.type === "text") {
	// 		replyText += chunk.text;
	// 	}
	// }

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
	// "meta/meta-llama-3-70b-instruct"

	// const result = (await replicate.run("meta/meta-llama-3-70b-instruct", {
	// 	input: {
	// 		prompt,
	// 		top_p: 0.9,
	// 		temperature: 0.25,
	// 		max_tokens: maxTokens,
	// 	},
	// })) as Array<string>;

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
