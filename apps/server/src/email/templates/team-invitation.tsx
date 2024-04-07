import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Button, Container, Footer, Header } from "../components";
import { buildFrontendUrl } from "@/lib/utils";
import { appConfig } from "@sweetreply/shared/config";

export type TeamInvitationEmailProps = {
	teamId: string;
	inviteeName: string;
	inviterName: string;
	inviterEmail: string;
	teamName: string;
};

export const subject = (props: TeamInvitationEmailProps) =>
	`${props.inviterName} invited you to the ${props.teamName} team on ${appConfig.name}`;

export const TeamInvitationEmail = ({
	teamId,
	teamName,
	inviterName,
	inviterEmail,
	inviteeName,
}: TeamInvitationEmailProps) => {
	const joinLink = buildFrontendUrl({
		path: "/dashboard",
		query: {
			join: teamId,
		},
	});

	return (
		<Container>
			<Header>
				Join {teamName} on {appConfig.name}
			</Header>
			<MjmlText>
				Hi {inviteeName},
				<br />
				{inviterName} ({inviterEmail}) has invited you to the {teamName} team on{" "}
				{appConfig.name}
			</MjmlText>
			<MjmlSpacer />
			<Button href={joinLink}>Join Team</Button>
			<MjmlSpacer />
			<Footer>If you were not expecting this invitation, you can ignore this email.</Footer>
		</Container>
	);
};
