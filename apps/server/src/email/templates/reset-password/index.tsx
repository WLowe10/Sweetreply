import { render } from "@faire/mjml-react/utils/render"
import { ResetPasswordEmail, subject } from "./template"
import { sendEmail, type SendTemplateEmailData } from "../../send-email"
import { env } from "../../../env"

export function sendResetPasswordEmail({ to, data }: SendTemplateEmailData<{ resetCode: string }>) {
	const resetPasswordLink = `${env.FRONTEND_URL}/auth/password/reset?code=${data.resetCode}`
	const { html } = render(<ResetPasswordEmail resetPasswordLink={resetPasswordLink} />)

	return sendEmail({
		to,
		data: {
			subject,
			body: html,
		},
	})
}
