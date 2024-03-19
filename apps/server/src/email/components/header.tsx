import { MjmlImage, MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { env } from "../../env";
import type { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => {
	return (
		<>
			<MjmlImage
				href="https://cybership.io"
				target="_blank"
				width="64px"
				// src={`${env.CYBER_CLOUDFRONT_URL}/assets/logo.jpg`}
			/>
			<MjmlText fontWeight="bold" fontSize="20px" align="center">
				{children}
			</MjmlText>
			<MjmlSpacer />
		</>
	);
};
