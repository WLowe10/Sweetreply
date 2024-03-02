import { SEO } from "@/components/seo";
import { trpc } from "@/trpc";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
    return <></>;
};

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Providers>
            {/* <SEO /> */}
            <Component {...pageProps} />
        </Providers>
    );
};

export default trpc.withTRPC(App);
