import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";
import { env } from "./env";
import type { AppRouter } from "../../server/src/app";

export const trpc = createTRPCNext<AppRouter>({
    ssr: false,
    config() {
        return {
            transformer: superjson,
            links: [
                httpBatchLink({
                    url: env.NEXT_PUBLIC_API_URL,
                }),
            ],
        };
    },
});
