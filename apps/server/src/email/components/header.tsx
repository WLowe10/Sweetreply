import { MjmlImage, MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { env } from "../../env";
import { appConfig } from "@sweetreply/shared/lib/constants";
import type { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => {
	return (
		<>
			<MjmlImage
				target="_blank"
				width="64px"
				href={env.FRONTEND_URL}
				src={appConfig.iconUrl}
			/>
			<MjmlText fontWeight="bold" fontSize="20px" align="center">
				{children}
			</MjmlText>
			<MjmlSpacer />
		</>
	);
};
