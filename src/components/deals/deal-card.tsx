"use client";

import { MapPin, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, PRIORITY_DOT_COLORS } from "@/lib/constants";
import type { Deal } from "@/types";

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl bg-card p-3 ring-1 ring-foreground/10 hover:ring-primary/30 transition-shadow hover:shadow-md space-y-2"
    >
      {/* Name + priority dot */}
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            deal.priority ? PRIORITY_DOT_COLORS[deal.priority] : "bg-muted"
          )}
        />
        <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">
          {deal.name}
        </p>
      </div>

      {/* Asset class */}
      {deal.asset_class && (
        <Badge variant="secondary" className="text-xs">
          {deal.asset_class}
        </Badge>
      )}

      {/* Location */}
      {deal.location && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{deal.location}</span>
        </div>
      )}

      {/* Amount + close date */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        {deal.amount != null ? (
          <div className="flex items-center gap-1">
            <DollarSign className="size-3 shrink-0" />
            <span className="tabular-nums">{formatCurrency(deal.amount)}</span>
          </div>
        ) : (
          <span />
        )}
        {deal.expected_close_date && (
          <div className="flex items-center gap-1">
            <Calendar className="size-3 shrink-0" />
            <span>
              {format(new Date(deal.expected_close_date), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
