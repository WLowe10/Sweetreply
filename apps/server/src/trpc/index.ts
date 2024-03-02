import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { ContextType } from "./create-context";

export const trpc = initTRPC.context<ContextType>().create({
    transformer: superjson,
});

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;

export * from "./create-context";
