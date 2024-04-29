import { useMemo, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { buildAPIUrl } from "@lib/utils";
import superjson from "superjson";
import type { AppRouter } from "@server/router";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: PropsWithChildren) => {
	const queryClient = useMemo(() => new QueryClient(), []);
	const trpcClient = useMemo(
		() =>
			trpc.createClient({
				transformer: superjson,
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
			}),
		[]
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
