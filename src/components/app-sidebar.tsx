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
  Upload,
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
  { href: "/import", label: "Import", icon: Upload },
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
      <div className="border-b border-sidebar-border/60 px-4 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-slate-900 shadow-sm">
            TC
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold tracking-tight text-sidebar-foreground">
              TREP Cap IQ
            </span>
            <p className="text-[10px] text-sidebar-foreground/45 leading-tight">Investor Relations</p>
          </div>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
          Menu
        </p>
        {mainNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-[17px] shrink-0 transition-colors",
                  active ? "text-amber-400" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/80",
                )}
                aria-hidden
              />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-sidebar-border/30" />

        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
          Tools
        </p>
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-[17px] shrink-0 transition-colors",
                  active ? "text-amber-400" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/80",
                )}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border/40 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/40 to-amber-600/20 text-xs font-semibold text-amber-300">
            {getInitials(profile?.full_name)}
          </div>

          {/* Name + Role */}
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-semibold text-sidebar-foreground truncate leading-tight">
              {profile?.full_name ?? "Loading…"}
            </span>
            {profile?.role && (
              <span className={cn(
                "inline-flex items-center rounded px-1 text-[9px] font-medium mt-0.5 leading-4",
                profile.role === "super_admin"
                  ? "bg-amber-500/20 text-amber-400"
                  : profile.role === "read_only"
                    ? "bg-slate-500/20 text-slate-400"
                    : "bg-sidebar-foreground/10 text-sidebar-foreground/50",
              )}>
                {profile.role === "super_admin" ? "Admin" : profile.role === "read_only" ? "Read Only" : "Member"}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/40 transition-colors hover:bg-white/8 hover:text-sidebar-foreground/80"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
