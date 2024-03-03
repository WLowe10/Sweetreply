import { router } from "@/trpc";
import { signUpHandler } from "./sign-up";
import { getMeHandler } from "./get-me";
import { signInHandler } from "./sign-in";

export const authRouter = router({
    getMe: getMeHandler,
    signIn: signInHandler,
    signUp: signUpHandler,
});
