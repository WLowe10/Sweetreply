import { trpc } from "@/lib/trpc";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function OnboardPage() {
	const navigate = useNavigate();
	const getProjectsQuery = trpc.projects.getMany.useQuery();

	useEffect(() => {
		if (getProjectsQuery.data?.length && getProjectsQuery.data.length > 0) {
			navigate("/dashboard");
		}
	}, [getProjectsQuery.data]);

	return <div>please create a project</div>;
}
