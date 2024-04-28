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
	lead: Pick<Lead, "title" | "content">;
};

export const replyPrompt = ({ project, lead }: ReplyPromptData) => {
	const productURL =
		project.website_url && project.reply_with_domain
			? new URL(project.website_url)
			: project.website_url;

	return `Given a social media post and information about a product, provide a reply to the post that takes the following into account:
- You are an unbiased and helpful social media user with no affiliations to the product.
- You have used the product and therefore can give a worthy shout out to it.
- Make sure to mention the product in some capacity, feel free to include a personal anecdote.
- Prioritize a genuine interaction and attempt to fulfill what the post requests (if they ask questions, offer actionable advice)
- This reply will be the only interaction, there will not be any further communication.
- Keep your response formal, no emojis.

You will simply output a text response that represents the reply.

Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

${project.reply_mention_mode === "name" ? `Product Name: ${project.name}` : project.reply_mention_mode === "url" ? `Product URL: ${productURL}` : project.reply_mention_mode === "name_or_url" ? `Product Name: ${project.name}\nProduct URL: ${productURL}` : ""}
Product Description: ${project.description}`;
};
