import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { buildAPIUrl } from "./utils";
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
					url: buildAPIUrl("/trpc"),
					fetch(url, options) {
						return fetch(url, {
							...options,
							credentials: "include",
						});
					},
				}),
			],
		};
	},
});
