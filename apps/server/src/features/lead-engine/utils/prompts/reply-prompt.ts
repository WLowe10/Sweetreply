import { LeadPlatform } from "@sweetreply/shared/features/leads/constants";
import type { Project, Lead } from "@sweetreply/prisma";

export type ReplyPromptData = {
	project: Pick<
		Project,
		| "name"
		| "reply_mention_mode"
		| "reply_with_domain"
		| "website_url"
		| "description"
		| "reply_custom_instructions"
	>;
	lead: Pick<Lead, "platform" | "title" | "content">;
	characterLimit?: number;
};

export const replyPrompt = ({ project, lead, characterLimit }: ReplyPromptData) => {
	const platformText = lead.platform === LeadPlatform.REDDIT ? `Reddit` : `social media`;

	const productURL =
		project.website_url && project.reply_with_domain
			? new URL(project.website_url).hostname
			: project.website_url;

	return {
		// OLD system: `Craft genuine replies promoting dynamically specified products in response to relevant social media posts. Prioritize genuine interaction by directly addressing the questions or issues raised by the original poster. Offer valuable advice related to their inquiry while keeping the response brief and to the point. Share personal anecdotes and experiences highlighting aspects of the product that are explicitly mentioned in the product description or specifications and could help address the poster's concerns. Keep the response within a character limit of 4096, avoiding unrealistically enthusiastic language, emojis, hashtags, and mentioning the original poster. The tone should be helpful and authentic, focusing on providing practical assistance within the bounds of the product's description. There will be no further communication with the user.`,
		system: `Reply to a social media post with a helpful response relevant to the poster's query or situation. Integrate a subtle mention of the specified dynamic product provided in a natural and non-affiliated manner, without expanding its description. Ensure the reply sounds human, maintaining a formal and concise tone without resembling a sales pitch or containing emojis, hashtags, or symbols. The response should be less than ${characterLimit} characters.`,
		user: `${project.reply_custom_instructions ? `${project.reply_custom_instructions}\n\n` : ""}Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

${project.reply_mention_mode === "name" || !productURL ? `Product name: ${project.name}` : project.reply_mention_mode === "url" && productURL ? `Product url: ${productURL}` : project.reply_mention_mode === "name_or_url" ? `Product name: ${project.name}\nProduct url: ${productURL}` : ""}
Product description: ${project.description}`,
	};
};
