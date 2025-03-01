import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Button, Container, Footer, Header } from "../components";
import { appConfig } from "@sweetreply/shared/config";
import { buildFrontendUrl } from "@utils";

export const subject = "Reset your password";

export type PasswordResetEmailProps = {
	resetCode: string;
};

export const PasswordResetEmail = ({ resetCode }: PasswordResetEmailProps) => {
	const resetPasswordLink = buildFrontendUrl({
		path: "/reset-password",
		query: {
			code: resetCode,
		},
	});

	return (
		<Container>
			<Header>Reset Your Password</Header>
			<MjmlText>
				Reset the password for your {appConfig.name} account by clicking the link below.
			</MjmlText>
			<MjmlSpacer />
			<Button href={resetPasswordLink}> Reset Password</Button>
			<MjmlSpacer />
			<Footer>
				If you did not request a password change, you can safely ignore this email.
			</Footer>
		</Container>
	);
};
