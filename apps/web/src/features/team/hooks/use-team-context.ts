import { useContext } from "react";
import { TeamContext, type TeamContextType } from "../provider";

export const useTeamContext = () => useContext(TeamContext) as TeamContextType;
