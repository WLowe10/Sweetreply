import { Box, type BoxProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

export type BaseLayoutProps = BoxProps & {
	title: string;
	description?: string;
};

export const BaseLayout = ({ title, description = "", children, ...boxProps }: PropsWithChildren<BaseLayoutProps>) => {
	return (
		<>
			<Box {...boxProps}>{children}</Box>
		</>
	);
};
