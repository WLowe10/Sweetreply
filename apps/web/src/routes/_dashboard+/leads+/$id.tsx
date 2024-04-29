import { RedditLead } from "@features/leads/components/reddit-lead";
import { LeadContext } from "@features/leads/context";
import { useLead } from "@features/leads/hooks/use-lead";
import { buildPageTitle } from "@lib/utils";
import { Box, Container, Flex, Skeleton } from "@mantine/core";
import { useParams, type MetaFunction } from "@remix-run/react";
import { LeadPlatform } from "@sweetreply/shared/features/leads/constants";

export const meta: MetaFunction = () => [{ title: buildPageTitle("View Lead") }];

export default function LeadPage() {
	const { id } = useParams();
	const lead = useLead(id as string);

	return (
		<Flex mih="100vh" justify="center" align="center">
			<Container size="xs" w="100%">
				{lead.data ? (
					<LeadContext.Provider value={lead as any}>
						{lead.data.platform === LeadPlatform.REDDIT ? <RedditLead /> : null}
					</LeadContext.Provider>
				) : (
					<Skeleton height={200} width={400} />
				)}
			</Container>
		</Flex>
	);
}
