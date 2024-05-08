import type { Lead, Project } from "@sweetreply/prisma";

export type ShouldReplyPromptData = {
	project: Pick<Project, "name" | "description">;
	lead: Pick<Lead, "title" | "content">;
};

export const shouldReplyPrompt = ({ lead, project }: ShouldReplyPromptData) => {
	return {
		system: "Given a text-based social media post and information about a product, determine if the post represents a viable marketing opportunity. Only output a boolean representing if the media post could be effectively replied to with a mention of the product.",
		user: `Social media post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

Product name: ${project.name}
Product description: ${project.description}`,
	};
};
