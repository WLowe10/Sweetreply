import { trpc } from "@/lib/trpc";

export default function HomePage() {
	const helloWorldQuery = trpc.helloWorld.useQuery();

	return <main>{helloWorldQuery.data}</main>;
}
