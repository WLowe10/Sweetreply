import { z } from "zod";

export const tokenCheckoutMetadataSchema = z.object({
	project_id: z.string(),
	token_amount: z.coerce.number(),
});

export type TokenCheckoutMetadataType = z.infer<typeof tokenCheckoutMetadataSchema>;
