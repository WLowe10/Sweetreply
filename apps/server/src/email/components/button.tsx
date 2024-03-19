import { type IMjmlButtonProps, MjmlButton } from "@faire/mjml-react"
import type { PropsWithChildren } from "react"

export const Button = ({ children, ...buttonProps }: PropsWithChildren<IMjmlButtonProps>) => {
	return (
		<MjmlButton
			fontFamily="Inter, Roboto, Arial"
			font-size="12px"
			textDecoration="none"
			textTransform="uppercase"
			backgroundColor="#000000"
			color="#ffffff"
			padding="10px 18px"
			borderRadius="5px"
			target="_blank"
			{...buttonProps}
		>
			{children}
		</MjmlButton>
	)
}
