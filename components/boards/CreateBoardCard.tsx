"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function CreateBoardCard() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const autoSlug = useMemo(() => slugify(name), [name]);

  async function onCreate() {
    setMsg(null);

    const finalSlug = slugify(slug || autoSlug);
    if (!name.trim()) return setMsg("Name is required.");
    if (!finalSlug) return setMsg("Slug is required.");

    setBusy(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim() || null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      setName("");
      setSlug("");
      setDescription("");
      setMsg("Created. ✅");

      // tell BoardListCard to refresh
      window.dispatchEvent(new Event("boards:refresh"));
    } catch (e: any) {
      setMsg(e?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create a board</h2>
        <span className="text-[11px] tracking-[0.18em] text-white/45">
          COMMAND • CREATE
        </span>
      </div>

      <p className="mt-2 text-sm text-white/60">
        Name your space. Keep it sharp. Your slug becomes the URL.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <div className="mb-1 text-[11px] tracking-[0.18em] text-white/50">
            NAME
          </div>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/25"
            placeholder="Free Speech"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="mb-1 flex items-center justify-between text-[11px] tracking-[0.18em] text-white/50">
            <span>SLUG</span>
            <span className="text-white/35">auto: {autoSlug || "…"}</span>
          </div>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/25"
            placeholder="free-speech"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-[11px] tracking-[0.18em] text-white/50">
            DESCRIPTION
          </div>
          <textarea
            className="min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/25"
            placeholder="What is this board about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button
          onClick={onCreate}
          disabled={busy}
          className={[
            "w-full rounded-xl border border-white/10 bg-white text-black",
            "py-3 font-semibold tracking-wide transition",
            "hover:bg-white/90 active:scale-[0.99] disabled:opacity-50",
          ].join(" ")}
        >
          {busy ? "Creating…" : "Create board"}
        </button>

        {msg && <div className="text-sm text-white/70">{msg}</div>}
      </div>
    </GlassPanel>
  );
}
