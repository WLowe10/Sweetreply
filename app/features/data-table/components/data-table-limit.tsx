import { Select } from "@mantine/core";
import { pluralize } from "@shared/utils";
import { useDataTableContext } from "../hooks/use-data-table-context";

export const DataTableLimit = () => {
	const { params, options } = useDataTableContext();

	const sizes = [10, 25, 50];

	return (
		<Select
			data={sizes.map(opt => ({
				value: opt.toString(),
				label: `Show ${pluralize(opt, options?.noun || "result")}`,
			}))}
			value={params.limit.toString()}
			onChange={params.setLimit}
		/>
	);
};
