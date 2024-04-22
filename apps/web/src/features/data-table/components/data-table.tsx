import { Flex, Group, Skeleton } from "@mantine/core";
import { SimpleTable, type SimpleTableProps } from "@/components/simple-table";
import { DataTableProvider, DataTableProviderProps } from "./data-table-provider";
import { DataTableSearch } from "./data-table-search";
import { DataTableLimit } from "./data-table-limit";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRange } from "./data-table-range";

export type DataTableProps = DataTableProviderProps & Pick<SimpleTableProps, "columns">;

const LoadingCell = () => <Skeleton height={30} />;

export const DataTable = (props: DataTableProps) => {
	return (
		<DataTableProvider {...props}>
			<Flex justify="space-between" align="center" mb="md">
				<DataTableSearch />
				<DataTableLimit />
			</Flex>
			{props.isLoading ? (
				<SimpleTable
					columns={props.columns.map((col) => ({ ...col, Cell: LoadingCell }))}
					data={Array.from({ length: 10 }).map((_, index) => ({ id: index }))}
				/>
			) : (
				<SimpleTable columns={props.columns} data={props.data} />
			)}
			<Group mt="md">
				<DataTablePagination />
				<DataTableRange size="sm" c="dimmed" />
			</Group>
		</DataTableProvider>
	);
};
