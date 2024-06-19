import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Container, Button, Footer, Header } from "../components";
import { appConfig } from "@shared/config";
import { buildFrontendUrl } from "~/utils";

export type VerifyAccountEmailProps = {
	verificationToken: string;
};

export const subject = "Verify your account";

export const VerifyAccountEmail = ({ verificationToken }: VerifyAccountEmailProps) => {
	const verifyLink = buildFrontendUrl({
		path: "/verify",
		query: {
			token: verificationToken,
		},
	}); // should link to api, which redirects to frontend

	return (
		<Container>
			<Header>Verify your account</Header>
			<MjmlText>
				Verify this email address for your {appConfig.name} account by clicking the link
				below.
			</MjmlText>
			<MjmlSpacer />
			<Button href={verifyLink}>Verify Account</Button>
			<MjmlSpacer />
			<Footer>
				If you did not request to verify your {appConfig.name} account, you can safely
				ignore this email.
			</Footer>
		</Container>
	);
};
