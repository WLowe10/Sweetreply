import {
	Box,
	type BoxProps,
	Card,
	SimpleGrid,
	Stack,
	TextInput,
	Button,
	Textarea,
	Divider,
} from "@mantine/core";
import { useForm } from "react-hook-form";

export const Playground = (boxProps: BoxProps) => {
	const form = useForm({
		defaultValues: {
			product_name: "Gringotts Wizarding Bank",
			product_description:
				"Gringotts Wizarding Bank offers secure vaults for storing wizarding wealth, safeguarded by magical enchantments. With a legacy spanning centuries, we provide unparalleled financial services to the magical community. Trust Gringotts for all your banking needs in the wizarding world.",
			post_content:
				"I'm looking for an extremely secure bank with 24/7 security. Does anyone have any recommendations?",
		},
	});

	return (
		<Box component="section" id="playground" {...boxProps}>
			<form>
				<SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
					<Card withBorder p="lg">
						<Stack>
							<TextInput
								label="Product name"
								placeholder="Product name"
								{...form.register("product_name")}
							/>
							<Textarea
								label="Product description"
								placeholder="Product description"
								resize="vertical"
								autosize={true}
								maxRows={5}
								{...form.register("product_description")}
							/>
						</Stack>
					</Card>
					<Card withBorder p="lg">
						<Stack>
							<Textarea
								label="Social media post"
								placeholder="Social media post"
								resize="vertical"
								autosize={true}
								maxRows={5}
								{...form.register("post_content")}
							/>
							<Button type="submit">Generate reply</Button>
						</Stack>
					</Card>
				</SimpleGrid>
			</form>
		</Box>
	);
};
