"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Board = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
};

type Thread = {
  id: string;
  board_slug: string;
  title: string;
  body?: string | null;
  created_at?: string;
};

export default function BoardPage() {
  const params = useParams();
  const slug = useMemo(() => (params?.slug as string) || "", [params]);

  const [board, setBoard] = useState<Board | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch board
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function run() {
      setLoadingBoard(true);
      setErr(null);

      try {
        const res = await fetch(`/api/boards?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Board not found");

        if (!cancelled) setBoard(json.board);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load board");
      } finally {
        if (!cancelled) setLoadingBoard(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Fetch threads
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function run() {
      setLoadingThreads(true);

      try {
        const res = await fetch(`/api/threads?board=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load threads");

        if (!cancelled) setThreads(json.threads || []);
      } catch {
        if (!cancelled) setThreads([]);
      } finally {
        if (!cancelled) setLoadingThreads(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <main style={styles.main}>
      <div style={styles.wrap}>
        <div style={styles.topbar}>
          <Link href="/" style={styles.back}>
            ← Home
          </Link>

          <div style={styles.actions}>
            <Link href="/create" style={styles.createBoardBtn}>
              + Create a board
            </Link>
          </div>
        </div>

        <header style={styles.hero}>
          <div style={styles.kicker}>FADEN BOARD</div>
          <h1 style={styles.h1}>/b/{slug || "..."}</h1>
          <p style={styles.tagline}>A place to speak freely, argue hard, and keep it civil.</p>
        </header>

        <section style={styles.card}>
          {loadingBoard && <div style={styles.muted}>Loading board…</div>}

          {!loadingBoard && err && (
            <div style={styles.error}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Not found</div>
              <div style={{ marginTop: 6, opacity: 0.9 }}>{err}</div>
              <div style={{ marginTop: 10 }}>
                <Link href="/" style={styles.link}>
                  Go back home
                </Link>
              </div>
            </div>
          )}

          {!loadingBoard && !err && board && (
            <>
              <div style={styles.boardRow}>
                <div>
                  <div style={styles.boardName}>{board.name}</div>
                  <div style={styles.boardMeta}>
                    /b/{board.slug}
                    {board.created_at ? <span style={styles.dot}>•</span> : null}
                    {board.created_at ? (
                      <span style={styles.muted}>
                        {new Date(board.created_at).toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </div>

                <Link href={`/b/${slug}/new`} style={styles.primaryBtn}>
                  + New thread
                </Link>
              </div>

              {board.description ? (
                <p style={styles.desc}>{board.description}</p>
              ) : (
                <p style={styles.muted}>No description yet.</p>
              )}

              <div style={styles.hr} />

              <div style={styles.sectionTitle}>Threads</div>

              {loadingThreads ? (
                <div style={styles.muted}>Loading threads…</div>
              ) : threads.length === 0 ? (
                <div style={styles.muted}>No threads yet. Be the first to post.</div>
              ) : (
                <div style={styles.threadList}>
                  {threads.map((t) => (
                    <div key={t.id} style={styles.threadRow}>
                      <div style={styles.threadTitle}>{t.title}</div>
                      <div style={styles.threadMeta}>
                        {t.created_at ? new Date(t.created_at).toLocaleString() : ""}
                      </div>
                      {t.body ? <div style={styles.threadBody}>{t.body}</div> : null}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#f3f4f6",
    padding: 24,
    fontFamily: "system-ui",
  },
  wrap: { maxWidth: 980, margin: "0 auto" },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  back: { color: "#f3f4f6", textDecoration: "none", opacity: 0.85 },
  actions: { display: "flex", gap: 10, alignItems: "center" },

  createBoardBtn: {
    textDecoration: "none",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#0b1220",
    background: "rgba(255,255,255,0.92)",
  },

  hero: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  kicker: { fontSize: 12, letterSpacing: 1.2, opacity: 0.8, textTransform: "uppercase" },
  h1: { margin: "8px 0 6px", fontSize: 40 },
  tagline: { margin: 0, opacity: 0.8 },

  card: {
    padding: 18,
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  boardRow: { display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" },
  boardName: { fontSize: 20, fontWeight: 900, textTransform: "lowercase" },
  boardMeta: { opacity: 0.85, fontSize: 13, marginTop: 4 },
  dot: { margin: "0 8px", opacity: 0.6 },

  desc: { marginTop: 12, opacity: 0.9, lineHeight: 1.45 },
  hr: { height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" },

  sectionTitle: { fontWeight: 900, marginBottom: 8 },

  muted: { opacity: 0.75 },

  primaryBtn: {
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    color: "#f3f4f6",
    background: "linear-gradient(90deg, rgba(185,28,28,0.95), rgba(20,64,158,0.95))",
  },

  threadList: { display: "grid", gap: 10 },

  threadRow: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  threadTitle: { fontWeight: 900, fontSize: 16 },
  threadMeta: { opacity: 0.7, fontSize: 12, marginTop: 4 },
  threadBody: { marginTop: 8, opacity: 0.9, lineHeight: 1.4 },

  error: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.08)",
  },
  link: { color: "#f3f4f6" },
};
