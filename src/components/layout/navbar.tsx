"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";

const links = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/resources", label: "Resources" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Apex <span className="text-primary">Physics</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith(href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}
