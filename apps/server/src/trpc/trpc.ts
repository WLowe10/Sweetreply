import { initTRPC, type inferAsyncReturnType } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { createContext } from "./context"

export const trpc = initTRPC.context<ReturnType<typeof createContext>>().create({
	transformer: superjson,
	// errorFormatter({ shape, error }) {
	// 	return {
	// 		...shape,
	// 		data: {
	// 			...shape.data,
	// 			zodError: error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause.flatten() : null,
	// 		},
	// 	}
	// },
})

export const router = trpc.router
export const publicProcedure = trpc.procedure
