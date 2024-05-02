import type { Project, Lead } from "@sweetreply/prisma";
import { LeadPlatform } from "@sweetreply/shared/features/leads/constants";

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
	const userTypeText = lead.platform === LeadPlatform.REDDIT ? `redditor` : `social media user`;
	const platformText = lead.platform === LeadPlatform.REDDIT ? `Reddit` : `social media`;

	const productURL =
		project.website_url && project.reply_with_domain
			? new URL(project.website_url).hostname
			: project.website_url;

	const mentionMode =
		project.reply_mention_mode === "name" || !productURL
			? "name"
			: project.reply_mention_mode === "url"
				? "url"
				: "name or url";

	return {
		system: `You are a friendly and helpful ${userTypeText}
Given a ${platformText} post and information about a product, provide a reply to the post that takes the following into account:
- Match the tone of the post
- Provide a formal reply
- You have used the product and therefore can give a worthy shout out to it. You have no affiliations with the product.
- Make sure to mention the product in some capacity, feel free to include a personal anecdote.
- Prioritize a genuine interaction and attempt to fulfill what the post requests (if they ask questions, offer valuable advice)
- This reply will be the only interaction, there will not be any further communication.
- The reply should sound like the average helpul ${userTypeText} response.

You will simply output a text response that represents the reply. ${typeof characterLimit === "number" ? `The reply must not be longer than ${characterLimit} characters.` : ""} Only reference the product by its ${mentionMode}.`,
		user: `${project.reply_custom_instructions ? `${project.reply_custom_instructions}\n\n` : ""}${platformText} post: 
\`\`\`
${lead.title ? `${lead.title}. ` : ""}${lead.content}
\`\`\`

${project.reply_mention_mode === "name" || !productURL ? `Product name: ${project.name}` : project.reply_mention_mode === "url" && productURL ? `Product url: ${productURL}` : project.reply_mention_mode === "name_or_url" ? `Product name: ${project.name}\nProduct url: ${productURL}` : ""}
Product description: ${project.description}`,
	};
};

// console.log(
// 	replyPrompt({
// 		lead: {
// 			platform: "test",
// 			title: null,
// 			content: "I am looking for a lawn mowing service in Olathe, KS. Any recommendations?",
// 		},
// 		project: {
// 			name: "Olathe Mowing CO",
// 			website_url: "https://olathemowingco.com",
// 			// website_url: null,
// 			reply_mention_mode: "name_or_url",
// 			description: "Olathe mowing co mows your lawn for cheap",
// 			reply_with_domain: true,
// 			reply_custom_instructions: null,
// 		},
// 	})
// );
