// app/page.tsx
import Link from "next/link";

type Board = {
  id?: string | number;
  name?: string;
  title?: string;
  slug: string;
  description?: string | null;
  created_at?: string;
};

async function getBoards(): Promise<Board[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/boards`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to load boards: ${res.status}`);

  const data = await res.json();
  const boards: Board[] = Array.isArray(data) ? data : Array.isArray(data?.boards) ? data.boards : [];
  return boards.filter((b) => typeof b?.slug === "string" && b.slug.length > 0);
}

export default async function HomePage() {
  let boards: Board[] = [];
  let errorMsg = "";

  try {
    boards = await getBoards();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Failed to load boards.";
  }

  return (
    <main style={styles.main}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroTopRow}>
          <FlagMark />
          <div>
            <h1 style={styles.heroTitle}>Faden Boards</h1>
            <p style={styles.heroSubtitle}>
              A patriotic town square: strong borders, strong rights, and strong opinions.
            </p>
          </div>
        </div>

        <div style={styles.heroBanner}>
          <div style={styles.heroBannerInner}>
            <div style={styles.heroBadge}>🇺🇸 liberty-first discourse</div>
            <h2 style={styles.heroH2}>A Declaration of Principles</h2>
            <p style={styles.heroCopy}>
              We believe in freedom of speech that actually means something.<br />
              We believe the Constitution is not a suggestion, and the Second Amendment is not a hobby.<br />
              We believe nations have borders, laws should be enforced, and sovereignty is not “controversial.”<br />
              Bring facts, receipts, and backbone. Debate hard. Don’t harass people. No calls for violence.
            </p>

            <div style={styles.heroCtas}>
              <Link href="/create" style={styles.primaryBtn}>
                Create a board
              </Link>
              <a href="#boards" style={styles.secondaryBtn}>
                Browse boards ↓
              </a>
            </div>
          </div>
        </div>

        {/* PRINCIPLES */}
        <div style={styles.grid3}>
          <div style={styles.principleCard}>
            <div style={styles.principleTitle}>🗽 Free Speech, For Real</div>
            <div style={styles.principleText}>
              No fragile bubble-wrap politics. Argue the point, cite sources, keep it civil.
            </div>
          </div>

          <div style={styles.principleCard}>
            <div style={styles.principleTitle}>🛡️ Border & Law Enforcement</div>
            <div style={styles.principleText}>
              We support enforcement that protects citizens, secures communities, and respects due process.
            </div>
          </div>

          <div style={styles.principleCard}>
            <div style={styles.principleTitle}>🔫 Second Amendment</div>
            <div style={styles.principleText}>
              Rights are rights. Responsible ownership, self-defense, and zero shame about it.
            </div>
          </div>
        </div>

        {/* EXTRA ROW */}
        <div style={styles.grid2}>
          <div style={styles.principleCard}>
            <div style={styles.principleTitle}>🏛️ America-First Priorities</div>
            <div style={styles.principleText}>
              Energy independence, secure borders, strong families, and a working economy.
            </div>
          </div>

          <div style={styles.principleCard}>
            <div style={styles.principleTitle}>⚖️ Rules: Debate, Not Abuse</div>
            <div style={styles.principleText}>
              No harassment, doxxing, threats, or dehumanizing slurs. Hit ideas with arguments, not people.
            </div>
          </div>
        </div>
      </section>

      {/* BOARDS */}
      <section id="boards" style={styles.card}>
        <div style={styles.cardTop}>
          <h2 style={styles.h2}>Boards</h2>
          <Link href="/create" style={styles.createBtn}>
            + Create
          </Link>
        </div>

        {errorMsg ? (
          <div style={styles.noticeBad}>
            <strong>Could not load boards.</strong>
            <div style={{ marginTop: 6, opacity: 0.9 }}>{errorMsg}</div>
          </div>
        ) : boards.length === 0 ? (
          <div style={styles.notice}>
            No boards yet. Hit <strong>Create</strong> to start the first one.
          </div>
        ) : (
          <ul style={styles.list}>
            {boards.map((b) => {
              const label = (b.name || b.title || b.slug).toString();
              return (
                <li key={b.id ?? b.slug} style={styles.listItem}>
                  <Link href={`/b/${b.slug}`} style={styles.boardLink}>
                    <div style={styles.boardTitleRow}>
                      <span style={styles.boardTitle}>{label}</span>
                      <span style={styles.slugPill}>/b/{b.slug}</span>
                    </div>
                    {b.description ? <p style={styles.desc}>{b.description}</p> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          🇺🇸 Speak freely. Stay lawful. Build something worth defending.
        </div>
      </footer>
    </main>
  );
}

function FlagMark() {
  return (
    <div style={styles.flagMark} aria-hidden="true">
      <div style={styles.blueBox}>
        <div style={styles.stars}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={styles.star}>
              ★
            </span>
          ))}
        </div>
      </div>
      <div style={styles.stripes}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={i % 2 === 0 ? styles.redStripe : styles.whiteStripe} />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    padding: "20px 16px 40px",
    background:
      "radial-gradient(900px 520px at 50% -120px, rgba(20, 64, 158, 0.22), transparent 60%), linear-gradient(180deg, #0b1220 0%, #070b12 100%)",
    color: "#f3f4f6",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  // HERO
  hero: { maxWidth: 980, margin: "0 auto 18px", padding: "10px 0 0" },
  heroTopRow: { display: "flex", alignItems: "center", gap: 14, padding: "10px 10px 12px" },
  heroTitle: { margin: 0, fontSize: 40, letterSpacing: 0.2 },
  heroSubtitle: { margin: "6px 0 0", opacity: 0.88, maxWidth: 760 },

  heroBanner: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "radial-gradient(700px 240px at 20% 0%, rgba(185,28,28,0.28), transparent 60%), radial-gradient(700px 240px at 80% 0%, rgba(20,64,158,0.28), transparent 60%), rgba(255,255,255,0.04)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  heroBannerInner: { padding: 18 },
  heroBadge: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.22) 0%, rgba(255,255,255,0.06) 50%, rgba(20,64,158,0.22) 100%)",
  },
  heroH2: { margin: "12px 0 8px", fontSize: 22, letterSpacing: 0.2 },
  heroCopy: { margin: 0, opacity: 0.9, lineHeight: 1.55, maxWidth: 900 },
  heroCtas: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  primaryBtn: {
    textDecoration: "none",
    color: "#0b1220",
    background: "linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)",
    padding: "11px 14px",
    borderRadius: 12,
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.35)",
  },
  secondaryBtn: {
    textDecoration: "none",
    color: "#f3f4f6",
    background: "rgba(255,255,255,0.06)",
    padding: "11px 14px",
    borderRadius: 12,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.12)",
  },

  grid3: {
    marginTop: 14,
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  grid2: {
    marginTop: 10,
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  principleCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
  },
  principleTitle: { fontWeight: 900, marginBottom: 6, letterSpacing: 0.2 },
  principleText: { opacity: 0.85, lineHeight: 1.4 },

  // Flag Mark
  flagMark: {
    width: 78,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    flexShrink: 0,
  },
  blueBox: {
    width: 32,
    height: "100%",
    background: "#143f9e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  stars: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    fontSize: 8,
    lineHeight: 1,
    color: "rgba(255,255,255,0.9)",
  },
  star: { transform: "translateY(-0.5px)" },
  stripes: { flex: 1, display: "flex", flexDirection: "column" },
  redStripe: { flex: 1, background: "#b91c1c" },
  whiteStripe: { flex: 1, background: "#f8fafc" },

  // BOARDS CARD
  card: {
    maxWidth: 980,
    margin: "0 auto",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  h2: { margin: 0, fontSize: 18, letterSpacing: 0.3 },
  createBtn: {
    textDecoration: "none",
    color: "#0b1220",
    background: "linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.35)",
  },
  notice: {
    padding: 14,
    borderRadius: 12,
    background: "rgba(20, 64, 158, 0.18)",
    border: "1px solid rgba(20, 64, 158, 0.35)",
    color: "#eaf0ff",
  },
  noticeBad: {
    padding: 14,
    borderRadius: 12,
    background: "rgba(185, 28, 28, 0.15)",
    border: "1px solid rgba(185, 28, 28, 0.35)",
    color: "#ffecec",
  },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 },
  listItem: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  boardLink: { display: "block", padding: 14, textDecoration: "none", color: "inherit" },
  boardTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  boardTitle: { fontSize: 16, fontWeight: 900, letterSpacing: 0.2 },
  slugPill: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "linear-gradient(90deg, rgba(185,28,28,0.25) 0%, rgba(255,255,255,0.06) 50%, rgba(20,64,158,0.25) 100%)",
    opacity: 0.95,
    whiteSpace: "nowrap",
  },
  desc: { margin: "10px 0 0", opacity: 0.82, lineHeight: 1.35 },

  // FOOTER
  footer: { maxWidth: 980, margin: "18px auto 0", padding: "0 2px", opacity: 0.85 },
  footerLine: { height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 12 },
  footerText: { fontSize: 13 },
};
