import { ActionIcon, Box, Flex, Group, Skeleton } from "@mantine/core";
import { SimpleTable, type SimpleTableProps } from "@components/simple-table";
import { DataTableProvider, DataTableProviderProps } from "./data-table-provider";
import { DataTableSearch } from "./data-table-search";
import { DataTableLimit } from "./data-table-limit";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRange } from "./data-table-range";
import { DataTableLoader } from "./data-table-loader";

export type DataTableProps = DataTableProviderProps & Pick<SimpleTableProps, "columns" | "getId">;

const LoadingCell = () => <Skeleton height={30} />;

export const DataTable = (props: DataTableProps) => {
	return (
		<DataTableProvider {...props}>
			<Flex justify="space-between" align="center" mb="md">
				<Group align="center">
					<DataTableSearch />
					<DataTableLoader />
				</Group>
				<Group>
					<DataTableLimit />
				</Group>
			</Flex>
			<Box>
				{props.isLoading ? (
					<SimpleTable
						columns={props.columns.map((col) => ({ ...col, Cell: LoadingCell }))}
						data={Array.from({ length: 10 }).map((_, index) => ({ id: index }))}
					/>
				) : (
					<SimpleTable columns={props.columns} data={props.data} />
				)}
			</Box>
			<Flex justify="space-between" mt="md">
				<DataTableRange size="sm" c="dimmed" />
				<DataTablePagination />
			</Flex>
		</DataTableProvider>
	);
};
