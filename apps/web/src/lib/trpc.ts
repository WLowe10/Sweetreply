import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { env } from "../env";
import type { AppRouter } from "@server/router";

const queryClient = new QueryClient();

export const trpc = createTRPCNext<AppRouter>({
    ssr: false,
    config() {
        return {
            transformer: superjson,
            queryClient: queryClient,
            links: [
                httpBatchLink({
                    // url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
                    url: "http://localhost:3000/trpc",
                }),
            ],
        };
    },
});
