import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Container, Header, Footer, Button } from "../components";
import { appConfig } from "@sweetreply/shared/config";
import { buildFrontendUrl } from "@lib/utils";

export type WelcomeEmailProps = {
	firstName: string;
	verificationToken: string;
};

export const subject = `Welcome to the team!`;

export const WelcomeEmail = ({ firstName, verificationToken }: WelcomeEmailProps) => {
	const verifyLink = buildFrontendUrl({
		path: "/verify",
		query: {
			token: verificationToken,
		},
	});

	return (
		<Container>
			<Header>Welcome to the team</Header>
			<MjmlText>
				Welcome {firstName}! We are so exited for you to be part of the {appConfig.name}{" "}
				team!
			</MjmlText>
			<MjmlSpacer />
			<Button href={verifyLink}>Verify Account</Button>
			<MjmlSpacer />
			<Footer>
				If you did not sign up for an account, you can safely ignore this email.
			</Footer>
		</Container>
	);
};
