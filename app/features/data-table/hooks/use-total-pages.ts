import { useDataTableContext } from "../hooks/use-data-table-context";

export const useTotalPages = () => {
	const { total, params } = useDataTableContext();

	return Math.ceil(total / params.limit);
};
