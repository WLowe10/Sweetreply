import { render } from "@faire/mjml-react/utils/render"
import { VerifyAccountEmail, subject } from "./template"
import { sendEmail, type SendTemplateEmailData } from "../../send-email"
import { env } from "../../../env"

export function sendVerifyAccountEmail({ to, data }: SendTemplateEmailData<{ verifyCode: string }>) {
	const verifyLink = `${env.FRONTEND_URL}/auth/verify?code=${data.verifyCode}`

	const { html } = render(<VerifyAccountEmail verifyLink={verifyLink} />)

	return sendEmail({
		to,
		data: {
			subject,
			body: html,
		},
	})
}
