import { z } from "zod";
import { baseUserSchema } from "../auth/schemas";

// stub
const teamModel = z.object({
	id: z.string(),
	name: z.string(),
});

// stub
const teamMemberModel = z.object({});

export const baseTeamSchema = teamModel.extend({
	id: z.string().uuid(),
	name: teamModel.shape.name.min(3).max(32),
});

export const createTeamInputSchema = baseTeamSchema.pick({
	name: true,
});

export const updateTeamInputSchema = z.object({
	id: baseUserSchema.shape.id,
	data: baseTeamSchema.pick({
		name: true,
	}),
});

export const inviteTeamMemberInputSchema = z.object({
	teamId: baseTeamSchema.shape.id,
	userEmail: baseUserSchema.shape.email,
});

export const updateTeamMemberInputSchema = z.object({
	userId: baseUserSchema.shape.id,
	teamId: z.string(),
	data: teamMemberModel.pick({
		role: true,
	}),
});
