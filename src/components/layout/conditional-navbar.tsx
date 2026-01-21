"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/features/auth/user-menu";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthPage) {
    return null;
  }

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatarUrl: session.user.image ?? undefined,
      }
    : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-background backdrop-blur-md supports-backdrop-filter:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <img src="/icon.svg" alt="Taskman" />
          </div>
          <span className="hidden sm:inline text-primary tracking-tight">
            Taskman
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session?.user && user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
