import { ActionIcon, Button, Indicator, MultiSelect, Popover, Select, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconFilter } from "@tabler/icons-react";
import { useDataTableContext } from "../hooks/use-data-table-context";
import type { DataTableFiltersItemType } from "../context";

// date-range is broken, read the comment in the onChange

const FilterItem = ({ item }: { item: DataTableFiltersItemType }) => {
	const { params } = useDataTableContext();
	const name = item.name;
	const value = params.getFilter(name);
	const label = item.label || name;
	const placeholder = item.placeholder;

	return item.type === "select" ? (
		<Select
			label={label}
			placeholder={placeholder}
			comboboxProps={{ withinPortal: false }}
			data={item.options as any}
			value={value}
			onChange={(newValue) => {
				if (newValue === null) {
					params.clearFilter(name);
				} else {
					params.setFilter(name, newValue);
				}
			}}
		/>
	) : item.type === "multi-select" ? (
		<MultiSelect
			label={label}
			placeholder={!value || value.length === 0 ? placeholder : undefined}
			comboboxProps={{ withinPortal: false }}
			clearable={true}
			data={item.options as any}
			value={value || []}
			onChange={(newValue) => {
				if (newValue.length > 0) {
					params.setFilter(name, newValue);
				} else {
					params.clearFilter(name);
				}
			}}
		/>
	) : item.type === "date-range" ? (
		<DatePickerInput
			type="range"
			label={label}
			placeholder={placeholder}
			allowSingleDateInRange={true}
			clearable={true}
			popoverProps={{ withinPortal: false }}
			leftSection={<IconCalendar size={18} />}
			value={
				value
					? [value[0] ? new Date(value[0]) : null, value[1] ? new Date(value[1]) : null]
					: [null, null]
			}
			onChange={(newValue) => {
				// instantly fires with [null, null] when fully selecting both dates. Does not occur when directly using state

				if (newValue && (newValue[0] !== null || newValue[1] !== null)) {
					params.setFilter(name, newValue);
				} else {
					params.clearFilter(name);
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
