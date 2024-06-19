import { useDataTableContext } from "../hooks/use-data-table-context";

export const useResultsRange = () => {
	const { params, total } = useDataTableContext();

	const start = (params.page - 1) * params.limit + 1;
	const end = Math.min(params.page * params.limit, total);

	return {
		total,
		start,
		end,
	};
};
