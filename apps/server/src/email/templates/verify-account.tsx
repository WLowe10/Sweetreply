import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Container, Button, Footer, Header } from "../components";
import { APP_NAME } from "@replyon/shared/lib/constants";

export type VerifyAccountEmailProps = {
	verifyCode: string;
};

export const subject = "Verify Your Email";

export const VerifyAccountEmail = ({ verifyCode }: VerifyAccountEmailProps) => {
	const verifyLink = ""; // should link to api, which redirects to frontend

	return (
		<Container>
			<Header>Verify your account</Header>
			<MjmlText>Verify this email address for your Cybership account by clicking the link below.</MjmlText>
			<MjmlSpacer />
			<Button href={verifyLink}>Verify Email Address</Button>
			<MjmlSpacer />
			<Footer>If you did not request to verify your {APP_NAME} account, you can safely ignore this email.</Footer>
		</Container>
	);
};
