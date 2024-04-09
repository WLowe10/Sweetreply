import Snoowrap from "snoowrap";
import type { GetLeadsInput, IReplyEngine, ReplyInput } from "../../utils/types";

export type RedditReplyEngineOptions = {
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
	userAgent?: string;
};

const chromeUserAgent =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export class RedditEngine implements IReplyEngine {
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
		const subredditToSearch = input.meta?.subreddit;

		// reddit boolean (AND, OR, NOT)
		let query = input.keywords.join(" AND ");

		if (input.negativeKeywords && input.negativeKeywords.length > 0) {
			query = query + ` NOT (${input.negativeKeywords.join(" OR ")})`;
		}

		if (query.length > 512) {
			throw new Error("Query is too long for reddit. The max length is 512 characters.");
		}

		console.log(`Querying reddit: ${query}`);

		const submissions = await this.reddit.search({
			query,
			time: "week",
			type: "link",
			// sort: "new", //? not working
			subreddit: subredditToSearch ?? "all",
			restrictSr: !!subredditToSearch,
			limit: 100,
		});

		// note: Selftext can be "" on reddit

		const leads = submissions.map(async (submission) => {
			// console.log(await submission.comments.fetchAll());
			return {
				platform: "reddit",
				username: await submission.author.name,
				full_name: await submission.author_fullname,
				remote_id: submission.id,
				remote_user_id: await submission.author.id,
				content: submission.selftext,
				channel: await submission.subreddit.display_name,
				remote_channel_id: await submission.subreddit_id,
				remote_url: submission.url,
				date: new Date(submission.created_utc * 1000).toISOString(),
			};
		});

		return await Promise.all(leads);
	}

	public async reply({ lead, ctx }: ReplyInput) {
		// const replyMessage = await ctx.generateReply();
		// const replyablePost = this.reddit.getSubmission(lead.postId).reply(replyMessage);
		// await replyablePost;
	}
}
