import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");

  // Prefer service role on server. Fallback to anon if you haven't set it yet.
  const key = serviceKey || anonKey;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, key, { auth: { persistSession: false } });
}

function getSlug(context: any): string {
  const p = context?.params;
  // Some setups type this as Promise<{slug:string}>
  if (p && typeof p?.then === "function") {
    throw new Error("Context params is a Promise at runtime. This should not happen; check route types.");
  }
  const slug = p?.slug;
  if (!slug || typeof slug !== "string") return "";
  return slug;
}

export async function GET(_req: NextRequest, context: any) {
  const supabase = supabaseServer();
  const slug = getSlug(context);

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) return NextResponse.json({ error: boardErr.message }, { status: 500 });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const { data: posts, error: postsErr } = await supabase
    .from("posts")
    .select("id, board_id, title, body, author, created_at")
    .eq("board_id", board.id)
    .order("created_at", { ascending: false });

  if (postsErr) return NextResponse.json({ error: postsErr.message }, { status: 500 });

  return NextResponse.json({ posts: posts ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest, context: any) {
  const supabase = supabaseServer();
  const slug = getSlug(context);

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  const title = String(payload?.title ?? "").trim();
  const body = payload?.body == null ? null : String(payload.body).trim();
  const author = payload?.author == null ? "anon" : String(payload.author).trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) return NextResponse.json({ error: boardErr.message }, { status: 500 });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const { data: post, error: insertErr } = await supabase
    .from("posts")
    .insert({
      board_id: board.id,
      title,
      body,
      author,
    })
    .select("id, board_id, title, body, author, created_at")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  return NextResponse.json({ post }, { status: 201 });
}