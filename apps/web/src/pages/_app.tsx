import { SEO } from "@/components/seo";
import { trpc } from "@/lib/trpc";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

const Providers = ({ children }: PropsWithChildren) => {
	return <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>;
};

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Providers>
			<SEO />
			<Component {...pageProps} />
		</Providers>
	);
};

export default trpc.withTRPC(App);
