"use client";

import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import BoardRow from "@/components/boards/BoardRow";

type Board = {
  id?: string | number;
  name: string;
  slug: string;
  description?: string | null;
};

export default function BoardListCard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/boards", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load");
      }
      const data = await res.json();
      setBoards(Array.isArray(data) ? data : data?.boards ?? []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener("boards:refresh", on);
    return () => window.removeEventListener("boards:refresh", on);
  }, []);

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Boards</h2>
        <button
          onClick={load}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.08]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4">
        {loading && (
          <div className="space-y-2">
            <div className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
            <div className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
            <div className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
          </div>
        )}

        {!loading && err && (
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
            {err}
          </div>
        )}

        {!loading && !err && boards.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
            No boards yet. Create the first one.
          </div>
        )}

        {!loading && !err && boards.length > 0 && (
          <div className="space-y-2">
            {boards.map((b) => (
              <BoardRow key={b.slug} board={b} />
            ))}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
