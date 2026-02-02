export default function Scanlines() {
    return (
        <div className="pointer-events-none absolute inset-0 z-[3] opacity-[0.10]">
            <div className="absolute inset-0 [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_1px,transparent_1px,transparent_5px)]" />
            <div className="absolute inset-0 opacity-[0.35] [background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)] animate-[sweep_6s_linear_infinite]" />
            <style>{`
        @keyframes sweep {
          0% { transform: translateX(-40%); }
          100% { transform: translateX(140%); }
        }
      `}</style>
        </div>
    );
}
