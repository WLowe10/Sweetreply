import { MjmlSpacer, MjmlText } from "@faire/mjml-react"
import { Button, Container, Footer, Header } from "../../components"
import { env } from "../../../env"

export type TeamInvitationEmailProps = {
	inviteeName: string
	inviterName: string
	inviterEmail: string
	teamName: string
	teamSlug: string
}

export const subject = (props: TeamInvitationEmailProps) =>
	`${props.inviterName} invited you to the ${props.teamName} team on Cybership`

export const TeamInvitationEmail = ({
	teamSlug,
	teamName,
	inviterName,
	inviterEmail,
	inviteeName,
}: TeamInvitationEmailProps) => {
	const joinLink = `${env.FRONTEND_URL}/teams/${teamSlug}/join`

	return (
		<Container>
			<Header>Join {teamName} on Cybership</Header>
			<MjmlText>
				Hi {inviteeName},
				<br />
				{inviterName} ({inviterEmail}) has invited you to the {teamName} team on Cybership
			</MjmlText>
			<MjmlSpacer />
			<Button href={joinLink}>Join Team</Button>
			<MjmlSpacer />
			<Footer>If you were not expecting this invitation, you can ignore this email.</Footer>
		</Container>
	)
}
