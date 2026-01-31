import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
 const { name, description } = await req.json();

 if (!name) {
   return NextResponse.json(
     { error: "Board name required" },
     { status: 400 }
   );
 }

 const slug = name
   .toLowerCase()
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/(^-|-$)/g, "");

 const {
   data: { user },
 } = await supabase.auth.getUser();

 if (!user) {
   return NextResponse.json(
     { error: "Not authenticated" },
     { status: 401 }
   );
 }

 const { error } = await supabase.from("boards").insert({
   name,
   slug,
   description,
   created_by: user.id,
 });

 if (error) {
   return NextResponse.json({ error: error.message }, { status: 500 });
 }

 return NextResponse.json({ success: true });
}