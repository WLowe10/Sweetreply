import { Paper, Group, Text } from "@mantine/core";
import classes from "./stat-card.module.css";
import type { IconProps } from "@tabler/icons-react";
import type { FunctionComponent } from "react";

export type StatCardProps = {
	title: string;
	value: string | number;
	icon: FunctionComponent<any>;
};

export const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
	return (
		<Paper withBorder p="md" radius="md">
			<Group justify="space-between">
				<Text size="xs" c="dimmed" className={classes.title}>
					{title}
				</Text>
				<Icon className={classes.icon} size="1.4rem" stroke={1.5} />
			</Group>

			<Group align="flex-end" gap="xs" mt={25}>
				<Text className={classes.value}>{value}</Text>
				{/* <Text c={stat.diff > 0 ? "teal" : "red"} fz="sm" fw={500} className={classes.diff}>
					<span>{stat.diff}%</span>
					<DiffIcon size="1rem" stroke={1.5} />
				</Text> */}
			</Group>

			{/* <Text fz="xs" c="dimmed" mt={7}>
				Compared to previous month
			</Text> */}
		</Paper>
	);
};
