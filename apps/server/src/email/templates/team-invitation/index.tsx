import { render } from "@faire/mjml-react/utils/render"
import { TeamInvitationEmail, subject, type TeamInvitationEmailProps } from "./template"
import { sendEmail, type SendTemplateEmailData } from "../../send-email"

export function sendTeamInvitationEmail({ to, data }: SendTemplateEmailData<TeamInvitationEmailProps>) {
	const { html } = render(<TeamInvitationEmail {...data} />)

	return sendEmail({
		to,
		data: {
			subject: subject(data),
			body: html,
		},
	})
}
