"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthUser = {
  id: string;
  email?: string;
  user_metadata: {
    avatar_url?: string;
    name?: string;
  };
};

export function UserMenu() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user as AuthUser | null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser((session?.user ?? null) as AuthUser | null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-7 text-[0.8rem] font-medium transition-colors hover:bg-muted hover:text-foreground",
            isOpen && "bg-muted text-foreground"
          )}
        >
          Sign In
          <ChevronDown className="ml-1 size-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg p-2 z-50">
            <button
              onClick={() => {
                const supabase = createClient();
                supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {
                    redirectTo:
                      window.location.origin + "/auth/callback",
                  },
                });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              GitHub
            </button>
            <button
              onClick={() => {
                const supabase = createClient();
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo:
                      window.location.origin + "/auth/callback",
                  },
                });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              Google
            </button>
          </div>
        )}
      </div>
    );
  }

  const initials =
    user.user_metadata?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    (user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.name ?? "User"}
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
            {initials}
          </div>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-popover shadow-lg z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium truncate">
              {user.user_metadata?.name ?? user.email}
            </p>
            {user.user_metadata?.name && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-none hover:bg-muted transition-colors text-left text-destructive hover:text-destructive"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
