import { userModel } from "@replyon/prisma/zod";
import type { User } from "@replyon/prisma";

const serializedUserSchema = userModel.pick({
    id: true,
    email: true,
    email_verified: true,
    avatar_url: true,
    role: true,
});

export function serializeUser(user: User) {
    return serializedUserSchema.parse(user);
}
