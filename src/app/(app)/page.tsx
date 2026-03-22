"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import {
  useDashboardStats,
  useDealsByStage,
  useRecentDeals,
  useRecentActivities,
} from "@/hooks/use-dashboard";
import {
  formatCurrency,
  STAGE_BADGE_CLASSES,
  STAGE_BAR_COLORS,
  LEAD_STATUS_BADGE_CLASSES,
  DEAL_STAGES,
} from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted/60 ${className}`} />
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  subtitle,
  icon,
  loading,
  iconBg,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  iconBg: string;
}) {
  return (
    <Card className="border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="mt-2 h-9 w-28" />
            ) : (
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                {value}
              </p>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full",
              iconBg,
            )}
          >
            {icon}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const stats = useDashboardStats();
  const dealsByStage = useDealsByStage();
  const recentDeals = useRecentDeals();
  const recentActivities = useRecentActivities();

  // Compute max count for bar chart proportionality
  const maxCount = React.useMemo(() => {
    if (!dealsByStage.data?.length) return 1;
    return Math.max(...dealsByStage.data.map((d) => d.count), 1);
  }, [dealsByStage.data]);

  // Sort pipeline stages in canonical order
  const sortedStages = React.useMemo(() => {
    if (!dealsByStage.data) return [];
    const order = DEAL_STAGES as readonly string[];
    return [...dealsByStage.data].sort(
      (a, b) => order.indexOf(a.stage) - order.indexOf(b.stage),
    );
  }, [dealsByStage.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Overview of your investor relations pipeline.
        </p>
      </div>

      {/* ── Row 1: KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Contacts"
          value={stats.data?.activeContacts ?? 0}
          subtitle={
            stats.data
              ? `${stats.data.contactsNeedCall} need to call`
              : undefined
          }
          icon={<Users className="size-5 text-teal-600" />}
          loading={stats.isLoading}
          iconBg="bg-teal-50 dark:bg-teal-900/20"
        />
        <KpiCard
          title="Active Deals"
          value={stats.data?.activeDeals ?? 0}
          subtitle={
            stats.data
              ? `of ${stats.data.totalDeals} total`
              : undefined
          }
          icon={<Building2 className="size-5 text-indigo-600" />}
          loading={stats.isLoading}
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
        />
        <KpiCard
          title="Companies"
          value={stats.data?.companiesCount ?? 0}
          subtitle="in your pipeline"
          icon={<Briefcase className="size-5 text-emerald-600" />}
          loading={stats.isLoading}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <KpiCard
          title="Pipeline Value"
          value={stats.data ? formatCurrency(stats.data.totalAmount) : "$0"}
          subtitle="total deal value"
          icon={<TrendingUp className="size-5 text-amber-600" />}
          loading={stats.isLoading}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
        />
      </div>

      {/* ── Row 2: Pipeline + Activity ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pipeline by Stage — Horizontal Bars */}
        <Card className="border border-slate-200 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {dealsByStage.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : !sortedStages.length ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No deal data yet.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedStages.map(({ stage, count, amount }) => (
                  <div key={stage} className="flex items-center gap-3">
                    {/* Stage badge */}
                    <span
                      className={cn(
                        "inline-flex w-28 shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        STAGE_BADGE_CLASSES[stage] ?? "bg-gray-100 text-gray-700",
                      )}
                    >
                      {stage}
                    </span>

                    {/* Bar */}
                    <div className="flex-1">
                      <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={cn(
                            "h-3 rounded-full transition-all duration-300",
                            STAGE_BAR_COLORS[stage] ?? "bg-slate-400",
                          )}
                          style={{
                            width: `${Math.max((count / maxCount) * 100, 4)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Count + amount */}
                    <div className="flex w-28 shrink-0 items-center justify-end gap-2 text-xs">
                      <span className="font-semibold text-foreground">
                        {count}
                      </span>
                      {amount > 0 && (
                        <span className="text-muted-foreground tabular-nums">
                          {formatCurrency(amount)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Timeline */}
        <Card className="border border-slate-200 rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Link
                href="/activity"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivities.isLoading ? (
              <div className="space-y-3 px-6 pb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !recentActivities.data?.length ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivities.data.map((activity) => {
                  const contactName = activity.contacts
                    ? `${activity.contacts.first_name} ${activity.contacts.last_name}`.trim()
                    : null;
                  const companyName = (activity.contacts as unknown as { company_name?: string })?.company_name;
                  const leadStatus = (activity.contacts as unknown as { lead_status?: string })?.lead_status;

                  return (
                    <li
                      key={activity.id}
                      className="flex items-center gap-3 px-6 py-3"
                    >
                      {contactName ? (
                        <EntityAvatar
                          name={contactName}
                          type="contact"
                          size="sm"
                        />
                      ) : (
                        <div className="size-8 shrink-0 rounded-full bg-muted" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {contactName && (
                            <span className="text-sm font-medium text-foreground truncate">
                              {contactName}
                            </span>
                          )}
                          {companyName && (
                            <span className="text-xs text-muted-foreground truncate">
                              at {companyName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {activity.subject}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(activity.created_at)}
                        </span>
                        {leadStatus && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              LEAD_STATUS_BADGE_CLASSES[leadStatus] ?? "bg-gray-100 text-gray-600",
                            )}
                          >
                            {leadStatus}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Active Deals Table ────────────────────────────────── */}
      <Card className="border border-slate-200 rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Active Deals</CardTitle>
            <Link
              href="/deals"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View pipeline <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentDeals.isLoading ? (
            <div className="space-y-3 px-6 pb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !recentDeals.data?.length ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              No active deals found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="bg-slate-50/80 px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Deal Name
                    </th>
                    <th className="bg-slate-50/80 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Stage
                    </th>
                    <th className="bg-slate-50/80 px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>
                    <th className="bg-slate-50/80 px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Close Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDeals.data.map((deal) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {deal.name}
                        </Link>
                        {deal.location && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {deal.location}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            STAGE_BADGE_CLASSES[deal.stage] ??
                              "bg-gray-100 text-gray-700",
                          )}
                        >
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm tabular-nums text-foreground">
                        {deal.amount != null
                          ? formatCurrency(deal.amount)
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-muted-foreground">
                        {formatDate(deal.expected_close_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
