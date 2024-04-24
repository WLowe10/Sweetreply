import type { Lead, Project } from "@sweetreply/prisma";

export type ShouldReplyPromptData = {
	project: Pick<Project, "name" | "description">;
	lead: Pick<Lead, "title" | "content">;
};

export const shouldReplyPrompt = ({ lead, project }: ShouldReplyPromptData) => {
	return `You are an online marketer. You are looking for posts to shoutout your product.

Given a social media post and the information of a product, determine whether the post should be replied to with a mention of the product.

Output a boolean representing if the post should be replied to.

When making this determination take into account:
- The tone and sentiment of the social media post.
- If a helpful response could be made, then it should
- If the post is relevant to the product

Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

Product Name: ${project.name}
Product Description: ${project.description}`;
};
