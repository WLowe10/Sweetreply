import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Container, Header, Footer, Button } from "../components";
import { appConfig } from "@sweetreply/shared/config";

export type WelcomeEmailProps = {
	firstName: string;
	verificationToken: string;
};

export const subject = (props: WelcomeEmailProps) => `Welcome to the team, ${props.firstName}`;

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => {
	const verifyLink = ""; // should be handled by a controller, and will redirect to the frontend

	return (
		<Container>
			<Header>Welcome to the team</Header>
			<MjmlText>
				Welcome {firstName}! We are so exited for you to try out {appConfig.name}
			</MjmlText>
			<MjmlSpacer />
			<Button href={verifyLink}>Verify Email</Button>
			<MjmlSpacer />
			<Footer>If you were not expecting this invitation, you can ignore this email.</Footer>
		</Container>
	);
};
