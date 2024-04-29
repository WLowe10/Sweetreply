import { useCurrentProjectQuery } from "./use-current-project-query";
import { getProjectIssues } from "../utils/get-project-issues";

export const useCurrentProjectIssues = () => {
	const { data } = useCurrentProjectQuery();

	return data ? getProjectIssues(data) : [];
};
