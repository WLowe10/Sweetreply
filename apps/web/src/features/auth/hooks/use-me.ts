import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { trpc } from "@/lib/trpc";
import type { RouterInput } from "@server/router";

type UseMeProps = {
	redirect: {
		to: string;
		when: {
			isAuthenticated: boolean;
		};
	};
};

export const useMe = (props?: UseMeProps) => {
	const navigate = useNavigate();
	const trpcUtils = trpc.useUtils();
	const getMeQuery = trpc.auth.getMe.useQuery();
	const updateMeMutation = trpc.auth.updateMe.useMutation();
	const isInitialized: boolean =
		getMeQuery.isSuccess || getMeQuery.error?.data?.code === "UNAUTHORIZED";
	const isAuthenticated: boolean = getMeQuery.isSuccess && isInitialized;

	const updateMe = (data: RouterInput["auth"]["updateMe"]) => {
		return updateMeMutation.mutate(data, {
			onSuccess: (userData) => {
				trpcUtils.auth.getMe.setData(undefined, userData);
			},
		});
	};

	useEffect(() => {
		if (props && props.redirect) {
			const { to, when } = props.redirect;

			if (
				typeof when.isAuthenticated === "boolean" &&
				when.isAuthenticated === isAuthenticated
			) {
				// navigate(to);
			}
		}
	}, [getMeQuery, isAuthenticated, isInitialized, props]);

	return {
		me: getMeQuery.data,
		query: getMeQuery,
		mutation: updateMeMutation,
		updateMe,
		isAuthenticated,
		isInitialized,
	};
};
