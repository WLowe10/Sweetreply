import { render } from "@faire/mjml-react/utils/render";
import { createElement } from "react";
import { ses } from "@/lib/client/aws";
import {
	WelcomeEmail,
	subject as welcomeEmailSubject,
	type WelcomeEmailProps,
} from "../email/templates/welcome";
import {
	VerifyAccountEmail,
	subject as verifyAccountEmailSubject,
	type VerifyAccountEmailProps,
} from "../email/templates/verify-account";
import {
	PasswordResetEmail,
	subject as passwordResetEmailSubject,
	type PasswordResetEmailProps,
} from "../email/templates/password-reset";
import { TeamInvitationEmail, TeamInvitationEmailProps } from "./templates/team-invitation";

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
		const source = email.source || `"Sweetreply" <account@sweetreply.com>`;
		const replyTo = email.replyTo || [`"Sweetreply Support" <wes@sweetreply.com>`];
		const to = Array.isArray(email.to) ? email.to : [email.to];

		return ses.sendEmail({
			Source: source,
			ReplyToAddresses: replyTo,
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

	public sendTeamInvitation(data: SendTemplateEmailData<TeamInvitationEmailProps>) {
		const { html, subject } = this.renderTemplate({
			template: TeamInvitationEmail,
			subject: passwordResetEmailSubject,
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
