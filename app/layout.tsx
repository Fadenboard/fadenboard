import "./globals.css";
import TopNav from "@/components/layout/TopNav";

export const metadata = {
  title: "Faden",
  description: "Signal-first discourse.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#05070b] text-white">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
