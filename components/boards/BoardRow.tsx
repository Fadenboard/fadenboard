type Board = {
    name: string;
    slug: string;
    description?: string | null;
};

export default function BoardRow({ board }: { board: Board }) {
    return (
        <a
            href={`/boards/${board.slug}`}
            className={[
                "group block rounded-xl border border-white/10 bg-black/40 px-4 py-3",
                "transition hover:bg-white/[0.06] hover:border-white/20",
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{board.name}</div>
                    <div className="truncate text-xs text-white/50">/{board.slug}</div>
                </div>

                <div className="text-xs text-white/50 transition group-hover:text-white/70">
                    Open →
                </div>
            </div>

            {board.description && (
                <div className="mt-2 line-clamp-2 text-sm text-white/60">
                    {board.description}
                </div>
            )}
        </a>
    );
}
