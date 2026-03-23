"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Phone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted/60 ${className}`} />
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  accentColor: string;
  href?: string;
}

function KpiCard({ title, value, subtitle, icon, loading, accentColor, href }: KpiCardProps) {
  const inner = (
    <CardContent className="p-0">
      <div
        className="flex items-stretch rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Left color accent bar */}
        <div className={cn("w-1 shrink-0", accentColor)} />

        <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-24" />
            ) : (
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {value}
              </p>
            )}
            {subtitle && !loading && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentColor.replace("bg-", "bg-").replace("-500", "-100").replace("-600", "-100"),
          )}>
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card className="border-0 shadow-none p-0">
      {href ? <Link href={href} className="block">{inner}</Link> : inner}
    </Card>
  );
}

function ActivityTypeDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Call: "bg-blue-500",
    Email: "bg-violet-500",
    Meeting: "bg-emerald-500",
    Note: "bg-amber-500",
    NDA: "bg-rose-500",
    Document: "bg-slate-400",
    "AI Update": "bg-cyan-500",
  };
  return (
    <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", colors[type] ?? "bg-gray-400")} />
  );
}

export default function DashboardPage() {
  const stats = useDashboardStats();
  const dealsByStage = useDealsByStage();
  const recentDeals = useRecentDeals();
  const recentActivities = useRecentActivities();

  const maxCount = React.useMemo(() => {
    if (!dealsByStage.data?.length) return 1;
    return Math.max(...dealsByStage.data.map((d) => d.count), 1);
  }, [dealsByStage.data]);

  const sortedStages = React.useMemo(() => {
    if (!dealsByStage.data) return [];
    const order = DEAL_STAGES as readonly string[];
    return [...dealsByStage.data].sort(
      (a, b) => order.indexOf(a.stage) - order.indexOf(b.stage),
    );
  }, [dealsByStage.data]);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your investor relations pipeline at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted/60 transition-colors"
          >
            <Phone className="size-3" />
            Need to Call
          </Link>
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted/60 transition-colors"
          >
            <Briefcase className="size-3" />
            Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Contacts"
          value={stats.data?.activeContacts ?? 0}
          subtitle={stats.data ? `${stats.data.contactsNeedCall} need to call` : undefined}
          icon={<Users className="size-5 text-teal-600" />}
          loading={stats.isLoading}
          accentColor="bg-teal-500"
          href="/contacts"
        />
        <KpiCard
          title="Active Deals"
          value={stats.data?.activeDeals ?? 0}
          subtitle={stats.data ? `of ${stats.data.totalDeals} total` : undefined}
          icon={<Building2 className="size-5 text-indigo-600" />}
          loading={stats.isLoading}
          accentColor="bg-indigo-500"
          href="/deals"
        />
        <KpiCard
          title="Companies"
          value={stats.data?.companiesCount ?? 0}
          subtitle="in your pipeline"
          icon={<Briefcase className="size-5 text-violet-600" />}
          loading={stats.isLoading}
          accentColor="bg-violet-500"
          href="/companies"
        />
        <KpiCard
          title="Pipeline Value"
          value={stats.data ? formatCurrency(stats.data.totalAmount) : "$0"}
          subtitle="total deal value"
          icon={<TrendingUp className="size-5 text-amber-600" />}
          loading={stats.isLoading}
          accentColor="bg-amber-500"
        />
      </div>

      {/* Middle row: Pipeline + Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Pipeline by Stage */}
        <Card className="border border-border rounded-xl shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Pipeline by Stage</CardTitle>
              <Link href="/deals" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {dealsByStage.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
              </div>
            ) : !sortedStages.length ? (
              <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
                No deal data yet.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedStages.map(({ stage, count, amount }) => (
                  <div key={stage} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex w-[110px] shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                        STAGE_BADGE_CLASSES[stage] ?? "bg-gray-100 text-gray-700",
                      )}
                    >
                      {stage}
                    </span>
                    <div className="flex-1">
                      <div className="h-2.5 w-full rounded-full bg-muted">
                        <div
                          className={cn("h-2.5 rounded-full transition-all duration-500", STAGE_BAR_COLORS[stage] ?? "bg-slate-400")}
                          style={{ width: `${Math.max((count / maxCount) * 100, 4)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex w-24 shrink-0 items-center justify-end gap-2 text-xs">
                      <span className="font-semibold text-foreground">{count}</span>
                      {amount > 0 && (
                        <span className="text-muted-foreground tabular-nums">{formatCurrency(amount)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-border rounded-xl shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Recent Activity</CardTitle>
              <Link href="/activity" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivities.isLoading ? (
              <div className="space-y-3 px-5 pb-5">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : !recentActivities.data?.length ? (
              <p className="px-5 pb-5 text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivities.data.map((activity) => {
                  const contactName = activity.contacts
                    ? `${activity.contacts.first_name} ${activity.contacts.last_name}`.trim()
                    : null;
                  const companyName = (activity.contacts as unknown as { company_name?: string })?.company_name;
                  const leadStatus = (activity.contacts as unknown as { lead_status?: string })?.lead_status;

                  return (
                    <li key={activity.id} className="flex items-start gap-3 px-5 py-3.5">
                      <ActivityTypeDot type={activity.type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {contactName && (
                            <span className="text-xs font-semibold text-foreground">{contactName}</span>
                          )}
                          {companyName && (
                            <span className="text-xs text-muted-foreground">· {companyName}</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">{activity.subject}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDate(activity.created_at)}
                        </span>
                        {leadStatus && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
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

      {/* Active Deals Table */}
      <Card className="border border-border rounded-xl shadow-sm">
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">Active Deals</CardTitle>
            <Link href="/deals" className="flex items-center gap-1 text-xs text-primary hover:underline">
              View pipeline <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentDeals.isLoading ? (
            <div className="space-y-3 px-5 pb-5">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !recentDeals.data?.length ? (
            <p className="px-5 pb-5 text-sm text-muted-foreground">No active deals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="bg-muted/40 px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Deal Name
                    </th>
                    <th className="bg-muted/40 px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Stage
                    </th>
                    <th className="bg-muted/40 px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="bg-muted/40 px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Close Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentDeals.data.map((deal) => (
                    <tr key={deal.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {deal.name}
                        </Link>
                        {deal.location && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{deal.location}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700",
                          )}
                        >
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm tabular-nums font-medium text-foreground">
                        {deal.amount != null ? formatCurrency(deal.amount) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
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
