import "dotenv/config";
import fs from "fs";
import path from "path";
import { createElement } from "react";
import { render } from "@faire/mjml-react/utils/render";
import { WelcomeEmail } from "../../server/features/email/templates/welcome";
import { VerifyAccountEmail } from "../../server/features/email/templates/verify-account";
import { PasswordResetEmail } from "../../server/features/email/templates/password-reset";
import { LowOnRepliesEmail } from "~/features/email/templates/low-on-replies";

const outDir = path.resolve(process.cwd(), "out", "email");

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

function generateEmailPreview<T extends React.FC<any>>({
	name,
	props,
	component,
}: {
	name: string;
	props: Parameters<T>[0];
	component: T;
}) {
	const { html } = render(createElement(component, props));
	const filePath = path.resolve(outDir, `${name}.html`);

	fs.writeFileSync(filePath, html);

	console.log(`${name} preview generated at ${filePath}`);
}

const start = Date.now();

generateEmailPreview({
	name: "welcome",
	component: WelcomeEmail,
	props: {
		verificationToken: "",
		firstName: "John",
	},
});

generateEmailPreview({
	name: "verify-account",
	component: VerifyAccountEmail,
	props: {
		verificationToken: "",
	},
});

generateEmailPreview({
	name: "reset-password",
	component: PasswordResetEmail,
	props: {
		resetCode: "",
	},
});

// this email isn't being used, but these current props wouldn't make sense
generateEmailPreview({
	name: "low-on-replies",
	component: LowOnRepliesEmail,
	props: {
		firstName: "John",
	},
});

console.log(`Email previews generated in ${Date.now() - start}ms`);
