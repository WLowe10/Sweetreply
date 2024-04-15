import {
	ActionIcon,
	Box,
	Flex,
	Group,
	Pagination,
	Popover,
	Select,
	Stack,
	Table,
	TextInput,
} from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import type { useDataTableParams } from "@/hooks/use-data-table-params";
import type { ReactNode } from "react";

export type DataTableProps = {
	data: any[];
	total: number;
	searchPlaceholder: string;
	isLoading?: boolean;
	params: ReturnType<typeof useDataTableParams>;
	header: ReactNode;
	getKey: (item: any) => string;
	Row: (item: any) => ReactNode;
	LoadingRow?: () => ReactNode;
};

export const DataTable = ({
	data,
	total,
	header,
	searchPlaceholder,
	params,
	isLoading,
	getKey,
	Row,
	LoadingRow,
}: DataTableProps) => {
	const totalPages = total ? Math.ceil(total / params.limit) : 0;

	// const [query, setQuery] = useState<string>(params.query || "");

	// //@ts-ignore
	// const setQueryParam = useDebounceCallback((newQuery: string) => {
	// 	params.setQuery(newQuery);
	// }, 500);

	// const handleQueryChange = (newQuery: string) => {
	// 	setQuery(newQuery);
	// 	setQueryParam(newQuery);
	// };

	return (
		<Box>
			<Flex align="center" justify="space-between">
				<TextInput
					placeholder={searchPlaceholder}
					value={params.query || ""}
					onChange={(e) => params.setQuery(e.target.value)}
				/>
				<Popover>
					<Popover.Target>
						<ActionIcon color="gray" variant="subtle">
							<IconFilter size={18} />
						</ActionIcon>
					</Popover.Target>
					<Popover.Dropdown>
						<Stack>
							<Select
								label="Platform"
								data={["test", "test2"]}
								comboboxProps={{ withinPortal: false }}
							/>
						</Stack>
					</Popover.Dropdown>
				</Popover>
			</Flex>
			<Table my="sm">
				{header}
				{isLoading && LoadingRow ? (
					<Table.Tbody>
						{[...Array(10).keys()].map((item) => (
							<LoadingRow key={item} />
						))}
					</Table.Tbody>
				) : (
					<Table.Tbody>
						{data.map((item) => (
							<Row {...item} key={getKey(item)} />
						))}
					</Table.Tbody>
				)}
			</Table>
			<Flex justify="space-between" align="center">
				<Group>
					<Pagination
						total={totalPages}
						value={params.page}
						onChange={(pageNum) => params.setPage(pageNum)}
					/>
					<Select
						width={"sm"}
						data={["10", "25", "50"]}
						value={params.limit.toString()}
						onChange={params.setLimit}
					/>
				</Group>
			</Flex>
		</Box>
	);
};
