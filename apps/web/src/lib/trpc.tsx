import { useMemo, type PropsWithChildren } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCClientError, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { buildAPIUrl } from "@lib/utils";
import type { AppRouter } from "@server/router";
import { notifications } from "@mantine/notifications";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: PropsWithChildren) => {
	const queryClient = useMemo(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: (err) => {
						if (err instanceof TRPCClientError) {
							notifications.show({
								title: "Something went wrong",
								message: err.message,
								color: "red",
							});
						}
					},
				}),
			}),
		[]
	);
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
