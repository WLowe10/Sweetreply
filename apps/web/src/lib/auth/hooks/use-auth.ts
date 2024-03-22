import { trpc } from "@/lib/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

// add redirects here

export const useAuth = () => {
	const getMeQuery = trpc.auth.getMe.useQuery();
	const router = useRouter();

	const isLoading = getMeQuery.isLoading;

	// useEffect(() => {
	// 	if (getMeQuery.data) {
	// 		router.push("/");
	// 	}
	// }, [isLoading]);

	return {
		user: getMeQuery.data,
		isLoading: isLoading,
		isError: getMeQuery.status === "error",
	};
};
