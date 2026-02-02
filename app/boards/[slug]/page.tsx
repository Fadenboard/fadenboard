// app/boards/[slug]/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Props = {
    // Next.js versions differ: sometimes params is sync, sometimes it's a Promise.
    params: { slug: string } | Promise<{ slug: string }>;
};

type Board = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeSlug(input: string) {
    return decodeURIComponent(input || "")
        .trim()
        .replace(/^\/+/, "") // remove leading slashes
        .toLowerCase();
}

export default async function BoardPage({ params }: Props) {
    const resolved = await Promise.resolve(params);
    const slug = normalizeSlug(resolved?.slug ?? "");

    // If slug is still empty, the route isn't being hit correctly.
    if (!slug) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Board not found</h1>
                <p>Slug: (empty)</p>
                <p style={{ opacity: 0.75 }}>
                    This usually means params.slug is not being received. Confirm the folder
                    path is <code>app/boards/[slug]/page.tsx</code>.
                </p>
                <p>
                    <Link href="/boards">Back to boards</Link>
                </p>
            </main>
        );
    }

    const { data: board, error } = await supabase
        .from("boards")
        .select("id,name,slug,description,created_at")
        .eq("slug", slug)
        .maybeSingle<Board>();

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Board load error</h1>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(error, null, 2)}
                </pre>
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
                <p>
                    Slug: <code>{slug}</code>
                </p>
                <p style={{ opacity: 0.75 }}>
                    If this slug should exist, check Supabase table <code>boards</code> and
                    confirm the row’s <code>slug</code> matches exactly (lowercase, no
                    leading slash).
                </p>
                <p>
                    <Link href="/boards">Back to boards</Link>
                </p>
            </main>
        );
    }

    return (
        <main style={{ padding: 24 }}>
            <p style={{ marginBottom: 12 }}>
                <Link href="/boards">← Back to boards</Link>
            </p>

            <h1 style={{ marginBottom: 6 }}>{board.name}</h1>

            <p style={{ opacity: 0.7, marginTop: 0 }}>
                /{board.slug}
            </p>

            {board.description ? (
                <p style={{ marginTop: 16 }}>{board.description}</p>
            ) : (
                <p style={{ marginTop: 16, opacity: 0.7 }}>No description.</p>
            )}

            <hr style={{ margin: "24px 0", opacity: 0.2 }} />

            <p style={{ opacity: 0.6, fontSize: 12 }}>
                Created: {new Date(board.created_at).toLocaleString()}
            </p>
        </main>
    );
}
