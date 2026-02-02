export const dynamic = "force-dynamic";

async function getBoard(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/boards/${slug}`, {
        cache: "no-store",
    });

    // If NEXT_PUBLIC_SITE_URL is not set, fallback to relative fetch (works on Vercel too)
    if (!res.ok) {
        const res2 = await fetch(`/api/boards/${slug}`, { cache: "no-store" });
        if (!res2.ok) return null;
        const j2 = await res2.json();
        return j2.board ?? null;
    }

    const j = await res.json();
    return j.board ?? null;
}

export default async function BoardPage({ params }: { params: { slug: string } }) {
    const board = await getBoard(params.slug);

    if (!board) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Board not found</h1>
                <p>Slug: {params.slug}</p>
            </main>
        );
    }

    return (
        <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>{board.name}</h1>
            <p style={{ opacity: 0.7, marginBottom: 18 }}>/boards/{board.slug}</p>

            {board.description ? (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {board.description}
                </div>
            ) : (
                <p style={{ opacity: 0.8 }}>No description yet.</p>
            )}
        </main>
    );
}
