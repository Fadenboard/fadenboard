"use client";

import { useEffect, useMemo, useState } from "react";

type Board = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_pinned: boolean;
  created_at: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const slug = useMemo(() => slugify(name), [name]);

  async function loadBoards() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/boards", { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`GET /api/boards failed: ${res.status} ${txt}`);
      }
      const data = await res.json();
      setBoards(Array.isArray(data?.boards) ? data.boards : []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const payload = {
      name: name.trim(),
      slug,
      description: description.trim() || null,
    };

    if (!payload.name) return setErr("Board name is required.");
    if (!payload.slug) return setErr("Slug is required.");

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`POST /api/boards failed: ${res.status} ${txt}`);
      }

      setName("");
      setDescription("");
      await loadBoards();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create board");
    }
  }

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <main className="faden-shell">
      <section className="hero">
        <div className="flagbar" />
        <h1 className="h-title">Faden Boards</h1>
        <p className="h-sub">
          Create a board (a “Faden”), then jump in. Dark, fast, and built to scale.
        </p>

        <div className="badge-row">
          <span className="pill">🟥 Red intent</span>
          <span className="pill">⬜ Clean signal</span>
          <span className="pill">🟦 Blue clarity</span>
          <span className="pill">⭐ Starfield UI</span>
        </div>
      </section>

      <div style={{ height: 16 }} />

      <section className="grid">
        {/* Create */}
        <div className="card">
          <div className="card-inner">
            <h2 className="card-title">Create a board</h2>

            <form onSubmit={createBoard}>
              <div className="field">
                <div className="label">Name</div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Free Speech"
                />
              </div>

              <div className="field">
                <div className="label">Slug</div>
                <input className="input" value={slug} readOnly placeholder="free-speech" />
              </div>

              <div className="field">
                <div className="label">Description (optional)</div>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this board about?"
                />
              </div>

              <button className="btn btn-primary" type="submit">
                <span>🚩</span>
                <span>Create board</span>
              </button>
            </form>

            {err && <div className="error">{err}</div>}
            <div className="hr" />
            <div className="small">
              Tip: name automatically generates the slug. Keep it clean, keep it sharp.
            </div>
          </div>
        </div>

        {/* Boards */}
        <div className="card">
          <div className="card-inner">
            <div className="section-head">
              <h2 className="card-title" style={{ margin: 0 }}>Boards</h2>
              <button className="btn btn-ghost" onClick={loadBoards} type="button">
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <p className="small">Loading…</p>
            ) : boards.length === 0 ? (
              <p className="small">No boards yet. Make the first one.</p>
            ) : (
              <div className="boards">
                {boards.map((b) => (
                  <div className="board" key={b.id}>
                    <div className="board-top">
                      <div className="board-name">{b.name}</div>
                      <div className="board-slug">/b/{b.slug}</div>
                    </div>

                    {b.description && <div className="board-desc">{b.description}</div>}

                    <a className="link" href={`/b/${b.slug}`}>
                      Open board →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
