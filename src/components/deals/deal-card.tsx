"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  Copy,
  UserPlus,
  Mail,
  Pencil,
  CalendarPlus,
} from "lucide-react";
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

  const copyDealName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(deal.name);
  };

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl bg-card border border-border/60 p-3.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 space-y-2 cursor-pointer group"
    >
      {/* Priority dot (top-right) */}
      {deal.priority && (
        <span
          className={cn(
            "absolute top-3 right-3 size-2.5 rounded-full ring-2 ring-card",
            PRIORITY_DOT_COLORS[deal.priority] ?? "bg-muted",
          )}
          title={`Priority: ${deal.priority}`}
        />
      )}

      {/* Name */}
      <Link
        href={`/deals/${deal.id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold leading-snug text-primary line-clamp-2 block hover:underline pr-5"
      >
        {deal.name}
      </Link>

      {/* Amount */}
      {deal.amount != null && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <DollarSign className="size-3 shrink-0" />
          <span className="tabular-nums font-semibold text-foreground">
            {formatCurrency(deal.amount)}
          </span>
        </div>
      )}

      {/* Location */}
      {deal.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{deal.location}</span>
        </div>
      )}

      {/* Close date */}
      {deal.expected_close_date && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3 shrink-0" />
          <span>{format(new Date(deal.expected_close_date), "MM/dd/yyyy")}</span>
        </div>
      )}

      {/* Deal owner */}
      {ownerName && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3 shrink-0" />
          <span className="truncate">{ownerName}</span>
        </div>
      )}

      {/* Create date */}
      {deal.created_at && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarPlus className="size-3 shrink-0" />
          <span>{format(new Date(deal.created_at), "MM/dd/yyyy")}</span>
        </div>
      )}

      {/* Asset class badge */}
      {deal.asset_class && (
        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
          {deal.asset_class}
        </span>
      )}

      {/* Quick action icons */}
      <div className="flex items-center gap-0.5 pt-1 border-t border-border/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={copyDealName}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Copy deal name"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Placeholder: triggers add participant flow
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Add participant"
        >
          <UserPlus className="size-3.5" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Send email"
        >
          <Mail className="size-3.5" />
        </button>
        <Link
          href={`/deals/${deal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Edit deal"
        >
          <Pencil className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
