import { projectNotFound } from "@/features/projects/errors";
import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { leadNotFound } from "../errors";
import { RedditBot } from "@sweetreply/bots";
import { TRPCError } from "@trpc/server";
import { sleep } from "@sweetreply/shared/lib/utils";

const deleteReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const deleteReplyHandler = authenticatedProcedure
	.input(deleteReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.prisma.lead.findUnique({
			where: {
				id: input.lead_id,
			},
		});

		if (!lead) {
			throw leadNotFound();
		}

		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: lead.project_id,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		if (lead.reply_bot_id === null) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "This lead has no reply",
			});
		}

		const botAccount = await ctx.prisma.bot.findUnique({
			where: {
				id: lead.reply_bot_id,
			},
		});

		if (!botAccount) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete reply",
			});
		}

		try {
			if (lead.platform === "reddit") {
				const bot = new RedditBot({
					username: botAccount.username,
					password: botAccount.password,
				});

				await bot.login();

				await sleep(2500);

				await bot.deleteComment({
					commentId: lead.remote_reply_id,
					subredditName: lead.channel,
				});
			}
		} catch {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete reply",
			});
		}

		// todo add delete functionality
	});
