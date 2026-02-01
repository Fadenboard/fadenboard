"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function NewThreadPage() {
  const params = useParams();
  const router = useRouter();
  const slug = useMemo(() => (params?.slug as string) || "", [params]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_slug: slug, title, body }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Failed to create thread");

      router.push(`/b/${slug}`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.wrap}>
        <div style={styles.topbar}>
          <Link href={`/b/${slug}`} style={styles.back}>
            ← Back to /b/{slug || "..."}
          </Link>
          <Link href="/" style={styles.home}>
            Home
          </Link>
        </div>

        <div style={styles.card}>
          <h1 style={styles.h1}>New thread</h1>
          <p style={styles.sub}>Posting in <b>/b/{slug || "..."}</b></p>

          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a clear title…"
              style={styles.input}
              maxLength={120}
              required
            />

            <label style={styles.label}>Body (optional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Say your piece…"
              style={styles.textarea}
              rows={7}
            />

            {err && <div style={styles.err}>{err}</div>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Posting…" : "Post thread"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    padding: 24,
    color: "#f3f4f6",
    fontFamily: "system-ui",
    background:
      "linear-gradient(135deg, rgba(185,28,28,0.95) 0%, rgba(11,18,32,1) 45%, rgba(20,64,158,0.95) 100%)",
  },
  wrap: { maxWidth: 860, margin: "0 auto" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  back: { color: "#f3f4f6", textDecoration: "none", opacity: 0.9 },
  home: { color: "#f3f4f6", textDecoration: "none", opacity: 0.75 },

  card: {
    borderRadius: 16,
    padding: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
  },
  h1: { margin: 0, fontSize: 30 },
  sub: { marginTop: 8, opacity: 0.85 },

  form: { marginTop: 14, display: "grid", gap: 10 },
  label: { fontWeight: 800, opacity: 0.9 },
  input: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(11,18,32,0.6)",
    color: "#f3f4f6",
    outline: "none",
    fontSize: 15,
  },
  textarea: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(11,18,32,0.6)",
    color: "#f3f4f6",
    outline: "none",
    fontSize: 15,
    resize: "vertical",
  },
  err: {
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.12)",
  },
  btn: {
    marginTop: 8,
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.18)",
    fontWeight: 900,
    cursor: "pointer",
    color: "#0b1220",
    background: "rgba(255,255,255,0.92)",
  },
};
