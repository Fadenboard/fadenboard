import { ReactNode } from "react";

export default function GlassPanel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl",
        "shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
        "before:[background:linear-gradient(180deg,rgba(255,255,255,0.10),transparent_35%)]",
        "hover:border-white/15 hover:bg-white/[0.075] transition-all duration-300",
        "hover:-translate-y-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
