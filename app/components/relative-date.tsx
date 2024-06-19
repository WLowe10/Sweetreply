import { Text, Tooltip, type TextProps } from "@mantine/core";
import { formatRelative } from "date-fns";

export const RelativeDate = ({ date, ...textProps }: { date: Date } & TextProps) => {
	return (
		<Tooltip label={date.toDateString()}>
			<Text component="time" {...textProps}>
				{formatRelative(date, new Date())}
			</Text>
		</Tooltip>
	);
};
