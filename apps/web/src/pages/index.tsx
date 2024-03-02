import { trpc } from "@/trpc";
import Head from "next/head";

export default function HomePage() {
    const getMeQuery = trpc.;

    return (
        <main>
            hello world
        </main>
    );
}
