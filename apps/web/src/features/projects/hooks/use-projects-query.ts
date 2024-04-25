import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalProject } from "./use-local-project";

export const useProjectsQuery = () => {
	const getProjectsQuery = trpc.projects.getMany.useQuery();
	const [localProject, setLocalProject] = useLocalProject();

	useEffect(() => {
		if (getProjectsQuery.data && getProjectsQuery.data.length > 0 && !localProject) {
			setLocalProject(getProjectsQuery.data[0].id);
		}
	}, [getProjectsQuery.data]);

	return getProjectsQuery;
};
