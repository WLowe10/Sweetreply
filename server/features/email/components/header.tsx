import { MjmlImage, MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { appConfig } from "@shared/config";
import { env } from "~/env";
import type { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => {
	return (
		<>
			<MjmlImage
				target="_blank"
				height="48px"
				width="48px"
				href={env.FRONTEND_URL}
				src={appConfig.iconURL}
			/>
			<MjmlText fontWeight="bold" fontSize="20px" align="center">
				{children}
			</MjmlText>
			<MjmlSpacer />
		</>
	);
};
