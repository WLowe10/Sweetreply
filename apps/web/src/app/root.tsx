import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { env } from "@/env";
import { TRPCProvider } from "@/lib/trpc";
import { theme } from "@/lib/theme";
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

export const loader: LoaderFunction = () =>
	json({
		env: getPublicEnv(),
	});

export const links: LinksFunction = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com",
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		// href: "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap",
		// href: "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
		// href: "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
		// href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
	},
];

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
		<MantineProvider forceColorScheme="dark" theme={theme}>
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
				<ReactQueryDevtools position="bottom-right" />
			</RootProviders>
		</Document>
	);
}
