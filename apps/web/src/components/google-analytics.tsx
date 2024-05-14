import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

export type GoogleAnalyticsProps = {
	gaTrackingID: string;
};

export const GoogleAnalyics = ({ gaTrackingID }: GoogleAnalyticsProps) => {
	const location = useLocation();

	useEffect(() => {
		// @ts-ignore
		gtag.pageview(location.pathname, gaTrackingId);
	}, [location, gaTrackingID]);

	return (
		<>
			<script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingID}`} />
			<script
				dangerouslySetInnerHTML={{
					__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());

					gtag('config', '${gaTrackingID}', {
						page_path: window.location.pathname,
					});`,
				}}
			/>
		</>
	);
};
