"use client";

import * as React from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
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
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(null);

  const { data: deals = [], isLoading } = useDeals();
  const stages = usePipelineStages();

  return (
    <div className="flex h-full flex-col space-y-6">
      <PageHeader
        title="Deals"
        description="Manage your investment pipeline."
        actions={
          <>
            {/* View toggle */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
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

            <Button onClick={() => setNewDealOpen(true)}>
              <Plus className="size-4" />
              New Deal
            </Button>
          </>
        }
      />

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
