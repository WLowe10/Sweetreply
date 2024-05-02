import { render } from "@faire/mjml-react/utils/render";
import { createElement } from "react";
import { ses } from "@lib/client/aws";
import { env } from "@env";
import {
	WelcomeEmail,
	subject as welcomeEmailSubject,
	type WelcomeEmailProps,
} from "./templates/welcome";
import {
	VerifyAccountEmail,
	subject as verifyAccountEmailSubject,
	type VerifyAccountEmailProps,
} from "./templates/verify-account";
import {
	PasswordResetEmail,
	subject as passwordResetEmailSubject,
	type PasswordResetEmailProps,
} from "./templates/password-reset";

export type SendEmailData = {
	to: string | string[];
	source?: string;
	replyTo?: string[];
	subject: string;
	body: string;
};

export type SendTemplateEmailData<T = object> = {
	to: string | string[];
	data: T;
};

export type RenderedTemplateType = {
	html: string;
	subject: string;
};

export async function sendEmail(email: SendEmailData) {
	const source = email.source || `"Sweetreply" <notifications@${env.AWS_SES_SENDER}>`;
	const to = Array.isArray(email.to) ? email.to : [email.to];
	// const replyTo = email.replyTo || [`"Sweetreply Support" <wes@${env.AWS_SES_SENDER}>`];

	return ses.sendEmail({
		Source: source,
		// ReplyToAddresses: replyTo,
		Destination: {
			ToAddresses: to,
		},
		Message: {
			Subject: {
				Data: email.subject,
			},
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: email.body,
				},
			},
		},
	});
}

export function renderTemplate<T extends React.FC<any>>({
	template,
	subject,
	data,
}: {
	template: T;
	subject: string | ((props: Parameters<T>[0]) => string);
	data: Parameters<T>[0];
}): RenderedTemplateType {
	const { html } = render(createElement(template, data));
	const renderedSubject = typeof subject === "function" ? subject(data) : subject;

	return {
		html,
		subject: renderedSubject,
	};
}

export async function sendWelcome(data: SendTemplateEmailData<WelcomeEmailProps>) {
	const { html, subject } = renderTemplate({
		template: WelcomeEmail,
		subject: welcomeEmailSubject,
		data: data.data,
	});

	return sendEmail({
		to: data.to,
		subject,
		body: html,
	});
}

export async function sendVerification(data: SendTemplateEmailData<VerifyAccountEmailProps>) {
	const { html, subject } = renderTemplate({
		template: VerifyAccountEmail,
		subject: verifyAccountEmailSubject,
		data: data.data,
	});

	return sendEmail({
		to: data.to,
		subject,
		body: html,
	});
}

export async function sendPasswordReset(data: SendTemplateEmailData<PasswordResetEmailProps>) {
	const { html, subject } = renderTemplate({
		template: PasswordResetEmail,
		subject: passwordResetEmailSubject,
		data: data.data,
	});

	return sendEmail({
		to: data.to,
		subject,
		body: html,
	});
}
