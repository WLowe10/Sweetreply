export type GetLeadsInput<T = any> = {
	keywords: string[];
	negativeKeywords?: string[];
	meta?: T;
};

export type ReplyInput<T = any> = {
	lead: T;
	ctx: {
		generateReply(): Promise<string>;
	};
};

export interface IReplyEngine {
	getLeads: (input: GetLeadsInput) => any[] | Promise<any[]>;
	reply: (input: ReplyInput) => void;
}
