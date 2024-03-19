import { SendEmailCommandOutput } from "@aws-sdk/client-ses"
import { SES } from "../lib/client/aws"

export type SendTemplateEmailData<T = object> = {
	to: string[]
	data: T
}

export type SendEmailData = {
	source?: string
	replyTo?: string[]
	to: string[]
	data: {
		subject: string
		body: string
	}
}

export function sendEmail(email: SendEmailData): Promise<SendEmailCommandOutput> {
	const source = email.source || `"Cybership.io" <account@cybership.io>`
	const replyTo = email.replyTo || [`"Cybership.io Support" <jeff@cybership.io>`]

	return SES.sendEmail({
		Source: source,
		ReplyToAddresses: replyTo,
		Destination: {
			ToAddresses: email.to,
		},
		Message: {
			Subject: {
				Data: email.data.subject,
			},
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: email.data.body,
				},
				// Text: {
				// 	Charset: "UTF-8",
				// 	Data: htmlToText(email.data.body),
				// },
			},
		},
	})
}
