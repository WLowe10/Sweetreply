import type { Project } from "@sweetreply/prisma";

export const getProjectIssues = (project: Pick<Project, "query" | "description">) => {
	const issues: string[] = [];

	if (!project.query) {
		issues.push("You cannot monitor posts until you have configured a query");
	}

	if (!project.description) {
		issues.push("You cannot generate replies until you have configured a description");
	}

	return issues;
};
