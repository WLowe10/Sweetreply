import type { Project } from "@prisma/client";

export const getProjectIssues = (project: Pick<Project, "keywords" | "description">) => {
	const issues: string[] = [];

	if (project.keywords.length === 0) {
		issues.push("Add a keyword to start finding leads.");
	}

	if (!project.description) {
		issues.push("You cannot generate replies until you have configured a description");
	}

	return issues;
};
