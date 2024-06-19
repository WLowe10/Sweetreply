import { z } from "zod";

export const subredditNameSchema = z
	.string()
	.min(3, {
		message: "The name of a subreddit cannot be less than 3 characters",
	})
	.max(21, {
		message: "The name of a subreddit cannot be longer than 21 characters",
	});
