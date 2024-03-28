import { trpc } from "@/lib/trpc";
import { RouterInput } from "@server/router";

export const useForgotPassword = () => {
	const forgotPassswordMutation = trpc.auth.forgotPassword.useMutation();

	const forgotPassword = (data: RouterInput["auth"]["forgotPassword"]) => {
		return forgotPassswordMutation.mutate(data);
	};

	return {
		forgotPassword,
		mutation: forgotPassswordMutation,
		isLoading: forgotPassswordMutation.isLoading,
		isError: forgotPassswordMutation.isError,
		error: forgotPassswordMutation.error?.message,
	};
};
