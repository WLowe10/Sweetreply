import { SEO } from "@/components/seo";
import { trpc } from "@/lib/trpc";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";

import "@mantine/core/styles.css";

const Providers = ({ children }: PropsWithChildren) => {
	return <MantineProvider>{children}</MantineProvider>;
};

const App = ({ Component, pageProps }: AppProps) => {
	console.log(process.env.NEXT_PUBLIC_API_URL);
	return (
		<Providers>
			<SEO />
			<Component {...pageProps} />
		</Providers>
	);
};

export default trpc.withTRPC(App);
