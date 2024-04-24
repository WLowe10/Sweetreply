import type { Project, Lead } from "@sweetreply/prisma";

export type ReplyPromptData = {
	project: Pick<
		Project,
		"name" | "reply_mention_mode" | "website_url" | "description" | "reply_custom_instructions"
	>;
	lead: Pick<Lead, "title" | "content">;
};

export const replyPrompt = ({ project, lead }: ReplyPromptData) => {
	return `You are an active social media user. Analyze the social media post to understand the user's situation, tone, and sentiment. Prioritize generating helpful and unbiased responses that address the user's needs. Reply while promoting a product.

Prioritize genuine engagement. Aim to build trust and brand awareness, even if a direct product promotion isn't appropriate.

Consider including a personal anecdote involving the product only if it adds genuine value and relates to the user's situation.
End with a positive and encouraging tone.

Try to keep the reply concise.

Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

${project.reply_mention_mode === "name" ? `Project Name: ${project.name}` : project.reply_mention_mode === "url" ? `Product URL: ${project.website_url}` : project.reply_mention_mode === "name_or_url" ? `Project Name: ${project.name}\nProduct URL: ${project.website_url}` : ""}
Project Description: ${project.description}`;
};
