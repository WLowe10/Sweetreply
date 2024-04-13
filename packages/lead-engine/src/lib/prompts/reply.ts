export type ReplyPromptType = {
	product_name: string;
	product_url: string;
	product_description: string;
	post_content: string;
};

export const replyPrompt = (data: ReplyPromptType) =>
	`**Considering the following product information:**

* Product Name: ${data.product_name}
* Product URL: ${data.product_url}
* Product Description: ${data.product_description}

**Analyze the provided social media post:**

${data.post_content}

**Should the user reply to this post? (yes/no)**

**If yes, generate a reply that considers the following:**

* The tone and sentiment of the social media post.
* The relevance of the user's product to the post.
* Providing value or addressing any questions raised in the post.
* Keeping the reply concise and engaging.

**Output:**

* Should reply (yes/no)
* Reply text (if reply is yes)`;

const res = replyPrompt({
	post_content: "I want a cool bus",
	product_description: "A cool bus",
	product_name: "Cool Bus",
	product_url: "https://coolbus.com",
});

console.log(res);
