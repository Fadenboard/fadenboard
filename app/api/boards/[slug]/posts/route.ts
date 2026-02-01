import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { slug } = context.params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing board slug" },
      { status: 400 }
    );
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, board_id, title, body, author, created_at")
    .eq("board_slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ posts });
}
