import { trpc } from "@/trpc";

export default function HomePage() {
    const getMeQuery = trpc.getDate.useQuery();

    return <main>hello world: {getMeQuery.data?.date.getFullYear()}</main>;
}
