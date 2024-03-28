import { trpc } from "@/lib/trpc";
import { useMe } from "./use-me";

export const useRequestVerification = () => {
	const { me } = useMe();
	const requestVerificationMutation = trpc.auth.requestVerification.useMutation();

	const requestVerification = () => {
		requestVerificationMutation.mutate(undefined);
	};

	return {
		requestVerification,
		mutation: requestVerificationMutation,
		isLoading: requestVerificationMutation.isLoading,
		isError: requestVerificationMutation.isError,
		error: requestVerificationMutation.error?.message,
	};
};
