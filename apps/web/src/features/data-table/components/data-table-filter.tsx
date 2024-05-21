import { ActionIcon, Button, Indicator, Popover, Select, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import { useDataTableContext } from "../hooks/use-data-table-context";
import type { DataTableFiltersItemType } from "../context";

const FilterItem = ({ item }: { item: DataTableFiltersItemType }) => {
	const { params } = useDataTableContext();
	const name = item.name;
	const value = params.getFilter(name);
	const label = item.label || name;

	return item.type === "select" ? (
		<Select
			label={label}
			comboboxProps={{ withinPortal: false }}
			allowDeselect={false}
			data={item.options as any}
			value={value || null}
			onChange={(newValue) => params.setFilter(name, newValue)}
		/>
	) : item.type === "date" ? (
		<DatePickerInput
			type="range"
			placeholder="Filter by date"
			allowSingleDateInRange={true}
			popoverProps={{ withinPortal: false }}
			label={label}
			value={
				value && [
					value[0] ? new Date(value[0]) : null,
					value[1] ? new Date(value[1]) : null,
				]
			}
			onChange={(newValue) => {
				if (newValue && (newValue[0] !== null || newValue[1] !== null)) {
					params.setFilter(name, newValue);
				}
			}}
		/>
	) : null;
};

export const DataTableFilter = () => {
	const { filters, params } = useDataTableContext();
	const filterCount = Object.keys(params.filters).length;
	const hasFilters = filterCount > 0;

	return (
		<Popover withArrow position="bottom-end">
			<Popover.Target>
				<Indicator withBorder disabled={!hasFilters}>
					<ActionIcon variant="default" size="lg">
						<IconFilter size={18} stroke={1.5} />
					</ActionIcon>
				</Indicator>
			</Popover.Target>
			<Popover.Dropdown miw={300}>
				<Stack>
					{filters && filters.map((item) => <FilterItem item={item} key={item.name} />)}
					<Button size="xs" disabled={!hasFilters} onClick={params.clearFilters}>
						Clear filters
					</Button>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
};
