import { Tooltip } from "@mantine/core";
import { IconReddit } from "./icons/reddit";
import { IconHackerNews } from "./icons/hacker-news";
import type { SVGProps } from "react";

export type PlatformIconProps = SVGProps<SVGSVGElement> & {
	platform: "reddit";
	tooltip?: boolean;
};

export const PlatformIcon = ({ platform, tooltip, ...svgProps }: PlatformIconProps) => {
	const icon =
		platform === "reddit" ? (
			<IconReddit {...svgProps} />
		) : platform === "hacker-news" ? (
			<IconHackerNews {...svgProps} />
		) : null;

	return tooltip ? <Tooltip label={platform}>{icon}</Tooltip> : icon;
};
