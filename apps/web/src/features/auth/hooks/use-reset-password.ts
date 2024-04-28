import { useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { trpc } from "@lib/trpc";
import { notifications } from "@mantine/notifications";

export const useResetPassword = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const changePasswordMutation = trpc.auth.changePassword.useMutation();

	const code = searchParams.get("code");

	const resetPassword = (newPassword: string) => {
		if (!code) {
			throw new Error("Code is required to change password");
		}

		return changePasswordMutation.mutate(
			{
				new_password: newPassword,
				code,
			},
			{
				onSuccess: () => {
					notifications.show({
						title: "Password changed",
						message: "You can now sign in with your new password",
					});

					navigate("/sign-in");
				},
			}
		);
	};

	useEffect(() => {
		if (!code) {
			navigate("/");
		}
	}, [code]);

	return {
		code,
		resetPassword,
		mutation: changePasswordMutation,
		isLoading: changePasswordMutation.isLoading,
		isError: changePasswordMutation.isError,
		error: changePasswordMutation.error?.message,
	};
};
