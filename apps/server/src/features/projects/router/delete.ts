import { authenticatedProcedure } from "@/trpc";

export const deleteProjectHandler = authenticatedProcedure.mutation(() => {});
