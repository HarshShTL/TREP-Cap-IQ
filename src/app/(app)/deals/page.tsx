"use client";

import * as React from "react";
import { LayoutGrid, List, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DealsBoardView } from "@/components/deals/deals-board-view";
import { DealsListView } from "@/components/deals/deals-list-view";
import { NewDealDialog } from "@/components/deals/new-deal-dialog";
import { DealQuickEditSheet } from "@/components/deals/deal-quick-edit-sheet";
import { useDeals } from "@/hooks/use-deals";
import { usePipelineStages } from "@/hooks/use-pipeline-config";

type ViewMode = "board" | "list";

export default function DealsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("board");
  const [newDealOpen, setNewDealOpen] = React.useState(false);
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
    null,
  );
  const [pipeline] = React.useState("TREP Pipeline");

  const { data: deals = [], isLoading } = useDeals();
  const stages = usePipelineStages();

  return (
    <div className="flex h-full flex-col">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Deals
          </h1>
          {/* Pipeline selector */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {pipeline}
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>TREP Pipeline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "board" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("board")}
              title="Board view"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <List className="size-4" />
            </Button>
          </div>

          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => setNewDealOpen(true)}
          >
            <Plus className="mr-2 size-4" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 min-h-0">
        {viewMode === "board" ? (
          <DealsBoardView
            deals={deals}
            stages={stages}
            loading={isLoading}
            onDealClick={(id) => setSelectedDealId(id)}
          />
        ) : (
          <DealsListView deals={deals} loading={isLoading} />
        )}
      </div>

      {/* ===== DIALOGS ===== */}
      <NewDealDialog open={newDealOpen} onOpenChange={setNewDealOpen} />
      <DealQuickEditSheet
        dealId={selectedDealId}
        open={!!selectedDealId}
        onOpenChange={(open) => {
          if (!open) setSelectedDealId(null);
        }}
      />
    </div>
  );
}
