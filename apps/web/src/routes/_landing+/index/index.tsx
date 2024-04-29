import { Features } from "./features";
import { FAQ } from "./faq";
import { Playground } from "./playground";
import { Hero } from "./hero";
import { Container } from "@mantine/core";

export default function HomePage() {
	return (
		<Container size="lg" mb="16rem" px="lg">
			<Hero mb="16rem" />
			<Features mb="20rem" />
			<Playground mb="20rem" />
			<FAQ />
		</Container>
	);
}
