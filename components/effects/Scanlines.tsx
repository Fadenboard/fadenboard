export default function GridOverlay() {
    return (
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18]">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_40%_25%,black,transparent_60%)] bg-black" />
        </div>
    );
}
