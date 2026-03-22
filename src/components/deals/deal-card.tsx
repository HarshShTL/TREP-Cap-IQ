"use client";

import Link from "next/link";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
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
      className="rounded-xl bg-card border border-border/60 p-3 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-pointer"
    >
      {/* Name + priority dot */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/deals/${deal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold leading-snug text-foreground line-clamp-2 flex-1 hover:underline hover:text-primary"
        >
          {deal.name}
        </Link>
        <span
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            PRIORITY_DOT_COLORS[deal.priority] ?? "bg-muted"
          )}
        />
      </div>

      {/* Asset class */}
      {deal.asset_class && (
        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
          {deal.asset_class}
        </span>
      )}

      {/* Location */}
      {deal.location && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{deal.location}</span>
        </div>
      )}

      {/* Amount + close date */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {deal.amount != null ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="size-3 shrink-0" />
            <span className="tabular-nums font-medium text-foreground">
              {formatCurrency(deal.amount)}
            </span>
          </div>
        ) : (
          <span />
        )}
        {deal.expected_close_date && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-3 shrink-0" />
            <span>{format(new Date(deal.expected_close_date), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
