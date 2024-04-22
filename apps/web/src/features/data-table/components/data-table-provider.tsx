import { DataTableContext, type DataTableContextType } from "../context";
import type { PropsWithChildren } from "react";

export type DataTableProviderProps = DataTableContextType;

export const DataTableProvider = ({
	children,
	...props
}: PropsWithChildren<DataTableProviderProps>) => {
	return <DataTableContext.Provider value={props}>{children}</DataTableContext.Provider>;
};
