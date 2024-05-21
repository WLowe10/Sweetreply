import { createContext } from "react";
import { useDataTableParams } from "./hooks/use-data-table-params";

export interface BaseDataTableFilterItemType {
	name: string;
	type: string;
	label?: string;
}

export interface SelectDataTableFilterItemType extends BaseDataTableFilterItemType {
	type: "select";
	options: (string | { label: string; value: string })[];
}

export interface DateRangeDataTableFilterItemType extends BaseDataTableFilterItemType {
	type: "date";
}

export type DataTableFiltersItemType =
	| SelectDataTableFilterItemType
	| DateRangeDataTableFilterItemType;

export type DataTableFiltersType = DataTableFiltersItemType[];

export type DataTableContextType = {
	data: any[];
	total: number;
	params: ReturnType<typeof useDataTableParams>;
	isLoading?: boolean;
	filters?: DataTableFiltersType;
	options?: Partial<{
		noun: string;
	}>;
};

export const DataTableContext = createContext<DataTableContextType | null>(null);
