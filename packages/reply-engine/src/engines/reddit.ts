import Snoowrap from "snoowrap";
import type { GetLeadsInput, IReplyEngine, ReplyInput } from "../types";

export type RedditReplyEngineOptions = {
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
	userAgent?: string;
};

const chromeUserAgent =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export class RedditReplyEngine implements IReplyEngine {
	private reddit: Snoowrap;

	constructor(opts: RedditReplyEngineOptions) {
		this.reddit = new Snoowrap({
			clientId: opts.clientId,
			clientSecret: opts.clientSecret,
			username: opts.username,
			password: opts.password,
			userAgent: opts.userAgent ?? chromeUserAgent,
		});
	}

	public async getLeads(input: GetLeadsInput) {
		const submissions = await this.reddit.search({
			query: "hello AND world AND sweetreply NOT from",
			time: "all",
		});

		console.log(submissions);

		const filteredSubmissions = submissions.filter(
			(submission) => submission.subreddit_type === "public"
		);

		const leads = filteredSubmissions.map(async (submission) => ({
			subreddit_id: await submission.subreddit.id,
			subreddit_name: await submission.subreddit.display_name,
			// content: submission.
			// url: submission.url,
			post_id: submission.id,
		}));

		return await Promise.all(leads);
	}

	public async reply({ lead, ctx }: ReplyInput) {
		const replyMessage = await ctx.generateReply();
		const replyablePost = this.reddit.getSubmission(lead.postId).reply(replyMessage);

		await replyablePost;
	}
}
