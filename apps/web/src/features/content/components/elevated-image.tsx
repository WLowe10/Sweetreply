import { Image, Paper, type ImageProps } from "@mantine/core";

export type ElevatedImageProps = {
	src: string;
};

export const ElevatedImage = (imageProps: ImageProps) => {
	return (
		<Paper withBorder shadow="lg" style={{ overflow: "hidden" }}>
			<Image {...imageProps} />
		</Paper>
	);
};
