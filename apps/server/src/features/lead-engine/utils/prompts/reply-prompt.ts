import type { Project, Lead } from "@sweetreply/prisma";

export type ReplyPromptData = {
	project: Project;
	lead: Lead;
};

export const replyPrompt = ({ project, lead }: ReplyPromptData) => {
	const mentionModeText =
		project.reply_mention_mode === "name"
			? "the product name"
			: project.reply_mention_mode === "name_or_url"
				? "the product name or URL"
				: "the product URL";

	return `You are a helpful, unbiased social media user.

Consider the following information about a product: 

* Product Name: ${project.name}
${
	project.reply_mention_mode === "name_or_url" || project.reply_mention_mode === "url"
		? `* Product URL: ${project.website_url}\n`
		: ""
}
* Product Description: ${project.description}

You should only generate a reply to the post if it is relevant to the product.

When generating a reply, take into account:

* The tone and sentiment of the social media post.
* The relevance of the product to the post.
* Providing value or addressing any questions raised in the post.

Please ensure that the reply addresses the user's questions or concerns directly and offers relevant information about the product.

The reply should mention the product with ${mentionModeText}. ${
		project.custom_reply_instructions && project.custom_reply_instructions.length > 0
			? project.custom_reply_instructions
			: ""
	}

Given a social media post, create a JSON object that satisfies the following JSON schema:
\`\`\`
{
    "type": "object",
    "properties": {
        "shouldReply": {
            "type": "boolean"
        },
        "reply": {
            "type": "string" // if shouldReply is false, reply should be undefined
        }
    }
}
\`\`\`

Here is the post:
\`\`\`${lead.title ? `${lead.title}\n${lead.content}` : lead.content}\`\`\``;
};
