import { trpc } from "@/lib/trpc";
import { useNavigate } from "@remix-run/react";
import type { RouterInput } from "@server/router";

export const useSignIn = () => {
	const navigate = useNavigate();
	const trpcUtils = trpc.useUtils();
	const signInMutation = trpc.auth.signIn.useMutation();

	const signIn = (data: RouterInput["auth"]["signIn"]) => {
		return signInMutation.mutate(data, {
			onSuccess: (userData) => {
				// set the data of the user in the query cache
				trpcUtils.auth.getMe.setData(undefined, userData);
				navigate("/dashboard");
			},
		});
	};

	return {
		signIn,
		mutation: signInMutation,
		isLoading: signInMutation.isLoading,
		isError: signInMutation.isError,
		error: signInMutation.error?.message,
	};
};
