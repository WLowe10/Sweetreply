import { SVGProps, Ref, forwardRef } from "react";

export const IconReddit = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		// style={
		// 	{
		// 		enableBackground: "new 0 0 1000 1000",
		// 	}
		// }
		viewBox="0 0 1000 1000"
		ref={ref}
		{...props}
	>
		<title />
		<path
			d="M500 1000C223.9 1000 0 776.1 0 500S223.9 0 500 0s500 223.9 500 500-223.9 500-500 500z"
			style={{
				fill: "#ff4500",
			}}
		/>
		<path
			d="M614.6 604.2c-28.7 0-52.1-23.4-52.1-52.1 0-28.7 23.4-52.1 52.1-52.1s52.1 23.4 52.1 52.1c0 28.7-23.4 52.1-52.1 52.1m9.2 85.5C588.2 725.2 520.1 728 500.1 728s-88.2-2.8-123.7-38.3c-5.3-5.3-5.3-13.8 0-19.1 5.3-5.3 13.8-5.3 19.1 0C417.9 693 465.8 701 500.1 701c34.2 0 82.2-8 104.6-30.4 5.3-5.3 13.8-5.3 19.1 0 5.2 5.3 5.2 13.8 0 19.1M333.3 552.1c0-28.7 23.4-52.1 52.1-52.1 28.7 0 52.1 23.4 52.1 52.1 0 28.7-23.4 52.1-52.1 52.1-28.7 0-52.1-23.4-52.1-52.1m500-52.1c0-40.3-32.6-72.9-72.9-72.9-19.7 0-37.5 7.8-50.6 20.5-49.8-36-118.5-59.2-195-61.9L548 229.4l108.5 23.1c1.3 27.6 23.9 49.6 51.8 49.6 28.8 0 52.1-23.3 52.1-52.1s-23.3-52.1-52.1-52.1c-20.5 0-38 11.9-46.5 29.1l-121.2-25.8c-3.4-.7-6.9-.1-9.8 1.8-2.9 1.9-4.9 4.8-5.6 8.2l-36.4 171.5c-.2 1 0 1.9 0 2.9-77.9 2-147.9 25.3-198.5 61.8-13.1-12.6-30.8-20.3-50.4-20.3-40.3 0-72.9 32.7-72.9 72.9 0 29.6 17.7 55.1 43.1 66.5-1.1 7.2-1.7 14.6-1.7 22.1 0 112.2 130.6 203.1 291.7 203.1s291.7-90.9 291.7-203.1c0-7.4-.6-14.7-1.7-21.9 25.3-11.4 43.2-36.9 43.2-66.7"
			style={{
				fill: "#fff",
			}}
		/>
	</svg>
));
