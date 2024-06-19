import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

const pageParamKey = "p";
const limitParamKey = "l";
const queryParamKey = "query";
const filterParamKey = "filter";

export const useDataTableParams = (opts?: { defaultLimit: number }) => {
	const [params, setParams] = useSearchParams();

	const defaultLimit = opts?.defaultLimit ?? 25;
	const page = Number(params.get(pageParamKey)) || 1;
	const limit = (Number(params.get(limitParamKey)) || opts?.defaultLimit) ?? 25;
	const query = params.get(queryParamKey);

	const rawFilters = params.get(filterParamKey);
	const filters = rawFilters ? JSON.parse(rawFilters) : {};

	const setPage = (newPage: number | null) => {
		setParams((prev) => {
			if (newPage === null || newPage === 1) {
				clearPage();
			} else {
				prev.set(pageParamKey, newPage.toString());
			}

			return prev;
		});
	};

	const setLimit = (newLimit: number | string | null) => {
		setParams((prev) => {
			if (newLimit === null || newLimit === defaultLimit) {
				clearLimit();
			} else {
				prev.set(limitParamKey, newLimit.toString());
			}

			return prev;
		});
	};

	const setQuery = (newQuery: string | null) => {
		setParams((prev) => {
			if (newQuery === null || newQuery.length === 0) {
				clearQuery();
			} else {
				prev.set(queryParamKey, newQuery);
			}

			return prev;
		});
	};

	const getFilter = (name: string) => {
		return filters[name];
	};

	const setFilters = (newFilter: object | ((prevFilter: object) => object)) => {
		setParams((prev) => {
			const prevRawFilter = prev.get(filterParamKey);
			const prevFilter = prevRawFilter ? JSON.parse(prevRawFilter) : {};
			const newFilterData =
				typeof newFilter === "function" ? newFilter(prevFilter) : newFilter;

			if (Object.keys(newFilterData).length === 0) {
				clearFilters();
			} else {
				prev.set(filterParamKey, JSON.stringify(newFilterData));
			}

			return prev;
		});
	};

	const setFilter = (name: string, value: any) => {
		setFilters((prev) => {
			return { ...prev, [name]: value };
		});
	};

	const clearFilter = (name: string) => {
		setFilters((prev) => {
			// @ts-ignore
			delete prev[name];

			return prev;
		});
	};

	const clearPage = () => {
		setParams((prev) => {
			prev.delete(pageParamKey);
			return prev;
		});
	};

	const clearLimit = () => {
		setParams((prev) => {
			prev.delete(limitParamKey);
			return prev;
		});
	};

	const clearQuery = () => {
		setParams((prev) => {
			prev.delete(queryParamKey);
			return prev;
		});
	};

	const clearFilters = () => {
		setParams((prev) => {
			prev.delete(filterParamKey);
			return prev;
		});
	};

	//! causes infinite render

	// useEffect(() => {
	// 	if (page <= 1) {
	// 		clearPage();
	// 	}

	// 	if (limit === defaultLimit) {
	// 		clearLimit();
	// 	}

	// 	if (Object.keys(filters).length === 0) {
	// 		clearFilters();
	// 	}
	// }, [page, limit, defaultLimit, filters]);

	return {
		page,
		limit,
		query,
		filters,
		setPage,
		setLimit,
		setQuery,
		setFilters,
		getFilter,
		setFilter,
		clearPage,
		clearLimit,
		clearQuery,
		clearFilters,
		clearFilter,
	};
};
