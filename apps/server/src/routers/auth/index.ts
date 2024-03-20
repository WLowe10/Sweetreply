import { router } from "@/trpc";
import { signUpHandler } from "./sign-up";

export const authRouter = router({
	signUp: signUpHandler,
});
