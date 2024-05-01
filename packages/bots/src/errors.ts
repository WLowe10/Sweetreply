export class BotError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class LockLead extends BotError {
	constructor(message?: string) {
		super(message);
	}
}

export class FatalBotError extends BotError {
	constructor(message?: string) {
		super(message);
	}
}

export class Banned extends FatalBotError {
	constructor(message?: string) {
		super(message);
	}
}
