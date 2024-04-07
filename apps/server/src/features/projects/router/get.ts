import { authenticatedProcedure } from "@/trpc";

export const getProjectHandler = authenticatedProcedure.query(() => {});
