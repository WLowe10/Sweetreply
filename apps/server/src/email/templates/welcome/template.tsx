import { MjmlText } from "@faire/mjml-react"
import { Container, Header, Footer, Button } from "../../components"

export type WelcomeEmailProps = {
	name: string
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
	return (
		<Container>
			<Header>Welcome to the team</Header>
			<MjmlText>Welcome {name}!</MjmlText>
			<Footer>If you were not expecting this invitation, you can ignore this email.</Footer>
		</Container>
	)
}
