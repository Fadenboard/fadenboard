import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: this matches what Next 16 expects in your build logs:
// context.params is a Promise.
type RouteContext = {
  params: Promise<{ slug: string }>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getBoardIdBySlug(slug: string) {
  const { data, error } = await supabase
    .from("boards")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Missing board slug" }, { status: 400 });
    }

    const boardId = await getBoardIdBySlug(slug);
    if (!boardId) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, board_id, title, body, author, created_at")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: posts ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Missing board slug" }, { status: 400 });
    }

    const bodyJson = await req.json().catch(() => ({} as any));
    const title = String(bodyJson?.title ?? "").trim();
    const body = bodyJson?.body == null ? null : String(bodyJson.body).trim();
    const author =
      bodyJson?.author == null ? "anon" : String(bodyJson.author).trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const boardId = await getBoardIdBySlug(slug);
    if (!boardId) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({ board_id: boardId, title, body, author })
      .select("id, board_id, title, body, author, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
