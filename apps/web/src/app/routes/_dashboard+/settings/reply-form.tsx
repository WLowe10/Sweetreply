import { Box, Button, Checkbox, Stack, Switch, TextInput, Textarea } from "@mantine/core";

export const ReplyForm = () => {
	return (
		<Box mt={"sm"}>
			<form onSubmit={() => {}}>
				<Stack>
					<Switch
						label="Enable replies"
						description="When enabled, we will automatically reply to leads on your behalf"
					/>
					<Textarea
						label="Custom instructions"
						description="Use custom instructions to fine-tune how our AI generates replies"
					/>
					<Button type="submit">Save</Button>
				</Stack>
			</form>
		</Box>
	);
};
