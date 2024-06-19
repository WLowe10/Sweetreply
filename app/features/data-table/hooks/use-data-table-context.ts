import { useContext } from "react";
import { DataTableContext, type DataTableContextType } from "../context";

export const useDataTableContext = () => useContext(DataTableContext) as DataTableContextType;
