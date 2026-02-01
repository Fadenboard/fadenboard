import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnon);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const board = searchParams.get("board");

  if (!board) {
    return NextResponse.json({ error: "Missing ?board=slug" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("board_slug", board)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ threads: data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const board_slug = body?.board_slug;
  const title = body?.title;
  const postBody = body?.body ?? null;

  if (!board_slug || typeof board_slug !== "string") {
    return NextResponse.json({ error: "board_slug required" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("threads")
    .insert([{ board_slug, title, body: postBody }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ thread: data }, { status: 201 });
}
