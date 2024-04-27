import { useMemo, type ReactNode } from "react";
import { Avatar, Box, Card, Divider, Group, Highlight, Mark, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export interface Chunk {
	text: string;
	match: boolean;
}
export interface HighlightOptions {
	text: string;
	query: string | string[];
}

const escapeRegexp = (term: string): string =>
	term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`);

function buildRegex(query: string[]) {
	const _query = query
		.filter((text) => text.length !== 0)
		.map((text) => escapeRegexp(text.trim()));
	if (!_query.length) {
		return null;
	}

	return new RegExp(`(${_query.join("|")})`, "ig");
}

export function highlightWords({ text, query }: HighlightOptions): Chunk[] {
	const regex = buildRegex(Array.isArray(query) ? query : [query]);
	if (!regex) {
		return [{ text, match: false }];
	}
	const result = text.split(regex).filter(Boolean);
	return result.map((str) => ({ text: str, match: regex.test(str) }));
}

type UseHighlightProps = HighlightOptions;

const useHighlight = (props: UseHighlightProps) => {
	const { text, query } = props;
	return useMemo(() => highlightWords({ text, query }), [text, query]);
};

export type SocialMatchProps = {
	content: string;
	isMatch: boolean;
	pos: string[];
	neg: string[];
	reason?: ReactNode;
};

export const SocialMatch = ({ content, isMatch, pos, neg, reason }: SocialMatchProps) => {
	const chunks = useHighlight({
		text: content,
		query: [...pos, ...neg],
	});

	return (
		<Card>
			<Group>
				<Avatar radius="sm">
					{isMatch ? (
						<IconCheck color="var(--mantine-color-green-5)" />
					) : (
						<IconX color="var(--mantine-color-red-5)" />
					)}
				</Avatar>
				<Box>
					<Text>
						{chunks.map(({ match, text }, idx) =>
							match ? (
								pos.includes(text) ? (
									<span
										style={{ color: "var(--mantine-color-green-5)" }}
										key={idx}
									>
										{text}
									</span>
								) : neg.includes(text) ? (
									<span style={{ color: "var(--mantine-color-red-5)" }} key={idx}>
										{text}
									</span>
								) : (
									text
								)
							) : (
								text
							)
						)}
					</Text>
				</Box>
			</Group>
			{reason && (
				<Card.Section px="sm" mt="sm">
					<Divider mb="xs" />
					<Text size="sm" c="dimmed">
						{reason}
					</Text>
				</Card.Section>
			)}
		</Card>
	);
};
