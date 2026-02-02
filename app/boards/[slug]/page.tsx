import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
    params: { slug: string };
};

export default async function BoardPage({ params }: Props) {
    const slug = params.slug.toLowerCase();

    const { data: board, error } = await supabase
        .from("boards")
        .select("id, name, slug, description, created_at")
        .eq("slug", slug)
        .single();

    if (error || !board) {
        return (
            <main style={{ padding: 40, color: "white" }}>
                <h1>Board not found</h1>
                <p>Slug: {slug}</p>
                <p>
                    If this slug should exist, check the <code>boards</code> table and
                    confirm the slug matches exactly.
                </p>
                <Link href="/boards">Back to boards</Link>
            </main>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: 40,
                color: "white",
                background:
                    "radial-gradient(800px 400px at 50% 20%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #05070e, #02030a)",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <Link href="/boards" style={{ opacity: 0.7 }}>
                    ← Back to boards
                </Link>

                <h1 style={{ marginTop: 20, fontSize: 42 }}>{board.name}</h1>

                {board.description && (
                    <p style={{ opacity: 0.8, marginTop: 12, lineHeight: 1.6 }}>
                        {board.description}
                    </p>
                )}

                <div style={{ marginTop: 30, opacity: 0.5, fontSize: 12 }}>
                    Created {new Date(board.created_at).toLocaleString()}
                </div>
            </div>
        </main>
    );
}
