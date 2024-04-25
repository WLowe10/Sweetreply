import { useNavigate } from "@remix-run/react";
import { trpc } from "@/lib/trpc";
import type { RouterInput } from "@server/router";

export const useSignUp = () => {
	const navigate = useNavigate();
	const trpcUtils = trpc.useUtils();
	const signUpMutation = trpc.auth.signUp.useMutation();

	const signUp = (data: RouterInput["auth"]["signUp"]) => {
		return signUpMutation.mutate(data, {
			onSuccess: (userData) => {
				// set the data of the user in the query cache
				trpcUtils.auth.getMe.setData(undefined, userData);
				navigate("/verify");
			},
		});
	};

	return {
		signUp,
		mutation: signUpMutation,
		isLoading: signUpMutation.isLoading,
		isError: signUpMutation.isError,
		error: signUpMutation.error?.message,
	};
};
