// app/boards/[slug]/page.tsx

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
    params: {
        slug: string;
    };
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BoardPage({ params }: PageProps) {
    const { slug } = params;

    if (!slug) {
        notFound();
    }

    const { data: board, error } = await supabase
        .from("boards")
        .select("id, name, description, created_at, slug")
        .eq("slug", slug)
        .single();

    if (error || !board) {
        notFound();
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
                {board.name}
            </h1>

            {board.description && (
                <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
                    {board.description}
                </p>
            )}

            <p style={{ marginTop: "2rem", opacity: 0.6 }}>
                Created: {new Date(board.created_at).toLocaleString()}
            </p>
        </main>
    );
}
