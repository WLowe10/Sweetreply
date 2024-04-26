import { render } from "@faire/mjml-react/utils/render";
import { createElement } from "react";
import { ses } from "@/lib/client/aws";
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
// import {
// 	LowOnTokensEmail,
// 	subject as lowOnTokensEmailSubject,
// 	type LowOnTokensEmailProps,
// } from "./templates/low-on-replies";
import { env } from "@/env";

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

export class EmailService {
	public sendEmail(email: SendEmailData) {
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

	public renderTemplate<T extends React.FC<any>>({
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

	public sendWelcome(data: SendTemplateEmailData<WelcomeEmailProps>) {
		const { html, subject } = this.renderTemplate({
			template: WelcomeEmail,
			subject: welcomeEmailSubject,
			data: data.data,
		});

		return this.sendEmail({
			to: data.to,
			subject,
			body: html,
		});
	}

	public sendVerification(data: SendTemplateEmailData<VerifyAccountEmailProps>) {
		const { html, subject } = this.renderTemplate({
			template: VerifyAccountEmail,
			subject: verifyAccountEmailSubject,
			data: data.data,
		});

		return this.sendEmail({
			to: data.to,
			subject,
			body: html,
		});
	}

	public sendPasswordReset(data: SendTemplateEmailData<PasswordResetEmailProps>) {
		const { html, subject } = this.renderTemplate({
			template: PasswordResetEmail,
			subject: passwordResetEmailSubject,
			data: data.data,
		});

		return this.sendEmail({
			to: data.to,
			subject,
			body: html,
		});
	}

	// public sendTeamInvitation(data: SendTemplateEmailData<TeamInvitationEmailProps>) {
	// 	const { html, subject } = this.renderTemplate({
	// 		template: TeamInvitationEmail,
	// 		subject: passwordResetEmailSubject,
	// 		data: data.data,
	// 	});

	// 	return this.sendEmail({
	// 		to: data.to,
	// 		subject,
	// 		body: html,
	// 	});
	// }

	public sendLowOnTokens(data: SendTemplateEmailData<LowOnTokensEmailProps>) {
		const { html, subject } = this.renderTemplate({
			template: LowOnTokensEmail,
			subject: lowOnTokensEmailSubject,
			data: data.data,
		});

		return this.sendEmail({
			to: data.to,
			subject,
			body: html,
		});
	}
}

export const emailService = new EmailService();
