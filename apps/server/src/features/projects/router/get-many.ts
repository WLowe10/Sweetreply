import { authenticatedProcedure } from "@/trpc";

export const getManyProjectsHandler = authenticatedProcedure.query(() => {});
