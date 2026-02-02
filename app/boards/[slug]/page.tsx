// app/boards/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // avoid stale caching while you're building
export const revalidate = 0;

type PageProps = {
    params: { slug: string };
};

function getSupabaseServer() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // IMPORTANT:
    // This page uses the ANON key. Your Supabase RLS must allow SELECT on public.boards.
    // Do NOT use the service role key in a page.
    if (!url || !anon) {
        throw new Error(
            "Missing env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
    }

    return createClient(url, anon, {
        auth: { persistSession: false },
    });
}

export default async function BoardSlugPage({ params }: PageProps) {
    const slug = decodeURIComponent(params.slug || "").trim();
    if (!slug) notFound();

    const supabase = getSupabaseServer();

    // Fetch the board by slug
    const { data: board, error } = await supabase
        .from("boards")
        .select("id, name, slug, description, created_at")
        .eq("slug", slug)
        .maybeSingle();

    // If RLS blocks you, you'll usually see an error here (or null data).
    if (error) {
        return (
            <main className="min-h-screen bg-neutral-950 text-neutral-100">
                <div className="mx-auto max-w-3xl px-6 py-10">
                    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                        <h1 className="text-xl font-semibold">Server error loading board</h1>
                        <p className="mt-2 text-sm text-neutral-300">
                            Supabase returned an error while querying <code className="text-neutral-100">boards</code>.
                        </p>
                        <pre className="mt-4 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-red-200">
                            {JSON.stringify(
                                {
                                    message: error.message,
                                    details: (error as any).details,
                                    hint: (error as any).hint,
                                    code: (error as any).code,
                                },
                                null,
                                2
                            )}
                        </pre>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href="/boards"
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                            >
                                Back to boards
                            </Link>
                            <Link
                                href="/"
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
                            >
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!board) notFound();

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100">
            <header className="border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
                    <Link href="/boards" className="text-sm text-neutral-300 hover:text-white">
                        ← All boards
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/boards"
                            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                        >
                            Browse
                        </Link>
                        <Link
                            href="/boards/create"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
                        >
                            Create board
                        </Link>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-6 py-10">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
                            <p className="mt-2 text-sm text-neutral-300">
                                <span className="text-neutral-400">Slug:</span>{" "}
                                <code className="rounded bg-black/40 px-2 py-1 text-neutral-100">
                                    {board.slug}
                                </code>
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-neutral-300">
                                Created{" "}
                                {board.created_at
                                    ? new Date(board.created_at).toLocaleString()
                                    : "unknown"}
                            </span>
                            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-neutral-300">
                                Board ID{" "}
                                <span className="text-neutral-100">{board.id}</span>
                            </span>
                        </div>
                    </div>

                    {board.description ? (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-200">
                                {board.description}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-neutral-400">
                                No description yet. Add one when you build the edit screen.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm font-semibold">Threads</h2>
                            <p className="mt-2 text-sm text-neutral-400">
                                Hook this up next: show threads for this board.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm font-semibold">Posting</h2>
                            <p className="mt-2 text-sm text-neutral-400">
                                Next step: a “Create Thread” button and form.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm font-semibold">Moderation</h2>
                            <p className="mt-2 text-sm text-neutral-400">
                                Later: rules, report flow, filters, and admin controls.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/boards"
                            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                        >
                            Back to boards
                        </Link>
                        <Link
                            href={`/boards/${encodeURIComponent(board.slug)}`}
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
                        >
                            Refresh page
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10">
                <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-neutral-500">
                    Fadenboard • Built with Next.js + Supabase
                </div>
            </footer>
        </main>
    );
}
