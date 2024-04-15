import { trpc } from "@/lib/trpc";
import { buildPageTitle } from "@/lib/utils";
import { Card, Center, Flex, Stack, Text } from "@mantine/core";
import { useParams, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("View Lead") }];

export default function LeadPage() {
	const { id } = useParams();

	const getLeadQuery = trpc.leads.get.useQuery({
		id: id as string,
	});

	return (
		<Flex mih="100vh" justify="center" align="center">
			<Stack>
				<Card>
					<Stack>
						<Text>{getLeadQuery.data?.title}</Text>
						<Text>{getLeadQuery.data?.content}</Text>
					</Stack>
				</Card>
				{getLeadQuery.data?.reply && (
					<Card bg="blue" ml="6rem">
						<Text>{getLeadQuery.data.reply}</Text>
					</Card>
				)}
			</Stack>
		</Flex>
	);
}
