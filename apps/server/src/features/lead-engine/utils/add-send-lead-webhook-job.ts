import { sendLeadWebhookQueue } from "../queues/send-lead-webhook";

export function addSendLeadWebhookJob(leadId: string) {
	return sendLeadWebhookQueue.add({ lead_id: leadId }, { jobId: leadId });
}
