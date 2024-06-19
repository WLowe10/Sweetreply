import { Loader, type LoaderProps } from "@mantine/core";
import { useDataTableContext } from "../hooks/use-data-table-context";

export const DataTableLoader = (props: LoaderProps) => {
	const { isLoading } = useDataTableContext();

	return isLoading && <Loader size="xs" {...props} />;
};
