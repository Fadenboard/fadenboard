import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      return NextResponse.json(
        { ok: false, error: "Missing SUPABASE env vars" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, anon);

    const { data, error } = await supabase
      .from("boards")
      .select("id,name,slug,description,created_at")
      .eq("slug", params.slug)
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, board: data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
