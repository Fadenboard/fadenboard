import FlagBackdrop from "@/components/effects/FlagBackdrop";
import AuroraGlow from "@/components/effects/AuroraGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import GridOverlay from "@/components/effects/GridOverlay";
import Scanlines from "@/components/effects/Scanlines";

import CreateBoardCard from "@/components/boards/CreateBoardCard";
import BoardListCard from "@/components/boards/BoardListCard";

export default function BoardsPage() {
  return (
    <main className="relative min-h-screen bg-[#05070b] text-white">
      {/* Depth layers */}
      <FlagBackdrop />
      <GridOverlay />
      <NoiseOverlay />
      <Scanlines />


      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-14">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-white/50" />
            <span>FADEN BOARDS</span>
            <span className="text-white/30">|</span>
            <span className="text-white/45">america-first signal</span>

          </div>

          <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Unite the Right! Fight! Fight! Fight!
          </h1>

          <p className="max-w-2xl text-sm text-white/60 sm:text-base">
            A next-generation discussion platform built for sovereignty, free
            speech, and unapologetic debate. No filters. Liberals Not Allowed!
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
              Free Speech
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
              No shadow bans
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
              Sipping On Liberal Tears!
            </span>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="relative z-10 mx-auto mt-10 max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CreateBoardCard />
          <BoardListCard />
        </div>
      </div>


      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black" />
    </main>
  );
}
