import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Popsuk (Pop) Sumetchoengprachya</span>
        <nav className="flex gap-4">
          <Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
          <Link href="/community" className="hover:text-foreground transition-colors">Community</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>
    </footer>
  );
}
