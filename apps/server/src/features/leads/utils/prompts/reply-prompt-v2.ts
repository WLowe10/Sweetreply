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
	const productURL =
		project.website_url && project.reply_with_domain
			? new URL(project.website_url).hostname
			: project.website_url;

	return {
		system: `Reply to a social media post with a helpful response relevant to the poster's query or situation. The response must integrate a subtle mention of the specified product provided in a natural and non-affiliated manner, without expanding its description. Ensure the reply sounds human, maintaining a formal and concise tone without resembling a sales pitch. The reply should be concise, straight to the point, and should not contain emojis, hashtags, or symbols.`,
		user: `${project.reply_custom_instructions ? `${project.reply_custom_instructions}\n\n` : ""}${project.reply_mention_mode === "name" || !productURL ? `Product name: ${project.name}` : project.reply_mention_mode === "url" && productURL ? `Product url: ${productURL}` : project.reply_mention_mode === "name_or_url" ? `Product name: ${project.name}\nProduct url: ${productURL}` : ""}
Product description: ${project.description}
		
Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\``,
	};
};
