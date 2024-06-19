import { SES as AWSSES } from "@aws-sdk/client-ses";
import { env } from "~/env";

const baseAWSConfig = {
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
} as const;

export const ses = new AWSSES(baseAWSConfig);
