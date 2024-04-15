import { RedditLead } from "@/features/leads/components/reddit-lead";
import { trpc } from "@/lib/trpc";
import { buildPageTitle } from "@/lib/utils";
import { Box, Card, Center, Flex, Skeleton, Stack, Text } from "@mantine/core";
import { useParams, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("View Lead") }];

export default function LeadPage() {
	const { id } = useParams();

	const getLeadQuery = trpc.leads.get.useQuery({
		id: id as string,
	});

	return (
		<Flex mih="100vh" justify="center" align="center">
			<Box miw="30rem" maw="42rem">
				{getLeadQuery.data ? (
					getLeadQuery.data.platform === "reddit" ? (
						<RedditLead lead={getLeadQuery.data} />
					) : null
				) : (
					<Skeleton height={200} width={400} />
				)}
			</Box>
		</Flex>
	);
}
