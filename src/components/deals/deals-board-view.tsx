"use client";

import * as React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DealCard } from "./deal-card";
import { formatCurrency, STAGE_DOT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUpdateDealStage } from "@/hooks/use-deals";
import type { Deal } from "@/types";

interface DealsBoardViewProps {
  deals: Deal[];
  stages: string[];
  loading?: boolean;
  onDealClick: (id: string) => void;
}

export function DealsBoardView({
  deals,
  stages,
  loading,
  onDealClick,
}: DealsBoardViewProps) {
  const updateStage = useUpdateDealStage();
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const stageMap = React.useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const stage of stages) {
      map.set(stage, []);
    }
    for (const deal of deals) {
      const existing = map.get(deal.stage);
      if (existing) {
        existing.push(deal);
      } else {
        map.set(deal.stage, [deal]);
      }
    }
    return map;
  }, [deals, stages]);

  const toggleCollapse = (stage: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const deal = deals.find((d) => d.id === draggableId);
    if (!deal || deal.stage === newStage) return;
    updateStage.mutate({ id: draggableId, stage: newStage });
  };

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-h-0">
        {stages.map((s) => (
          <div
            key={s}
            className="flex w-[290px] shrink-0 flex-col rounded-xl bg-muted/30 border border-border/50 p-3 space-y-3"
          >
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-h-0">
        {stages.map((stage) => {
          const stageDeals = stageMap.get(stage) ?? [];
          const totalAmount = stageDeals.reduce(
            (sum, d) => sum + (d.amount ?? 0),
            0,
          );
          const isCollapsed = collapsed.has(stage);

          return (
            <div
              key={stage}
              className={cn(
                "flex shrink-0 flex-col rounded-xl bg-muted/30 border border-border/50 transition-all duration-200",
                isCollapsed ? "w-[52px]" : "w-[290px]",
              )}
            >
              {/* Column header */}
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 border-b border-border/40 cursor-pointer select-none",
                  isCollapsed && "flex-col px-1.5 py-3 border-b-0",
                )}
                onClick={() => toggleCollapse(stage)}
              >
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    STAGE_DOT_COLORS[stage] ?? "bg-slate-400",
                  )}
                />

                {isCollapsed ? (
                  <>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">
                      {stage}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground mt-1">
                      {stageDeals.length}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {stage}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {stageDeals.length}
                    </span>
                    {totalAmount > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums font-medium">
                        {formatCurrency(totalAmount)}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Column body */}
              {!isCollapsed && (
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "min-h-[80px] flex-1 space-y-2 p-2 overflow-y-auto transition-colors rounded-b-xl",
                        snapshot.isDraggingOver && "bg-primary/5",
                      )}
                    >
                      {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                        <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                          No deals in this stage
                        </p>
                      )}
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
                          index={index}
                        >
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={cn(
                                "transition-transform duration-150",
                                snap.isDragging &&
                                  "rotate-1 scale-[1.02] shadow-xl",
                              )}
                            >
                              <DealCard
                                deal={deal}
                                onClick={() => onDealClick(deal.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
