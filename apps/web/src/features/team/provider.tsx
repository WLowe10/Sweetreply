import { trpc } from "@/lib/trpc";
import { createContext, useEffect, useState, type PropsWithChildren } from "react";

export type TeamContextType = {
	teamId: string | null;
	setTeamId: (teamId: string) => void;
};

export const TeamContext = createContext<TeamContextType | null>(null);

const TEAM_ID_KEY = "team_id";

// needs to switch team or show alert to get users to select their team if it is defined in local storage
// but the team doesnt exist anymore

export const TeamProvider = ({ children }: PropsWithChildren) => {
	const { data: teams } = trpc.teams.getMany.useQuery();
	const [teamIdState, setTeamIdState] = useState<string | null>(null);

	const setTeamId = (newTeamId: string | null) => {
		if (newTeamId) {
			localStorage.setItem(TEAM_ID_KEY, newTeamId);
		} else {
			localStorage.removeItem(TEAM_ID_KEY);
		}

		setTeamIdState(newTeamId);
	};

	useEffect(() => {
		const savedTeamId = localStorage.getItem(TEAM_ID_KEY);

		if (!savedTeamId && teams) {
			setTeamId(teams[0]?.id ?? null);
		} else {
			setTeamId(savedTeamId);
		}
	}, [teams]);

	return (
		<TeamContext.Provider
			value={{
				teamId: teamIdState,
				setTeamId,
			}}
		>
			{children}
		</TeamContext.Provider>
	);
};
