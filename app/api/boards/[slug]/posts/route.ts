import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  // Prefer service role on the server. Fallback to anon if you haven't added it yet.
  const key = serviceKey || anonKey;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, key, { auth: { persistSession: false } });
}

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const supabase = supabaseAdmin();
  const slug = params.slug;

  // Find board by slug
  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Load posts for that board
  const { data: posts, error: postsErr } = await supabase
    .from("posts")
    .select("id, board_id, title, body, author, created_at")
    .eq("board_id", board.id)
    .order("created_at", { ascending: false });

  if (postsErr) {
    return NextResponse.json({ error: postsErr.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts ?? [] }, { status: 200 });
}

export async function POST(req: Request, { params }: Ctx) {
  const supabase = supabaseAdmin();
  const slug = params.slug;

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

  // Find board by slug
  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Insert post
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

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}

