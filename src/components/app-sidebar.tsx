"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Briefcase,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/activity", label: "Activity", icon: Activity },
] as const;

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function AppSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: profile } = useProfile();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Logo */}
      <div className="border-b border-sidebar-border/60 px-5 py-5">
        <Link href="/" className="block" onClick={onNavigate}>
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            TREP Cap IQ
          </span>
          <p className="mt-0.5 text-xs text-sidebar-foreground/50">Investor Relations</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {mainNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-amber-500/20 text-amber-400 border-l-2 border-amber-400 pl-[10px]"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}

        <hr className="border-sidebar-border/40 my-2" />

        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-amber-500/20 text-amber-400 border-l-2 border-amber-400 pl-[10px]"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-sidebar-border/40 mt-auto">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-semibold text-amber-400 shrink-0">
          {getInitials(profile?.full_name)}
        </div>

        {/* Name + Role */}
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-sidebar-foreground truncate">
            {profile?.full_name ?? "Loading…"}
          </span>
          {profile?.role && (
            <span className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium mt-0.5",
              profile.role === "super_admin"
                ? "bg-amber-500/20 text-amber-400"
                : profile.role === "read_only"
                  ? "bg-slate-500/20 text-slate-400"
                  : "bg-sidebar-foreground/10 text-sidebar-foreground/60",
            )}>
              {profile.role === "super_admin" ? "Super Admin" : profile.role === "read_only" ? "Read Only" : "User"}
            </span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/5 transition-colors"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
