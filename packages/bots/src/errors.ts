export class BotError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class BotLeadLock extends BotError {
	constructor(message?: string) {
		super(message);
	}
}

export class BotAuthError extends BotError {
	constructor(message?: string) {
		super(message);
	}
}

export class BotReplyError extends BotError {
	public shouldLock: boolean;

	constructor(message?: string, shouldLock?: boolean) {
		super(message);
		this.shouldLock = shouldLock || false;
	}
}
