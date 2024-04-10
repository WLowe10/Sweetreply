import { useLocalStorage } from "@mantine/hooks";

const PROJECT_CONTEXT_KEY = "project_id";

export const useLocalProject = () =>
	useLocalStorage({
		key: PROJECT_CONTEXT_KEY,
		defaultValue: "dark",
	});
