import { Pagination } from "@mantine/core";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { useTotalPages } from "../hooks/use-total-pages";

export const DataTablePagination = () => {
	const { params } = useDataTableContext();
	const totalPages = useTotalPages();

	return (
		<Pagination
			total={totalPages}
			value={params.page}
			onChange={(pageNum) => params.setPage(pageNum)}
		/>
	);
};
