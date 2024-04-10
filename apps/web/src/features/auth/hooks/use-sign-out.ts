import { useRouter } from "next/router";
import { trpc } from "@/lib/trpc";
import type { RouterInput } from "@server/router";

export const useSignOut = () => {
	const router = useRouter();
	const trpcUtils = trpc.useUtils();
	const signOutMutation = trpc.auth.signOut.useMutation();

	const signOut = (data: RouterInput["auth"]["signOut"]) => {
		return signOutMutation.mutate(data, {
			onSuccess: () => {
				// clear the user data in the query cache

				// ! clearing the data is not working for some reason
				// trpcUtils.auth.getMe.setData(undefined, undefined);

				// for now, ill just use invalidate to force the refetch

				trpcUtils.auth.getMe.invalidate();
				router.push("/sign-in");
			},
		});
	};

	return {
		signOut,
		mutation: signOutMutation,
		isLoading: signOutMutation.isLoading,
		isError: signOutMutation.isError,
		error: signOutMutation.error?.message,
	};
};
