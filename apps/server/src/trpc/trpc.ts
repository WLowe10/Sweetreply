import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createContext } from "./context";
import { OpenApiMeta } from "trpc-openapi";

export const trpc = initTRPC.context<ReturnType<typeof createContext>>().meta<OpenApiMeta>().create({
	transformer: superjson,
});

export const router = trpc.router;
