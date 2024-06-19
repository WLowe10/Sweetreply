import { useSearchParams } from "@remix-run/react";

export const useCheckoutParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const plan = searchParams.get("plan");
	const status = searchParams.get("status");

	const isActive = !!(status === "success" && plan);

	const clear = () => {
		setSearchParams({});
	};

	return {
		plan,
		status,
		clear,
		isActive,
	};
};
