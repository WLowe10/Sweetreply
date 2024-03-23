import { router } from "@/trpc";
import { signUpHandler } from "./sign-up";
import { signInHandler } from "./sign-in";
import { getMeHandler } from "./get-me";
import { updateMeHandler } from "./update-me";
import { signOutHandler } from "./sign-out";
import { requestVerificationHandler } from "./request-verification";
import { forgotPasswordHandler } from "./forgot-password";
import { changePasswordHandler } from "./change-password";
import { requestPasswordResetHandler } from "./request-password-reset";

export const authRouter = router({
	signUp: signUpHandler,
	signIn: signInHandler,
	signOut: signOutHandler,
	requestVerification: requestVerificationHandler,
	requestPasswordReset: requestPasswordResetHandler,
	forgotPassword: forgotPasswordHandler,
	changePassword: changePasswordHandler,
	getMe: getMeHandler,
	updateMe: updateMeHandler,
});
