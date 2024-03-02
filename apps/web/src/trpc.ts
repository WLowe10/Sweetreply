import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../../server/src/app";

export const trpc = createTRPCNext<AppRouter>({
    ssr: false,
    config(opts) {
        return {
            links: [
                httpBatchLink({
                    url: "",
                }),
            ],
        };
    },
});
