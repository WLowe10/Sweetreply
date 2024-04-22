import { createContext } from "react";
import { useDataTableParams } from "./hooks/use-data-table-params";

export type DataTableContextType = {
	data: any[];
	total: number;
	params: ReturnType<typeof useDataTableParams>;
	isLoading?: boolean;
	options?: Partial<{
		noun: string;
	}>;
};

export const DataTableContext = createContext<DataTableContextType | null>(null);
