"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string | undefined>();
  const [logOpen, setLogOpen] = React.useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const allTypes = ["All", ...ACTIVITY_TYPES] as const;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Activity Log"
        description="All logged calls, emails, meetings, and notes"
        actions={
          <Button onClick={() => setLogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Log Activity
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {allTypes.map((type) => {
          const isActive = type === "All" ? !typeFilter : typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type === "All" ? undefined : type)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {type}
            </button>
          );
        })}

        <Input
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto max-w-64 rounded-full"
        />
      </div>

      <ActivityFeed
        typeFilter={typeFilter}
        search={debouncedSearch}
        onLogActivity={() => setLogOpen(true)}
      />

      <LogActivityDialog open={logOpen} onOpenChange={setLogOpen} />
    </div>
  );
}
