import { NextResponse } from "next/server";

/**
 * TEMP in-memory store (safe for dev).
 * If you're using Supabase or DB already,
 * replace this with your DB calls.
 */
let BOARDS: {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
}[] = [];

/**
 * GET /api/boards
 * Returns all boards
 */
export async function GET() {
  return NextResponse.json({
    boards: BOARDS,
  });
}

/**
 * POST /api/boards
 * Body: { name, slug, description? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description } = body ?? {};

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Prevent duplicates
    const exists = BOARDS.find((b) => b.slug === slug);
    if (exists) {
      return NextResponse.json(
        { error: "Board with this slug already exists" },
        { status: 409 }
      );
    }

    const board = {
      id: crypto.randomUUID(),
      name: String(name),
      slug: String(slug),
      description: description ? String(description) : null,
      created_at: new Date().toISOString(),
    };

    BOARDS.unshift(board);

    return NextResponse.json(board, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON or server error" },
      { status: 500 }
    );
  }
}
