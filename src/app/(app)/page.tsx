"use client";

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity as ActivityIcon,
  Briefcase,
  Users,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDashboardStats,
  useDealsByStage,
  useContactsByStatus,
  useRecentDeals,
  useRecentActivities,
} from "@/hooks/use-dashboard";
import { formatCurrency, STAGE_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Colors ───────────────────────────────────────────────────────────────────
const CHART_COLORS = [
  "#1a3a6b",
  "#f59e0b",
  "#2563eb",
  "#0891b2",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#d97706",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getActivityIcon(type: string) {
  const lower = (type ?? "").toLowerCase();
  if (lower.includes("call") || lower.includes("phone"))
    return <Phone className="size-3.5 shrink-0" />;
  if (lower.includes("email") || lower.includes("mail"))
    return <Mail className="size-3.5 shrink-0" />;
  if (lower.includes("meet") || lower.includes("calendar"))
    return <Calendar className="size-3.5 shrink-0" />;
  if (lower.includes("note") || lower.includes("file"))
    return <FileText className="size-3.5 shrink-0" />;
  return <ActivityIcon className="size-3.5 shrink-0" />;
}

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
  icon,
  loading,
  accentColor,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  accentColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card
      className={cn(
        "border-l-4 hover:shadow-md transition-shadow",
        accentColor,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <span className={cn("rounded-full p-2", iconBg, iconColor)}>
            {icon}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const stats = useDashboardStats();
  const dealsByStage = useDealsByStage();
  const contactsByStatus = useContactsByStatus();
  const recentDeals = useRecentDeals();
  const recentActivities = useRecentActivities();

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

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Active Deals"
          value={stats.data?.activeDeals ?? 0}
          icon={<Briefcase className="size-4" />}
          loading={stats.isLoading}
          accentColor="border-l-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Active Contacts"
          value={stats.data?.activeContacts ?? 0}
          icon={<Users className="size-4" />}
          loading={stats.isLoading}
          accentColor="border-l-green-500"
          iconBg="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <KpiCard
          title="Total Deal Amount"
          value={stats.data ? formatCurrency(stats.data.totalAmount) : "$0"}
          icon={<DollarSign className="size-4" />}
          loading={stats.isLoading}
          accentColor="border-l-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bar Chart — Deals by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {dealsByStage.isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : !dealsByStage.data?.length ? (
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                No deal data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={dealsByStage.data}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Deals"
                    fill="#1e3a5f"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart — Contacts by Lead Status */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts by Lead Status</CardTitle>
          </CardHeader>
          <CardContent>
            {contactsByStatus.isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : !contactsByStatus.data?.length ? (
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                No contact data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contactsByStatus.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    label={({ name, percent }) =>
                      percent > 0.05 ? name : ""
                    }
                    labelLine={false}
                  >
                    {contactsByStatus.data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentDeals.isLoading ? (
              <div className="space-y-3 px-4 pb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !recentDeals.data?.length ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">
                No active deals found.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentDeals.data.map((deal) => (
                  <li
                    key={deal.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="truncate text-sm font-medium text-foreground hover:text-primary hover:underline block"
                      >
                        {deal.name}
                      </Link>
                      {deal.location && (
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {deal.location}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          STAGE_BADGE_CLASSES[deal.stage] ??
                            "bg-gray-100 text-gray-700",
                        )}
                      >
                        {deal.stage}
                      </span>
                      {deal.amount != null && (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {formatCurrency(deal.amount)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivities.isLoading ? (
              <div className="space-y-3 px-4 pb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !recentActivities.data?.length ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivities.data.map((activity) => {
                  const linkedName =
                    activity.deals?.name ??
                    (activity.contacts
                      ? `${activity.contacts.first_name} ${activity.contacts.last_name}`.trim()
                      : null);
                  return (
                    <li
                      key={activity.id}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <span className="mt-0.5 shrink-0 rounded-full p-1.5 bg-muted text-muted-foreground">
                        {getActivityIcon(activity.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {activity.subject}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          {linkedName && (
                            <>
                              <span className="truncate">{linkedName}</span>
                              <span>·</span>
                            </>
                          )}
                          <span className="shrink-0">
                            {formatDistanceToNow(
                              new Date(activity.created_at),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
