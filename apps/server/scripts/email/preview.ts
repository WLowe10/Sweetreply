import "dotenv/config";
import fs from "fs";
import path from "path";
import { createElement } from "react";
import { render } from "@faire/mjml-react/utils/render";
import { WelcomeEmail } from "../../src/email/templates/welcome";
import { VerifyAccountEmail } from "../../src/email/templates/verify-account";
import { ResetPasswordEmail } from "../../src/email/templates/reset-password";
import { TeamInvitationEmail } from "../../src/email/templates/team-invitation";

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

	fs.writeFileSync(path.resolve(outDir, `${name}.html`), html);
}

const start = Date.now();

generateEmailPreview({
	name: "welcome",
	component: WelcomeEmail,
	props: {
		firstName: "John",
	},
});

generateEmailPreview({
	name: "verify-account",
	component: VerifyAccountEmail,
	props: {
		verifyCode: "",
	},
});

generateEmailPreview({
	name: "reset-password",
	component: ResetPasswordEmail,
	props: {
		resetPasswordLink: "",
	},
});

generateEmailPreview({
	name: "team-invitation",
	component: TeamInvitationEmail,
	props: {
		inviteeName: "Obama",
		inviterName: "Joe Biden",
		teamName: "USA",
		inviterEmail: "jb@gmail.com",
		teamSlug: "america",
	},
});

console.log(`Email previews generated in ${Date.now() - start}ms`);
