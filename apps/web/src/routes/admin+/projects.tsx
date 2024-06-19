import { buildPageTitle } from "utils";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Projects", "Sweetreply Admin") }];

export default function ProjectsPage() {
	return <div>projects</div>;
}
