import { MjmlSpacer, MjmlText } from "@faire/mjml-react"
import { Button, Container, Footer, Header } from "../../components"

export const subject = "Reset your password"

export type ResetPasswordEmailProps = {
	resetPasswordLink: string
}

export const ResetPasswordEmail = ({ resetPasswordLink }: ResetPasswordEmailProps) => {
	return (
		<Container>
			<Header> Reset Your Password</Header>
			<MjmlText>Reset the password for your Cybership account by clicking the link below.</MjmlText>
			<MjmlSpacer />
			<Button href={resetPasswordLink}> Reset Password</Button>
			<MjmlSpacer />
			<Footer>
				You have requested a password change. If you did not request a password change, please ignore this email.
			</Footer>
		</Container>
	)
}
