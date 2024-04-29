import { MjmlDivider, MjmlText, type IMjmlTextProps } from "@faire/mjml-react";
import { PropsWithChildren } from "react";

export const Footer = ({ children, ...textProps }: PropsWithChildren<IMjmlTextProps>) => {
	return (
		<>
			<MjmlDivider borderColor="#e0e0e0" borderWidth="1px" />
			<MjmlText fontSize="12px" color="#777777" lineHeight="1.4" {...textProps}>
				{children}
			</MjmlText>
		</>
	);
};
