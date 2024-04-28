import { trpc } from "@lib/trpc";
import { useLocalProject } from "./use-local-project";

export const useCurrentProjectQuery = () => {
	const [id] = useLocalProject();

	return trpc.projects.get.useQuery(
		{
			id: id as string,
		},
		{
			enabled: !!id,
		}
	);
};
