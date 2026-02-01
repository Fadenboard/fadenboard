import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = sb();

  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id")
    .eq("slug", params.slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id,title,body,author,created_at,board_id")
    .eq("board_id", board.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts ?? [] }, { status: 200 });
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = sb();
  const payload = await req.json();

  const title = String(payload?.title ?? "").trim();
  const body = payload?.body == null ? null : String(payload.body).trim();
  const author = payload?.author == null ? "anon" : String(payload.author).trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id")
    .eq("slug", params.slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      board_id: board.id,
      title,
      body,
      author,
    })
    .select("id,title,body,author,created_at,board_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}
