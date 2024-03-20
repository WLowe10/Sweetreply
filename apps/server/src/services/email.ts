import { render } from "@faire/mjml-react/utils/render";
import { createElement } from "react";
import { ses } from "@/lib/client/aws";
import { WelcomeEmail, subject as welcomeEmailSubject, type WelcomeEmailProps } from "../email/templates/welcome";

export type SendEmailData = {
	to: string[];
	source?: string;
	replyTo?: string[];
	subject: string;
	body: string;
};

export type SendTemplateEmailData<T = object> = {
	to: string[];
	data: T;
};

export type RenderedTemplateType = {
	html: string;
	subject: string;
};

export class EmailService {
	public sendEmail(email: SendEmailData) {
		// ? figure this out

		const source = email.source || `"Replyon" <account@replyon.com>`;
		const replyTo = email.replyTo || [`"Replyon Support" <wes@replyon.com>`];

		return ses.sendEmail({
			Source: source,
			ReplyToAddresses: replyTo,
			Destination: {
				ToAddresses: email.to,
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

	public sendWelcomeEmail(data: SendTemplateEmailData<WelcomeEmailProps>) {
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
}

export const emailService = new EmailService();
