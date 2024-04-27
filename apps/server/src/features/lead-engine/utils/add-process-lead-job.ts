import { processLeadQueue } from "../queues/process-lead";

export function addProcessLeadJob(leadId: string) {
	return processLeadQueue.add({ lead_id: leadId }, { jobId: leadId });
}
