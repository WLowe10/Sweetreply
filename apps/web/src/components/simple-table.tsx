import { Table } from "@mantine/core";
import type { ReactNode } from "react";

export type SimpleTableColumn<T = any> = {
	id: string;
	Header: () => ReactNode;
	Cell: (row: T) => ReactNode;
};

export type SimpleTableColumns<T = any> = SimpleTableColumn<T>[];

export type SimpleTableProps = {
	columns: SimpleTableColumn[];
	data: any[];
	getId?: (row: any) => string;
};

export const SimpleTable = ({ columns, data, getId }: SimpleTableProps) => {
	return (
		<Table.ScrollContainer minWidth={500}>
			<Table>
				<Table.Thead>
					<Table.Tr>
						{columns.map(({ id, Header }) => (
							<Table.Th key={id}>
								<Header />
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data.map((row) => (
						<Table.Tr key={getId ? getId(row) : row["id"]}>
							{columns.map(({ id, Cell }) => (
								<Table.Td key={id}>
									<Cell {...row} />
								</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
};
