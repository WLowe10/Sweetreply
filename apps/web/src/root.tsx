import { LinksFunction, LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { env } from "@env";
import { TRPCProvider } from "@lib/trpc";
import { theme } from "@lib/theme";
import { buildPageTitle } from "@lib/utils";
import type { PropsWithChildren } from "react";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

const TITLE = buildPageTitle("A friendly AI that mentions your product online");
const DESCRIPTION = "Boost your online presence with Sweetreply's automatic AI shout-outs";
const OG_IMAGE_URL = "https://sweetreply.io/og.png";

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
		rel: "icon",
		type: "image/x-icon",
		href: "favicon.ico",
	},
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
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
	},
];

export const meta: MetaFunction = () => [
	{
		title: TITLE,
	},
	{
		name: "description",
		content: DESCRIPTION,
	},
	{
		tagName: "meta",
		property: "og:type",
		content: "website",
	},
	{
		tagName: "meta",
		property: "og:site_name",
		content: "Sweetreply",
	},
	{
		tagName: "meta",
		property: "og:url",
		content: "https://sweetreply.io/",
	},
	{
		tagName: "meta",
		property: "og:title",
		content: TITLE,
	},
	{
		tagName: "meta",
		property: "og:description",
		content: DESCRIPTION,
	},
	{
		tagName: "meta",
		property: "og:image",
		content: OG_IMAGE_URL,
	},
	{
		tagName: "meta",
		property: "twitter:card",
		content: "summary_large_image",
	},
	// {
	// tagName: "meta",
	// 	property: "twitter:site",
	// 	content: "@sweetreply",
	// },
	{
		tagName: "meta",
		property: "twitter:title",
		content: TITLE,
	},
	{
		tagName: "meta",
		property: "twitter:description",
		content: DESCRIPTION,
	},
	{
		tagName: "meta",
		property: "twitter:image",
		content: OG_IMAGE_URL,
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
			<Notifications />
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
