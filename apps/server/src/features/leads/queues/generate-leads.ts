import Queue from "bull";
import { RedditReplyEngine } from "@sweetreply/reply-engine";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export type GenerateLeadsJobData = {
	keywords: string[];
};

// ! still don't know how this ratelimiter works yet

const generateLeadsQueue = new Queue<GenerateLeadsJobData>("reply", env.REDIS_URL, {
	limiter: {
		max: 10,
		duration: 1000 * 60,
	},
});

generateLeadsQueue.process(async (job) => {
	logger.info("Generating leads");

	const engine = new RedditReplyEngine({
		clientId: env.REDDIT_CLIENT_ID,
		clientSecret: env.REDDIT_CLIENT_SECRET,
		username: env.REDDIT_USERNAME,
		password: env.REDDIT_PASSWORD,
	});

	const leads = await engine.getLeads({
		keywords: job.data.keywords,
	});

	const insertLeads = leads.map((lead) => ({
		...lead,
		team_id: "b195da58-4dfa-4bdd-87c9-81864d5616f1",
	}));

	console.log("Inserting leads", insertLeads);

	await prisma.lead.createMany({
		data: insertLeads,
	});
});

export { generateLeadsQueue };
