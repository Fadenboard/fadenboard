export default function NoiseOverlay() {
    return (
        <div
            className="pointer-events-none absolute inset-0 z-[2] opacity-[0.14]"
            aria-hidden="true"
        >
            <div
                className="
          absolute inset-0
          [background-image:
            radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.10),transparent_45%),
            radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_50%),
            radial-gradient(circle_at_40%_85%,rgba(255,255,255,0.06),transparent_55%),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.05),
              rgba(255,255,255,0.05)_1px,
              transparent_1px,
              transparent_3px
            )
          ]
          mix-blend-overlay
        "
            />
        </div>
    );
}
