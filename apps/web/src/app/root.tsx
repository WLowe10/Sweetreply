import { json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { env } from "@/env";
import { TRPCProvider } from "@/lib/trpc";
import type { PropsWithChildren } from "react";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

// only provide the env variables that are needed on the client
const getPublicEnv = () => ({
	API_URL: env.API_URL,
});

declare global {
	interface Window {
		ENV: ReturnType<typeof getPublicEnv>;
	}
}

export function loader() {
	return json({
		env: getPublicEnv(),
	});
}

function Document({
	env,
	children,
}: PropsWithChildren<{
	env?: Record<string, string>;
}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ColorSchemeScript forceColorScheme="dark" />
			</head>
			<body>
				{children}
				{env && (
					<script
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(env)};`,
						}}
					/>
				)}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

function RootProviders({ children }: PropsWithChildren) {
	return (
		<MantineProvider forceColorScheme="dark">
			<TRPCProvider>{children}</TRPCProvider>
		</MantineProvider>
	);
}

// todo error boundary

export default function App() {
	const data = useLoaderData<typeof loader>();

	return (
		<Document env={data.env}>
			<RootProviders>
				<Outlet />
			</RootProviders>
		</Document>
	);
}
