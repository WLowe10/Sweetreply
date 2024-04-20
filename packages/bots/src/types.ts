export type ProxyType = {
	host: string;
	port: number;
	username: string;
	password: string;
};

export type GetLeadsInput<T = any> = {
	keywords: string[];
	negativeKeywords?: string[];
	meta?: T;
};

export type ReplyInput<T = any> = {
	lead: T;
};

export interface IEngine {
	getLeads: (input: GetLeadsInput) => any[] | Promise<any[]>;
	reply: (input: ReplyInput) => void;
}

export interface IBot {
	login: () => Promise<void>;
}
