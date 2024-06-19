import { createContext } from "react";
import { UseLeadType } from "./hooks/use-lead";

// export type LeadContextType = UseLeadType & Exclude<Pick<UseLeadType, "data">, undefined>;
export type LeadContextType = UseLeadType & {
	data: Exclude<UseLeadType["data"], undefined | null>;
};

export const LeadContext = createContext<LeadContextType | null>(null);
