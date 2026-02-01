"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateBoardPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const suggestedSlug = useMemo(() => slugify(name), [name]);
  const finalSlug = slug.trim() ? slugify(slug) : suggestedSlug;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const boardSlug = finalSlug;

    if (!name.trim()) return setError("Board name is required.");
    if (!boardSlug) return setError("Slug is required.");
    if (boardSlug.length < 2) return setError("Slug is too short.");
    if (boardSlug.length > 40) return setError("Slug is too long (max 40).");

    setSubmitting(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: boardSlug,
          description: description.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || `Create failed (${res.status}).`);
        return;
      }

      const createdSlug = data?.board?.slug || data?.slug || boardSlug;
      router.push(`/b/${createdSlug}`);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={styles.bg}>
      {/* Top strip like reddit-ish */}
      <header style={styles.topbar}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandLogo} aria-hidden="true">
            🇺🇸
          </span>
          <span style={styles.brandText}>Faden</span>
        </Link>

        <div style={styles.topRight}>
          <Link href="/" style={styles.topLink}>
            Home
          </Link>
        </div>
      </header>

      {/* Center card */}
      <div style={styles.wrap}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleRow}>
              <h1 style={styles.h1}>Create a Board</h1>
              <span style={styles.pillPreview}>/b/{finalSlug || "your-slug"}</span>
            </div>
            <p style={styles.sub}>
              Simple and fast. Name it, claim the URL, describe it in one sentence.
            </p>
          </div>

          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>
              Board name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: Free Speech"
                style={styles.input}
                maxLength={60}
                autoFocus
              />
            </label>

            <label style={styles.label}>
              Slug (URL)
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={suggestedSlug || "example-slug"}
                style={styles.input}
                maxLength={40}
              />
              <div style={styles.hint}>
                Tip: use lowercase and dashes. No spaces.
              </div>
            </label>

            <label style={styles.label}>
              Description (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What belongs in this board?"
                style={styles.textarea}
                maxLength={240}
              />
            </label>

            {error ? <div style={styles.errorBox}>{error}</div> : null}

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryBtn} disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </button>
              <Link href="/" style={styles.secondaryBtn}>
                Cancel
              </Link>
            </div>

            <div style={styles.rules}>
              <strong>Rules:</strong> debate hard, no harassment, no threats, no doxxing.
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // Red/Blue split background (contrast)
  bg: {
    minHeight: "100vh",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.95) 0%, rgba(185,28,28,0.95) 50%, rgba(20,64,158,0.95) 50%, rgba(20,64,158,0.95) 100%)",
    color: "#0b1220",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  // Topbar
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.92)",
    borderBottom: "1px solid rgba(0,0,0,0.10)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 900,
  },
  brandLogo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(0,0,0,0.10)",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.30), rgba(255,255,255,0.70), rgba(20,64,158,0.30))",
  },
  brandText: { letterSpacing: 0.2 },
  topRight: { display: "flex", gap: 10, alignItems: "center" },
  topLink: {
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 800,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.85)",
  },

  // Center
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "26px 14px 44px",
  },

  // Card (white like reddit)
  card: {
    borderRadius: 16,
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(0,0,0,0.12)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },

  cardHeader: {
    padding: 16,
    borderBottom: "1px solid rgba(0,0,0,0.10)",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.08) 0%, rgba(255,255,255,0.0) 50%, rgba(20,64,158,0.08) 100%)",
  },

  cardTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  h1: { margin: 0, fontSize: 22, letterSpacing: 0.2 },
  sub: { margin: "6px 0 0", opacity: 0.75, lineHeight: 1.35 },

  pillPreview: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.18) 0%, rgba(255,255,255,0.6) 50%, rgba(20,64,158,0.18) 100%)",
    whiteSpace: "nowrap",
  },

  form: { display: "grid", gap: 12, padding: 16 },
  label: { display: "grid", gap: 8, fontWeight: 800 },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.95)",
    color: "#0b1220",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: 110,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.95)",
    color: "#0b1220",
    outline: "none",
    resize: "vertical",
  },

  hint: { fontWeight: 700, opacity: 0.65, fontSize: 12 },

  errorBox: {
    padding: 12,
    borderRadius: 12,
    background: "rgba(185, 28, 28, 0.12)",
    border: "1px solid rgba(185, 28, 28, 0.30)",
    color: "#7f1d1d",
    fontWeight: 800,
  },

  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 2 },

  primaryBtn: {
    appearance: "none",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 900,
    color: "#ffffff",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.95) 0%, rgba(20,64,158,0.95) 100%)",
  },

  secondaryBtn: {
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 900,
    color: "#0b1220",
    background: "rgba(255,255,255,0.85)",
  },

  rules: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    background: "rgba(20, 64, 158, 0.08)",
    border: "1px solid rgba(20, 64, 158, 0.18)",
    fontWeight: 700,
    opacity: 0.9,
    fontSize: 12,
    lineHeight: 1.35,
  },
};
