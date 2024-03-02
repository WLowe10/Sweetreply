import { router } from "@/trpc";
import { signUpHandler } from "./sign-up";
import { getMeHandler } from "./get-me";

export const authRouter = router({
    getMe: getMeHandler,
    signUp: signUpHandler,
});
