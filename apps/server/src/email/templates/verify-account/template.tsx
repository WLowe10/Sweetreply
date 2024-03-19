import { MjmlSpacer, MjmlText } from "@faire/mjml-react"
import { Container, Button, Footer, Header } from "../../components"

export type VerifyAccountEmailProps = {
	verifyLink: string
}

export const subject = "Verify Your Email"

export const VerifyAccountEmail = ({ verifyLink }: VerifyAccountEmailProps) => {
	return (
		<Container>
			<Header>Verify your account</Header>
			<MjmlText>Verify this email address for your Cybership account by clicking the link below.</MjmlText>
			<MjmlSpacer />
			<Button href={verifyLink}>Verify Email Address</Button>
			<MjmlSpacer />
			<Footer>If you did not request to verify your Cybership account, you can safely ignore this email.</Footer>
		</Container>
	)
}
