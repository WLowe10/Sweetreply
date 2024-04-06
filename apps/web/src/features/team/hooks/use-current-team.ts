import { trpc } from "@/lib/trpc";
import { useTeamContext } from "./use-team-context";

export const useCurrentTeamQuery = () => {
	const { teamId } = useTeamContext();

	return trpc.teams.get.useQuery(
		{
			id: teamId as string,
		},
		{
			enabled: !!teamId,
		}
	);
};
