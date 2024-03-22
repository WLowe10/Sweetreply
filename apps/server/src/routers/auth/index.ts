import { router } from "@/trpc";
import { signUpHandler } from "./sign-up";
import { signInHandler } from "./sign-in";
import { getMeHandler } from "./get-me";
import { updateMeHandler } from "./update-me";

export const authRouter = router({
	signUp: signUpHandler,
	signIn: signInHandler,
	getMe: getMeHandler,
	updateMe: updateMeHandler,
});
