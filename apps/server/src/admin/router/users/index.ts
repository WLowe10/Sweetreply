import { router } from "@/trpc";
import { getManyUsersHandler } from "./get-many";
import { deleteSessionsHandler } from "./delete-sessions";
import { sendVerificationHandler } from "./send-verification";
import { sendPasswordResetHandler } from "./send-password-reset";

export const usersRouter = router({
	getMany: getManyUsersHandler,
	deleteSessions: deleteSessionsHandler,
	sendVerification: sendVerificationHandler,
	sendPasswordReset: sendPasswordResetHandler,
});
