import {
	Mjml,
	MjmlBody,
	MjmlColumn,
	MjmlFont,
	MjmlHead,
	MjmlSection,
	MjmlText,
	MjmlWrapper,
	MjmlStyle,
	MjmlAttributes,
} from "@faire/mjml-react";
import { PropsWithChildren } from "react";

export const Container = ({ children }: PropsWithChildren) => {
	return (
		<Mjml>
			<MjmlHead>
				<MjmlFont
					name="Inter"
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
				/>
				<MjmlAttributes>
					<MjmlText
						fontSize="14px"
						fontFamily="Inter, Roboto, Arial"
						lineHeight="1.4"
						color="#333333"
					/>
				</MjmlAttributes>
				<MjmlStyle>{`.card{border: 1px solid #e0e0e0 !important;border-radius: 6px !important;}`}</MjmlStyle>
			</MjmlHead>
			<MjmlBody>
				<MjmlWrapper padding="20px">
					<MjmlSection padding="20px" className="card">
						<MjmlColumn>{children}</MjmlColumn>
					</MjmlSection>
				</MjmlWrapper>
			</MjmlBody>
		</Mjml>
	);
};
