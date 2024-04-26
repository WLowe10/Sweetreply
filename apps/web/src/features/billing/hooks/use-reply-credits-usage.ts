import { useMe } from "@/features/auth/hooks/use-me";
import { BillingPlanReplyCredits } from "@sweetreply/shared/features/billing/constants";

export const useReplyCreditsUsage = () => {
	const { me } = useMe();

	const usage =
		//@ts-ignore
		me && me.plan ? (me?.reply_credits / BillingPlanReplyCredits[me.plan]) * 100 : 0;

	return usage;
};
