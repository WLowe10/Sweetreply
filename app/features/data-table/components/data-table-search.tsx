import { useEffect, useState } from "react";
import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "use-debounce";
import { useDataTableContext } from "../hooks/use-data-table-context";

export const DataTableSearch = () => {
	const { params, options } = useDataTableContext();
	const [query, setQuery] = useState<string>(params.query || "");

	const setQueryParam = useDebouncedCallback((newQuery: string) => {
		params.setQuery(newQuery);
	}, 500);

	const handleQueryChange = (newQuery: string) => {
		setQuery(newQuery);
		setQueryParam(newQuery);
	};

	useEffect(() => {
		setQuery(params.query || "");
	}, [params.query]);

	return (
		<TextInput
			placeholder={`Search ${options?.noun + "s" || "results"}`}
			value={query || ""}
			onChange={(e) => handleQueryChange(e.target.value)}
		/>
	);
};
