import { router } from "@/trpc";
import { getManyTeamMembersHandler } from "./get-many";
import { inviteTeamMemberHandler } from "./invite";
import { removeTeamMemberHandler } from "./remove";
import { updateTeamMemberHandler } from "./update";

export const teamMembersRouter = router({
	getMany: getManyTeamMembersHandler,
	invite: inviteTeamMemberHandler,
	update: updateTeamMemberHandler,
	remove: removeTeamMemberHandler,
});
