"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { AiChatbot } from "@/components/ai-chatbot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProfile } from "@/hooks/use-profile";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatHeaderDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function DesktopTopHeader() {
  const { data: profile } = useProfile();
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 hidden h-12 items-center justify-between border-b border-border bg-background/95 px-7 backdrop-blur md:flex">
      <p className="text-sm text-muted-foreground">
        {getGreeting()}{firstName ? `, ${firstName}` : ""} —{" "}
        <span className="text-foreground/70">{formatHeaderDate()}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen md:shrink-0">
        <AppSidebar
          className="h-full"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="shrink-0" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent
              side="left"
              className="h-full w-64 max-w-[256px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-[256px]"
            >
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">TREP Cap IQ</p>
            <p className="truncate text-xs text-muted-foreground">Investor Relations</p>
          </div>
        </header>

        {/* Desktop top header */}
        <DesktopTopHeader />

        <main className="flex-1 p-6 md:p-7">{children}</main>
      </div>

      <AiChatbot />
    </div>
  );
}
