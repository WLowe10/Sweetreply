import { MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { Button, Container, Footer, Header } from "../components";
import { env } from "../../env";
import { appConfig } from "@replyon/shared/lib/constants";
import { buildFrontendUrl } from "@/lib/utils";

export type TeamInvitationEmailProps = {
	inviteeName: string;
	inviterName: string;
	inviterEmail: string;
	teamName: string;
	teamSlug: string;
};

export const subject = (props: TeamInvitationEmailProps) =>
	`${props.inviterName} invited you to the ${props.teamName} team on ${appConfig.name}`;

export const TeamInvitationEmail = ({
	teamSlug,
	teamName,
	inviterName,
	inviterEmail,
	inviteeName,
}: TeamInvitationEmailProps) => {
	const joinLink = buildFrontendUrl(`/teams/${teamSlug}/join`);

	return (
		<Container>
			<Header>
				Join {teamName} on {appConfig.name}
			</Header>
			<MjmlText>
				Hi {inviteeName},
				<br />
				{inviterName} ({inviterEmail}) has invited you to the {teamName} team on {appConfig.name}
			</MjmlText>
			<MjmlSpacer />
			<Button href={joinLink}>Join Team</Button>
			<MjmlSpacer />
			<Footer>If you were not expecting this invitation, you can ignore this email.</Footer>
		</Container>
	);
};
