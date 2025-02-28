import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createContext } from "./context";

export const trpc = initTRPC.context<ReturnType<typeof createContext>>().create({
	transformer: superjson,
});

export const router = trpc.router;
