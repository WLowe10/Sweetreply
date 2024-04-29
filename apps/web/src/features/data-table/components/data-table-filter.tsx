import { ActionIcon, Popover, Select, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";

export const DataTableFilter = () => {
	const { params } = useDataTableContext();
	const { filter, setFilter } = params;

	return (
		<Popover withArrow position="bottom-end">
			<Popover.Target>
				<ActionIcon variant="default" size="lg">
					<IconFilter size={18} stroke={1.5} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown miw={300}>
				<Stack>
					<Select
						label="Platform"
						data={["reddit"]}
						comboboxProps={{ withinPortal: false }}
					/>
					<Select
						label="Reply status"
						data={[ReplyStatus.REPLIED]}
						comboboxProps={{ withinPortal: false }}
					/>
					<DatePickerInput
						label="Date"
						type="range"
						placeholder="Filter by date"
						allowSingleDateInRange={true}
						popoverProps={{ withinPortal: false }}
					/>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
};
