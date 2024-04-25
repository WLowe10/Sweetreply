import { trpc } from "@/lib/trpc";
import type { RouterInput } from "@server/router";

export const useMe = () => {
	const trpcUtils = trpc.useUtils();
	const getMeQuery = trpc.auth.getMe.useQuery(undefined, {
		retry(failureCount, error) {
			if (error?.data?.code === "UNAUTHORIZED") {
				return false;
			}

			return true;
		},
	});
	const updateMeMutation = trpc.auth.updateMe.useMutation();
	const isInitialized: boolean =
		getMeQuery.isSuccess || getMeQuery.error?.data?.code === "UNAUTHORIZED";
	const isAuthenticated: boolean = getMeQuery.isSuccess;

	const updateMe = (data: RouterInput["auth"]["updateMe"]) => {
		return updateMeMutation.mutate(data, {
			onSuccess: (userData) => {
				trpcUtils.auth.getMe.setData(undefined, userData);
			},
		});
	};

	return {
		me: getMeQuery.data,
		query: getMeQuery,
		mutation: updateMeMutation,
		updateMe,
		isAuthenticated,
		isInitialized,
	};
};
