import { ActionIcon, Popover } from "@mantine/core";
import { IconArrowsUpDown } from "@tabler/icons-react";

export const DataTableSort = () => {
	return (
		<Popover>
			<Popover.Target>
				<ActionIcon variant="default" size="lg">
					<IconArrowsUpDown size={18} stroke={1.5} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>test</Popover.Dropdown>
		</Popover>
	);
};
