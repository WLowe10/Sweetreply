import { z } from "zod";

export const subscriptionMetadataSchema = z.object({
	user_id: z.string(),
});

export type SubscriptionMetadataType = z.infer<typeof subscriptionMetadataSchema>;
