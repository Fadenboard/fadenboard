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
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Faden Boards</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Make a new board (a “Faden”), then jump in.
      </p>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 16,
          borderRadius: 12,
          marginTop: 18,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Create a board</h2>

        <form onSubmit={createBoard} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Free Speech"
              style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Slug</span>
            <input
              value={slug}
              readOnly
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.18)",
                opacity: 0.85,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Description (optional)</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board about?"
              style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)" }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Create board
          </button>
        </form>

        {err && (
          <p style={{ marginTop: 12, color: "#ff6b6b", whiteSpace: "pre-wrap" }}>
            {err}
          </p>
        )}
      </section>

      <section style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Boards</h2>
          <button
            onClick={loadBoards}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ opacity: 0.85 }}>Loading…</p>
        ) : boards.length === 0 ? (
          <p style={{ opacity: 0.85 }}>No boards yet. Make the first one.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12, display: "grid", gap: 10 }}>
            {boards.map((b) => (
              <li
                key={b.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 14,
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong style={{ fontSize: 18 }}>{b.name}</strong>
                  <span style={{ opacity: 0.7 }}>/b/{b.slug}</span>
                </div>
                {b.description && <div style={{ opacity: 0.85 }}>{b.description}</div>}
                <a
                  href={`/b/${b.slug}`}
                  style={{ textDecoration: "underline", opacity: 0.95, width: "fit-content" }}
                >
                  Open board
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
