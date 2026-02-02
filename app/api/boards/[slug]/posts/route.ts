import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = ctx.params;

  // 1) Find the board by slug
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (boardError || !board) {
    return NextResponse.json(
      { ok: false, error: boardError?.message ?? "Board not found" },
      { status: 404 }
    );
  }

  // 2) Fetch posts for that board
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("board_id", board.id)
    .order("created_at", { ascending: false });

  if (postsError) {
    return NextResponse.json(
      { ok: false, error: postsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, board, posts: posts ?? [] });
}
