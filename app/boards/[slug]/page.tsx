// app/boards/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
    params: { slug: string };
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BoardPage({ params }: Props) {
    const slug = decodeURIComponent(params.slug || "")
        .replace(/^\/+/, "")
        .toLowerCase();

    const { data: board, error } = await supabase
        .from("boards")
        .select("id,name,slug,description,created_at")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Board load error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
                <p>
                    <Link href="/boards">Back to boards</Link>
                </p>
            </main>
        );
    }

    if (!board) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Board not found</h1>
                <p>Slug: {slug || "(empty)"}</p>
                <p>
                    <Link href="/boards">Back to boards</Link>
                </p>
            </main>
        );
    }

    return (
        <main style={{ padding: 24 }}>
            <p>
                <Link href="/boards">← Back</Link>
            </p>
            <h1>{board.name}</h1>
            <p style={{ opacity: 0.75 }}>{board.description || "No description."}</p>
            <p style={{ opacity: 0.6 }}>/{board.slug}</p>
        </main>
    );
}
