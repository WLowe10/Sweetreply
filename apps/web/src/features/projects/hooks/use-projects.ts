import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { trpc } from "@/lib/trpc";
import { useLocalProject } from "./use-local-project";

export const useProjects = () => {
	const navigate = useNavigate();
	const getProjectsQuery = trpc.projects.getMany.useQuery();
	const [localProject, setLocalProject] = useLocalProject();

	useEffect(() => {
		if (getProjectsQuery.data?.length === 0) {
			navigate(`/projects/${getProjectsQuery.data[0].id}`);
		} else if (getProjectsQuery.data && !localProject) {
			setLocalProject(getProjectsQuery.data[0].id);
		}
	}, [getProjectsQuery.data]);

	return getProjectsQuery;
};
