import { replyQueue } from "../queues/reply";
import { differenceInMilliseconds, isFuture } from "date-fns";

export function addReplyJob(leadId: string, opts?: { date: Date | undefined }) {
	let delay;

	if (opts?.date && isFuture(opts.date)) {
		delay = differenceInMilliseconds(opts.date, new Date());
	}

	return replyQueue.add({ lead_id: leadId }, { jobId: leadId, delay });
}
