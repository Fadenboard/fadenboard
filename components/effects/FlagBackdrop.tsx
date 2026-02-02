export default function FlagBackdrop() {
  return (
    <div className="absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(180,30,40,.35),rgba(20,40,120,.35))] opacity-70" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#05070b]" />
    </div>
  );
}
