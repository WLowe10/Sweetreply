import { Loader, Text, type TextProps } from "@mantine/core";
import { useResultsRange } from "../hooks/use-results-range";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { pluralize } from "@shared/utils";

export const DataTableRange = (textProps: TextProps) => {
	const { options, isLoading } = useDataTableContext();
	const { total, start, end } = useResultsRange();

	const noun = options?.noun || "result";

	return isLoading ? null : (
		<Text {...textProps}>
			{total ? `Showing ${start} - ${end} of ${pluralize(total, noun)}` : `No ${noun + "s"}`}
		</Text>
	);
};
