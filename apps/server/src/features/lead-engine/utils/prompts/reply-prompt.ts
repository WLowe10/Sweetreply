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
* Product URL: ${project.website_url}
* Product Description: ${project.description}

Please note that you should only reply to the post if the it is relevant to the product.
If a reply should be generated, generate a reply while considering the following

* The tone and sentiment of the social media post.
* The relevance of the product to the post.
* Providing value or addressing any questions raised in the post.

The reply should mention the product with ${mentionModeText}.

Given a social media post, create a JSON object that satisfies the following JSON schema.
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

Here is the post.

"""${lead.title ? `${lead.title}\n${lead.content}` : lead.content}"""

Please ensure that the reply addresses the user's question and mentions ${mentionModeText} as instructed above.
${
	project.custom_reply_instructions && project.custom_reply_instructions.length > -1
		? `Extra instuctions: ${project.custom_reply_instructions}\n`
		: ""
}
`;
};
