import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Button, Container, Footer, Header } from "../components";
import { buildFrontendUrl } from "@/lib/utils";
import { appConfig } from "@sweetreply/shared/config";

export type LowOnRepliesEmailProps = {
	firstName: string;
};

export const subject = "You are about to run out of tokens";

export const LowOnRepliesEmail = ({ firstName }: LowOnRepliesEmailProps) => {
	const buyRepliesLink = buildFrontendUrl({
		path: "/billing",
	});

	return (
		<Container>
			<Header>You are about to run out of replies</Header>
			<MjmlText>
				Hi {firstName},
				<br />
				We are notifying you that you are about to run out of tokens. If you do not refill
				your tokens soon, {appConfig.name} will stop generating replies.
			</MjmlText>
			<MjmlSpacer />
			<Button href={buyRepliesLink}>Get Replies</Button>
			<MjmlSpacer />
			<Footer>For uninterrupted service, make sure you have replies.</Footer>
		</Container>
	);
};
