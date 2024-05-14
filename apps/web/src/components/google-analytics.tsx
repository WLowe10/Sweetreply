import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "@lib/gtag";

export type GoogleAnalyticsProps = {
	gaTrackingID: string;
};

export const GoogleAnalyics = ({ gaTrackingID }: GoogleAnalyticsProps) => {
	const location = useLocation();

	useEffect(() => {
		gtag.pageview(location.pathname, gaTrackingID);
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
