import { Text, type TextProps } from "@mantine/core";
import { useResultsRange } from "../hooks/use-results-range";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { pluralize } from "@sweetreply/shared/lib/utils";

export const DataTableRange = (textProps: TextProps) => {
	const { options } = useDataTableContext();
	const { total, start, end } = useResultsRange();

	const noun = options?.noun || "result";

	return (
		<Text {...textProps}>
			{total
				? `Showing ${start} - ${end} of ${pluralize(total, noun)}`
				: `No ${pluralize(0, noun)}`}
		</Text>
	);
};
