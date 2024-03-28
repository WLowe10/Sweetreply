import { trpc } from "@/lib/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

type UseMeProps = {
	redirect: {
		to: string;
		when: {
			isAuthenticated: boolean;
		};
	};
};

export const useMe = (props?: UseMeProps) => {
	const router = useRouter();
	const getMeQuery = trpc.auth.getMe.useQuery();
	const isInitialized: boolean = getMeQuery.isSuccess || getMeQuery.error?.data?.code === "UNAUTHORIZED";
	const isAuthenticated: boolean = getMeQuery.isSuccess && isInitialized;

	useEffect(() => {
		if (props && props.redirect) {
			const { to, when } = props.redirect;

			if (typeof when.isAuthenticated === "boolean" && when.isAuthenticated === isAuthenticated) {
				router.push(to);
			}
		}
	}, [getMeQuery, isAuthenticated, isInitialized, props]);

	return {
		me: getMeQuery.data,
		query: getMeQuery,
		isAuthenticated,
		isInitialized,
	};
};
