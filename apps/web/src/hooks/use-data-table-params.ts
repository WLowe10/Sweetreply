import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

const pageParamKey = "p";
const limitParamKey = "l";
const queryParamKey = "q";

export const useDataTableParams = (opts?: { defaultLimit: number }) => {
	const [params, setParams] = useSearchParams();

	const defaultLimit = opts?.defaultLimit ?? 25;
	const page = Number(params.get(pageParamKey)) || 1;
	const limit = (Number(params.get(limitParamKey)) || opts?.defaultLimit) ?? 25;
	const query = params.get(queryParamKey);

	const setPage = (newPage: number | null) => {
		setParams((prev) => {
			if (newPage === null || newPage === 1) {
				prev.delete(pageParamKey);
			} else {
				prev.set(pageParamKey, newPage.toString());
			}

			return prev;
		});
	};

	const setLimit = (newLimit: number | string | null) => {
		setParams((prev) => {
			if (newLimit === null || newLimit === defaultLimit) {
				prev.delete(limitParamKey);
			} else {
				prev.set(limitParamKey, newLimit.toString());
			}

			return prev;
		});
	};

	const setQuery = (newQuery: string | null) => {
		setParams((prev) => {
			if (newQuery === null || newQuery.length === 0) {
				prev.delete(queryParamKey);
			} else {
				prev.set(queryParamKey, newQuery);
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
		setPage,
		setLimit,
		setQuery,
		clearPage,
		clearLimit,
		clearQuery,
	};
};
