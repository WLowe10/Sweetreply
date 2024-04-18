export const projectConstants = {
	token_price: {
		base: 0.5,
		tiers: [
			{
				name: "Basic",
				maxTokens: 99,
				ppt: 0.5,
			},
			{
				name: "Pro",
				maxTokens: 249,
				ppt: 0.4,
			},
			{
				name: "Enterprise",
				maxTokens: Infinity,
				ppt: 0.25,
			},
		],
	},
};
