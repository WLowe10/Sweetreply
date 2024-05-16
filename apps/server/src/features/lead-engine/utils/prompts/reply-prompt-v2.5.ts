import type { Project, Lead } from "@sweetreply/prisma";

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

// removed concise from the promot
export const replyPrompt = ({ project, lead, characterLimit }: ReplyPromptData) => {
	const productURL =
		project.website_url && project.reply_with_domain
			? new URL(project.website_url).hostname
			: project.website_url;

	const productName =
		project.reply_mention_mode === "name"
			? project.name
			: project.reply_mention_mode === "url"
				? productURL
				: Math.random() > 0.5
					? project.name
					: productURL;

	return `Reply to a social media post with a helpful response relevant to the poster's query or situation. The response must integrate a subtle mention of the specified product provided in a natural and non-affiliated manner, without expanding its description. Ensure the reply sounds human, maintaining a formal tone without resembling a sales pitch. The response should be less than ${characterLimit} characters and should not contain emojis, hashtags, or symbols.
	
Examples:

Product name: trustify.io

Product description: The only solution needed to revive, retain, and grow repeat customers - so you can keep costs low, support teams, and customers satisfied.

Social media post: Getting back into Poshmark after a hiatus. Wondering what best practices are—think some of what I used to do might be stale. I’m a posh ambassador II but not sure how much that helps me.

*sharing other’s listings - does this matter? Used to do this a lot back in the day and it seemed to help drive activity. *new listings - certain number to target per week? *sharing my own listings - do people actually find things in their feeds? *following new people - did this back in the day to get my follower count up but not sure it matters. *relisting unsold items after 60 days - do most ppl do this?

TIA and hope this can serve as helpful guidance to others.

Reply: Here's what's worked for me:

I used to focus on sharing my own listings regularly, but not too much. You don't want to spam people's feeds. I'd aim for 3-5 new listings a week. As for sharing others', it can help drive engagement, but don't overdo it. I'd say 2-3 shares a week max.

Following new people can help, but it's not as crucial as it used to be. I'd focus on engaging with your existing followers instead. Relisting unsold items after 60 days is a good idea, but make sure you're not just re-posting the same thing over and over.

By the way, I used trustify.io for my business and it helped me increase sales and customer retention. Anyway, hope this helps!


Product name: HandyHalo

Product description: Meet your new best friend, Halo the koala! HandyHalo is a virtual pet whose routine mirrors yours. Learn how to sleep again with a fun and effective app for insomnia developed at Stanford, in collaboration with top sleep psychologists, therapists, and researchers.

Social media post: I have statistics and paper 4 physics in a few hours and I'm out here watching ballet dawg 💀 Insomnia sucks fr tho

update: stats was a Godsend i did so well Alhamdulillah

physics was aight, i messed up a bit but it went well overall

staying awake for exams wasn't so bad

7/10 would do again

Reply: Stress can mess with sleep, especially before exams. Try some deep breathing or meditation to calm the mind. Maybe even some light reading in a subject you enjoy, just to distract yourself from the exams for a bit.

I had a similar issue, found that winding down before bed helped. I used HandyHalo, a virtual pet game, kinda helped me relax and get some sleep. Not saying it's a cure-all, but it was a chill way to end the day. Might work for you.

Good luck on your exams. Remember, staying up all night stressing won't help. Get whatever rest you can, your brain will thank you during the test.


Product name: surelabs.com

Product description: Get blood lab testing near you - no doctor visit needed. Over 100 blood tests online, pick a lab near you, our docs write the prescriptions & you get results by email & SMS!

Social media post: My 8-year-old mini dachshund, who I've had since he was a puppy, has severe anxiety that has only worsened over time. He barks nonstop and is constantly on edge, reacting to every little noise. The only time he calms down is at night in his crate. We've tried everything to help him, but nothing works. I'm worried his anxiety might cause serious health issues, so I'm considering medication. Has anyone had success with medication for their dog's anxiety? If so, what did the vet prescribe, and did it help your dog relax?

Reply: I used surelabs.com to get some blood work done on myself, and it was pretty insightful. Maybe you could look into getting some tests done on your dog to see if there's an underlying issue that's contributing to his anxiety.

As for medication, I'm not a vet, but it sounds like you've tried everything else. If you're at your wit's end, it might be worth exploring. I'm sure it's not an easy decision, but if it can improve your dog's quality of life, it might be worth considering.


Product name: ${productName}

Product description: ${project.description}

Social media post: ${lead.title ? `${lead.title}. ` : ""}${lead.content}

Reply:`;
};
