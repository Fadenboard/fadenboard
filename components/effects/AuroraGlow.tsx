export default function AuroraGlow() {
    return (
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl opacity-30
        [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(255,80,80,0.18),transparent_60%),radial-gradient(circle_at_50%_70%,rgba(80,120,255,0.16),transparent_60%)]
        animate-[pulse_8s_ease-in-out_infinite]"
            />
            <div className="absolute bottom-[-220px] right-[-220px] h-[520px] w-[520px] rounded-full blur-3xl opacity-20
        [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(120,255,220,0.10),transparent_65%)]
        animate-[pulse_10s_ease-in-out_infinite]"
            />
        </div>
    );
}
