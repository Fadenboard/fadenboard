import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Prefer service role if present, fallback to anon so build doesn't explode
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: "Missing board slug" }, { status: 400 });
  }

  // Find the board id by slug
  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Get posts for that board_id
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

export async function POST(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: "Missing board slug" }, { status: 400 });
  }

  const payload = await req.json().catch(() => ({}));

  const title = String(payload?.title ?? "").trim();
  const body = payload?.body == null ? null : String(payload.body).trim();
  const author = payload?.author == null ? "anon" : String(payload.author).trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (boardErr) {
    return NextResponse.json({ error: boardErr.message }, { status: 500 });
  }
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

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

}
