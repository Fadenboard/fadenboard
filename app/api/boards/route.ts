import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If this returns 500 with "Missing env", Vercel isn't injecting your env vars
  if (!url) {
    return NextResponse.json(
      { error: "Missing env: NEXT_PUBLIC_SUPABASE_URL" },
      { status: 500 }
    );
  }
  if (!serviceKey) {
    return NextResponse.json(
      { error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("boards")
    .select("id,name,slug,description,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    usedServiceRole: true,
    count: data?.length ?? 0,
    boards: data ?? [],
  });
}
