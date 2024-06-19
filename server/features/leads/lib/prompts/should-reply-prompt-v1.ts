import type { Lead, Project } from "@prisma/client";

export type ShouldReplyPromptData = {
	project: Pick<Project, "name" | "description">;
	lead: Pick<Lead, "title" | "content">;
};

export const shouldReplyPrompt = ({ lead, project }: ShouldReplyPromptData) => {
	return `Given a social media post and information about a product, output only a boolean representing if the social media post could be effectively replied to with a mention of the product. 

Note: The post and the product do not have to strictly match, if they are within the same topic, that is worthy of a reply.

Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

Product name: ${project.name}
Product description: ${project.description}`;
};
