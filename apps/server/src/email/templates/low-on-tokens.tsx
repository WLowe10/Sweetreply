import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Button, Container, Footer, Header } from "../components";
import { buildFrontendUrl } from "@/lib/utils";
import { appConfig } from "@sweetreply/shared/config";

export type LowOnTokensEmailProps = {
	firstName: string;
	projectId: string;
	projectName: string;
};

export const subject = (props: LowOnTokensEmailProps) =>
	`${props.projectName} is about to run out of tokens`;

export const LowOnTokensEmail = ({ projectId, projectName, firstName }: LowOnTokensEmailProps) => {
	const buyTokensLink = buildFrontendUrl({
		path: "/dashboard",
		query: {
			buy: projectId,
		},
	});

	return (
		<Container>
			<Header>{projectName} is about to run out of tokens</Header>
			<MjmlText>
				Hi {firstName},
				<br />
				We are notifying you that your project, {projectName}, is about to run out of
				tokens. If you do not refill your tokens soon, {appConfig.name} will stop generating
				replies.
			</MjmlText>
			<MjmlSpacer />
			<Button href={buyTokensLink}>Get Tokens</Button>
			<MjmlSpacer />
			<Footer>For uninterrupted service, make sure you have tokens.</Footer>
		</Container>
	);
};
