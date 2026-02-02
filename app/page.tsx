"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";

type Board = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_pinned?: boolean;
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
      const list = Array.isArray(data?.boards) ? data.boards : [];
      setBoards(list);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load boards");
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!name.trim()) {
      setErr("Board name is required.");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug,
          description: description.trim() ? description.trim() : null,
        }),
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
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 18px",
        color: "white",
        background:
          "radial-gradient(1200px 600px at 25% 20%, rgba(120,0,0,0.35), transparent 60%), radial-gradient(1200px 600px at 75% 20%, rgba(0,60,255,0.20), transparent 60%), radial-gradient(900px 500px at 50% 70%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(180deg, #06080f, #02040a)",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.65 }}>
            FADEN BOARDS
          </div>
          <h1 style={{ fontSize: 44, margin: "10px 0 10px" }}>Boards</h1>
          <p style={{ opacity: 0.75, maxWidth: 720, lineHeight: 1.5 }}>
            Create a board, share ideas, and jump in.
          </p>
        </div>

        {err && (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,0,0,0.10)",
              padding: 12,
              borderRadius: 10,
              marginBottom: 16,
              whiteSpace: "pre-wrap",
            }}
          >
            {err}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          {/* CREATE */}
          <section
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 14,
              padding: 18,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Create a board</h2>
              <div style={{ opacity: 0.55, fontSize: 12, letterSpacing: 1 }}>
                COMMAND · CREATE
              </div>
            </div>

            <p style={{ marginTop: 10, opacity: 0.75, lineHeight: 1.5 }}>
              Name your space. Your slug becomes the URL.
            </p>

            <form onSubmit={createBoard} style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 12, opacity: 0.75 }}>
                NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Board"
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  outline: "none",
                }}
              />

              <div style={{ height: 12 }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ display: "block", fontSize: 12, opacity: 0.75 }}>
                  SLUG
                </label>
                <div style={{ fontSize: 12, opacity: 0.55 }}>auto</div>
              </div>

              <input
                value={slug}
                readOnly
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.25)",
                  color: "rgba(255,255,255,0.85)",
                  outline: "none",
                }}
              />

              <div style={{ height: 12 }} />

              <label style={{ display: "block", fontSize: 12, opacity: 0.75 }}>
                DESCRIPTION
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this board about?"
                rows={5}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  outline: "none",
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "white",
                  color: "black",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create board
              </button>
            </form>
          </section>

          {/* LIST */}
          <section
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 14,
              padding: 18,
              backdropFilter: "blur(10px)",
              minHeight: 320,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Boards</h2>
              <button
                onClick={loadBoards}
                style={{
                  padding: "8px 10px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.25)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              {loading ? (
                <p style={{ opacity: 0.7 }}>Loading…</p>
              ) : boards.length === 0 ? (
                <p style={{ opacity: 0.7 }}>No boards found.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {boards.map((b) => (
                    <li
                      key={b.id}
                      style={{
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(0,0,0,0.22)",
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800 }}>{b.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>
                            /{b.slug}
                          </div>
                        </div>

                        <a
                          href={`/boards/${b.slug}`}
                          style={{
                            color: "white",
                            opacity: 0.9,
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          Open →
                        </a>
                      </div>

                      {b.description ? (
                        <p style={{ margin: "10px 0 0", opacity: 0.75 }}>
                          {b.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div style={{ marginTop: 18, opacity: 0.55, fontSize: 12 }}>
          Tip: your board URL is <b>/boards/&lt;slug&gt;</b>
        </div>
      </div>
    </main>
  );
}
