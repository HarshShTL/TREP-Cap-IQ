"use client";

import Link from "next/link";
import { MapPin, Calendar, DollarSign, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency, PRIORITY_DOT_COLORS } from "@/lib/constants";
import { useProfiles } from "@/hooks/use-profile";
import type { Deal } from "@/types";

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const { data: profiles = [] } = useProfiles();
  const ownerName = profiles.find((p) => p.id === deal.deal_owner)?.full_name;

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl bg-card border border-border/60 p-3 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-pointer"
    >
      {/* Priority dot (top-right) */}
      {deal.priority && (
        <span
          className={cn(
            "absolute top-3 right-3 size-2 rounded-full",
            PRIORITY_DOT_COLORS[deal.priority] ?? "bg-muted",
          )}
        />
      )}

      {/* Name */}
      <Link
        href={`/deals/${deal.id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold leading-snug text-primary line-clamp-2 block hover:underline pr-4"
      >
        {deal.name}
      </Link>

      {/* Amount */}
      {deal.amount != null && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <DollarSign className="size-3 shrink-0" />
          <span className="tabular-nums font-medium text-foreground">
            {formatCurrency(deal.amount)}
          </span>
        </div>
      )}

      {/* Location */}
      {deal.location && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{deal.location}</span>
        </div>
      )}

      {/* Close date */}
      {deal.expected_close_date && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3 shrink-0" />
          <span>{format(new Date(deal.expected_close_date), "MM/dd/yyyy")}</span>
        </div>
      )}

      {/* Deal owner */}
      {ownerName && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="size-3 shrink-0" />
          <span className="truncate">{ownerName}</span>
        </div>
      )}

      {/* Asset class badge */}
      {deal.asset_class && (
        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
          {deal.asset_class}
        </span>
      )}
    </div>
  );
}
