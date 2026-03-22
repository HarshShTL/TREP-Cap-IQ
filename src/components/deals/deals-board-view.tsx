"use client";

import * as React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DealCard } from "./deal-card";
import { formatCurrency } from "@/lib/constants";
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

  const stageMap = React.useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const deal of deals) {
      const existing = map.get(deal.stage) ?? [];
      existing.push(deal);
      map.set(deal.stage, existing);
    }
    return map;
  }, [deals]);

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
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((s) => (
          <div key={s} className="w-72 shrink-0 space-y-2 rounded-xl bg-muted/40 p-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = stageMap.get(stage) ?? [];
          const totalAmount = stageDeals.reduce(
            (sum, d) => sum + (d.amount ?? 0),
            0
          );

          return (
            <div
              key={stage}
              className="flex h-full w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-2"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-medium text-foreground">
                  {stage}
                </span>
                <Badge variant="secondary">{stageDeals.length}</Badge>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[60px] flex-1 space-y-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                      <p className="px-1 py-4 text-center text-xs text-muted-foreground">
                        No deals
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
                            className={snap.isDragging ? "opacity-80" : ""}
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

              {totalAmount > 0 && (
                <div className="mt-2 border-t pt-2 px-1 text-xs text-muted-foreground">
                  Total: {formatCurrency(totalAmount)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
