import { env } from "@env";
import OpenAI from "openai";

export const openAI = new OpenAI({
	apiKey: env.OPEN_AI_KEY,
});
