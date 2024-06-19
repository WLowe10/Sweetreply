import { useContext } from "react";
import { LeadContext, type LeadContextType } from "../context";

export const useLeadContext = () => useContext(LeadContext) as LeadContextType;
