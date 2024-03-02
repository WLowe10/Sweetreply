import { SEO } from "@/components/seo";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
    return <></>;
};

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <SEO />
            <Component {...pageProps} />
        </>
    );
};

export default App;
