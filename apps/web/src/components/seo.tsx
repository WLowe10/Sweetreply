import Head from "next/head";

// https://www.jimraptis.com/blog/seo-component-for-next-js-react

const SITE_NAME = "Replyon";
const DOMAIN = "https://replyon.ai";
const TWITTER_HANDLE = "@replyonai";
const DEFAULT_OG_IMAGE =
    "https://storage.googleapis.com/brandflow-bucket/personal/blog/portfolio-og.jpg";

export type SEOProps = {
    title: string;
    description: string;
    siteName?: string;
    ogType?: string;
    twitterHandle?: string;
    ogImage?: string;
    canonical: string;
};

export const SEO = ({
    title,
    description,
    siteName = SITE_NAME,
    ogType = "website",
    twitterHandle = TWITTER_HANDLE,
    ogImage = DEFAULT_OG_IMAGE,
    canonical,
}: SEOProps) => {
    return (
        <Head>
            <title key="title">{`${title} | ${siteName}`}</title>
            <meta name="description" content={description} />
            <meta key="og_type" property="og:type" content={ogType} />
            <meta key="og_title" property="og:title" content={title} />
            <meta
                key="og_description"
                property="og:description"
                content={description}
            />
            <meta key="og_locale" property="og:locale" content="en_IE" />
            <meta
                key="og_site_name"
                property="og:site_name"
                content={siteName}
            />
            <meta
                key="og_url"
                property="og:url"
                content={canonical ?? DOMAIN}
            />
            <meta
                key="og_site_name"
                property="og:site_name"
                content={siteName}
            />
            <meta
                key="og_image"
                property="og:image"
                content={ogImage ?? DEFAULT_OG_IMAGE}
            />
            <meta
                key="og_image:alt"
                property="og:image:alt"
                content={`${title} | ${siteName}`}
            />
            <meta
                key="og_image:width"
                property="og:image:width"
                content="1200"
            />
            <meta
                key="og_image:height"
                property="og:image:height"
                content="630"
            />

            <meta name="robots" content="index,follow" />

            <meta
                key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                key="twitter:site"
                name="twitter:site"
                content={twitterHandle}
            />
            <meta
                key="twitter:creator"
                name="twitter:creator"
                content={twitterHandle}
            />
            <meta
                key="twitter:title"
                property="twitter:title"
                content={title}
            />
            <meta
                key="twitter:description"
                property="twitter:description"
                content={description}
            />

            <link rel="canonical" href={canonical ?? DOMAIN} />

            <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
    );
};
