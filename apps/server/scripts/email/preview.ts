import "dotenv/config";
import fs from "fs";
import path from "path";
import { createElement } from "react";
import { render } from "@faire/mjml-react/utils/render";
import { WelcomeEmail } from "../../src/email/templates/welcome";
import { VerifyAccountEmail } from "../../src/email/templates/verify-account";
import { PasswordResetEmail } from "../../src/email/templates/password-reset";
import { LowOnTokensEmail } from "../../src/email/templates/low-on-tokens";

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

generateEmailPreview({
	name: "low-on-tokens",
	component: LowOnTokensEmail,
	props: {
		firstName: "John",
		projectId: "123",
		projectName: "Olathe Mowing",
	},
});

console.log(`Email previews generated in ${Date.now() - start}ms`);
