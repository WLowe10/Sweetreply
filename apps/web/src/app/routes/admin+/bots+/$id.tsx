import { useParams } from "@remix-run/react";

export default function BotPage() {
	const { id } = useParams();

	return <div>Social account: {id}</div>;
}
