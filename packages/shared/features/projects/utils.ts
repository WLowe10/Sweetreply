import { projectConstants } from "./constants";

export const getTokensTier = (tokenAmount: number) => {
	for (const tier of projectConstants.token_price.tiers) {
		if (tokenAmount <= tier.maxTokens) {
			return tier;
		}
	}

	return null;
};

export const getTokensPrice = (tokenAmount: number) => {
	const tier = getTokensTier(tokenAmount);
	const pricePerToken = tier?.ppt ?? projectConstants.token_price.base;

	return pricePerToken * tokenAmount;
};
