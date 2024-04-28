import { replyCompletion } from "@features/lead-engine/utils/completions/reply-completion";
import { shouldReplyCompletion } from "@features/lead-engine/utils/completions/should-reply-completion";
import { ratelimitedPublicProcedure } from "@lib/trpc";
import { generatePlaygroundReplyInputSchema } from "@sweetreply/shared/features/playground/schemas";

export const generatePlaygroundReplyHandler = ratelimitedPublicProcedure
	.input(generatePlaygroundReplyInputSchema)
	.mutation(async ({ input }) => {
		const shouldReply = await shouldReplyCompletion({
			lead: {
				title: null,
				content: input.social_media_post,
			},
			project: {
				name: input.product_name,
				description: input.product_description,
			},
		});

		const reply = await replyCompletion({
			lead: {
				title: null,
				content: input.social_media_post,
			},
			project: {
				name: input.product_name,
				description: input.product_description,
				reply_custom_instructions: null,
				reply_mention_mode: "name",
				website_url: null,
			},
		});

		return {
			shouldReply,
			reply,
		};
	});
