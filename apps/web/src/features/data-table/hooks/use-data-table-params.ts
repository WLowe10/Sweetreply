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

	const rawFilter = params.get(filterParamKey);
	const filter = rawFilter ? JSON.parse(rawFilter) : {};

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

	const setFilter = (newFilter: object | ((prevFilter: object) => object)) => {
		setParams((prev) => {
			const prevRawFilter = prev.get(filterParamKey);
			const prevFilter = prevRawFilter ? JSON.parse(prevRawFilter) : {};
			const newFilterData =
				typeof newFilter === "function" ? newFilter(prevFilter) : newFilter;

			if (Object.keys(newFilterData).length === 0) {
				clearFilter();
			} else {
				prev.set(filterParamKey, JSON.stringify(newFilter));
			}

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

	const clearFilter = () => {
		setParams((prev) => {
			prev.delete(filterParamKey);
			return prev;
		});
	};

	// useEffect(() => {
	// 	if (page === 1) {
	// 		clearPage();
	// 	}

	// 	if (limit === defaultLimit) {

	// 	}
	// }, [page, limit, defaultLimit]);

	return {
		page,
		limit,
		query,
		filter,
		setPage,
		setLimit,
		setQuery,
		setFilter,
		clearPage,
		clearLimit,
		clearQuery,
		clearFilter,
	};
};
