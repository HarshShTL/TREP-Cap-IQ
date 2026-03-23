"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Users,
  MoreHorizontal,
  Shield,
  File,
  Plus,
  Search,
  Trash2,
  Loader2,
  Calendar,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { DealSummaryPanel } from "@/components/deals/deal-summary-panel";
import { DealParticipantsTab } from "@/components/deals/deal-participants-tab";
import { NdaTrackingTab } from "@/components/deals/nda-tracking-tab";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { useDeal } from "@/hooks/use-deals";
import { useDealParticipants } from "@/hooks/use-deal-participants";
import { useFiles, useUploadFile, useDeleteFile, getFileSignedUrl } from "@/hooks/use-files";
import { usePipelineStages } from "@/hooks/use-pipeline-config";
import {
  formatCurrencyFull,
  formatFileSize,
  STAGE_BADGE_CLASSES,
  ACTIVITY_TYPES,
} from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

type Props = { params: { id: string } };

/* ═══ QUICK ACTIONS ═══════════════════════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { type: "Note", icon: FileText, label: "Note" },
  { type: "Email", icon: Mail, label: "Email" },
  { type: "Call", icon: Phone, label: "Call" },
  { type: "Meeting", icon: Users, label: "Meeting" },
] as const;

/* ═══ RIGHT COLUMN: CONTACTS PANEL ═══════════════════════════════════════════ */

function ContactsPanel({ dealId }: { dealId: string }) {
  const { data: participants, isLoading } = useDealParticipants(dealId);
  const [search, setSearch] = React.useState("");

  const contacts = React.useMemo(() => {
    const seen = new Set<string>();
    return (participants ?? [])
      .filter((p) => {
        if (!p.contacts || seen.has(p.contact_id)) return false;
        seen.add(p.contact_id);
        return true;
      })
      .map((p) => p.contacts!);
  }, [participants]);

  const filtered = React.useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [contacts, search]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No associated contacts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.length > 3 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 pl-7 text-xs border-slate-200"
          />
        </div>
      )}
      {filtered.map((c) => (
        <div key={c.id} className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
          <div className="flex items-start gap-2.5">
            <EntityAvatar name={`${c.first_name} ${c.last_name}`} type="contact" size="sm" />
            <div className="min-w-0 flex-1">
              <Link
                href={`/contacts/${c.id}`}
                className="text-sm font-medium text-blue-600 hover:underline block truncate"
              >
                {c.first_name} {c.last_name}
              </Link>
              {c.company_name && (
                <p className="text-xs text-muted-foreground truncate">{c.company_name}</p>
              )}
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 mt-0.5"
                >
                  <Mail className="size-3" />
                  <span className="truncate">{c.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
      <Link
        href={`/contacts`}
        className="block text-xs text-blue-600 hover:underline text-center"
      >
        View all associated Contacts
      </Link>
    </div>
  );
}

/* ═══ RIGHT COLUMN: COMPANIES PANEL ══════════════════════════════════════════ */

function CompaniesPanel({ dealId }: { dealId: string }) {
  const { data: participants, isLoading } = useDealParticipants(dealId);

  const companies = React.useMemo(() => {
    const seen = new Set<string>();
    return (participants ?? [])
      .filter((p) => {
        const name = p.contacts?.company_name;
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .map((p) => ({
        name: p.contacts!.company_name!,
      }));
  }, [participants]);

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (!companies.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No associated companies
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {companies.map((c) => (
        <div key={c.name} className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
          <div className="flex items-start gap-2.5">
            <EntityAvatar name={c.name} type="entity" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{c.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ RIGHT COLUMN: ATTACHMENTS PANEL ════════════════════════════════════════ */

function AttachmentsPanel({ dealId }: { dealId: string }) {
  const { data: files, isLoading } = useFiles({ dealId });
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      await uploadFile.mutateAsync({ file, dealId });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const openFile = async (storageKey: string) => {
    const url = await getFileSignedUrl(storageKey);
    window.open(url, "_blank");
  };

  const targetFile = files?.find((f) => f.id === deleteTarget);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border-2 border-dashed p-3 text-center transition-colors",
          dragging ? "border-blue-400 bg-blue-50" : "border-slate-200",
        )}
      >
        <p className="text-xs text-muted-foreground">Drag & drop files here</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-1 text-xs text-blue-600 hover:underline"
        >
          or browse
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {uploadFile.isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" /> Uploading...
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : files?.length ? (
        <div className="space-y-1">
          {files.map((f) => (
            <div key={f.id} className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors">
              <File className="size-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() => openFile(f.storage_key)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="text-xs font-medium truncate text-blue-600 hover:underline">{f.filename}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(f.size)} &middot; {formatDate(f.created_at)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(f.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">No files attached</p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete file?"
        description={`Delete "${targetFile?.filename}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteFile.isPending}
        onConfirm={() => {
          if (targetFile) {
            deleteFile.mutate(
              { file: targetFile, params: { dealId } },
              { onSuccess: () => setDeleteTarget(null) },
            );
          }
        }}
      />
    </div>
  );
}

/* ═══ MAIN PAGE ══════════════════════════════════════════════════════════════ */

export default function DealDetailPage({ params }: Props) {
  const { id } = params;
  const { data: deal, isLoading } = useDeal(id);
  void usePipelineStages(); // preload pipeline stages
  const [logOpen, setLogOpen] = React.useState(false);
  const [logType, setLogType] = React.useState<string | undefined>();
  const [activityTypeFilter, setActivityTypeFilter] = React.useState<string>("");
  const [activitySearch, setActivitySearch] = React.useState("");

  const openLog = (type?: string) => {
    setLogType(type);
    setLogOpen(true);
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[30%_1fr_20%]">
          <div className="space-y-4 rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-16 rounded-xl" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="space-y-4 rounded-xl bg-white border border-slate-200 p-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4 rounded-xl bg-white border border-slate-200 p-5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <EmptyState title="Deal not found" description="This deal may have been deleted." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back link */}
      <div className="px-6 pt-4 pb-2">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Deals
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="px-6 pb-6 grid grid-cols-1 gap-5 lg:grid-cols-[30%_1fr_20%]">
        {/* ─── LEFT COLUMN ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Deal Header Card */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="size-14 rounded-xl bg-[hsl(220,70%,22%)] flex items-center justify-center">
                <Landmark className="size-7 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {deal.name}
              </h1>
              {deal.amount != null && (
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  {formatCurrencyFull(deal.amount)}
                </p>
              )}
              {deal.expected_close_date && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Close: {formatDate(deal.expected_close_date)}
                </div>
              )}
              <div className="text-xs text-muted-foreground">Pipeline: Deal Pipeline</div>
              {deal.stage && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                    STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {deal.stage}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Quick Actions
              </p>
              <div className="flex items-center gap-2">
                {QUICK_ACTIONS.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => openLog(type)}
                    className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2.5 text-xs text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                      <MoreHorizontal className="size-4" />
                      More
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openLog("NDA")}>
                      <Shield className="mr-2 size-4" /> Log NDA
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openLog("Document")}>
                      <File className="mr-2 size-4" /> Log Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* About this Deal */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
            <DealSummaryPanel dealId={id} />
          </div>
        </div>

        {/* ─── CENTER COLUMN ────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 min-h-[500px]">
          <Tabs defaultValue="activity">
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <TabsList className="h-9 gap-0.5 bg-slate-100 p-1 rounded-lg flex-wrap">
                  {[
                    { value: "activity", label: "Activities" },
                    { value: "notes", label: "Notes" },
                    { value: "emails", label: "Emails" },
                    { value: "calls", label: "Calls" },
                    { value: "meetings", label: "Meetings" },
                    { value: "participants", label: "Deal Participants" },
                    { value: "nda", label: "NDA Tracking" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-md px-3 py-1 text-xs data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  size="sm"
                  onClick={() => openLog()}
                  className="shrink-0 bg-[hsl(220,70%,22%)] hover:bg-[hsl(220,70%,28%)]"
                >
                  <Plus className="mr-1.5 size-3.5" />
                  Log Activity
                </Button>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search activities..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="h-8 pl-8 text-xs border-slate-200"
                  />
                </div>
                <Select
                  value={activityTypeFilter}
                  onValueChange={(v: string) => setActivityTypeFilter(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Filter activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {ACTIVITY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activity Tab (all types) */}
            <TabsContent value="activity" className="mt-0">
              <ActivityFeed
                dealId={id}
                typeFilter={activityTypeFilter || undefined}
                search={activitySearch || undefined}
                onLogActivity={() => openLog()}
              />
            </TabsContent>

            {/* Filtered tabs */}
            <TabsContent value="notes" className="mt-0">
              <ActivityFeed
                dealId={id}
                typeFilter="Note"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Note")}
              />
            </TabsContent>
            <TabsContent value="emails" className="mt-0">
              <ActivityFeed
                dealId={id}
                typeFilter="Email"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Email")}
              />
            </TabsContent>
            <TabsContent value="calls" className="mt-0">
              <ActivityFeed
                dealId={id}
                typeFilter="Call"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Call")}
              />
            </TabsContent>
            <TabsContent value="meetings" className="mt-0">
              <ActivityFeed
                dealId={id}
                typeFilter="Meeting"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Meeting")}
              />
            </TabsContent>

            {/* Deal Participants Tab */}
            <TabsContent value="participants" className="mt-0">
              <DealParticipantsTab dealId={id} />
            </TabsContent>

            {/* NDA Tracking Tab */}
            <TabsContent value="nda" className="mt-0">
              <NdaTrackingTab dealId={id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Contacts */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">
                Contacts
              </p>
            </div>
            <ContactsPanel dealId={id} />
          </div>

          {/* Companies */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">
                Companies
              </p>
            </div>
            <CompaniesPanel dealId={id} />
          </div>

          {/* Attachments */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">
                Attachments
              </p>
              <button
                type="button"
                onClick={() => {
                  const panel = document.querySelector<HTMLInputElement>("#deal-file-upload");
                  panel?.click();
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>
            <AttachmentsPanel dealId={id} />
          </div>
        </div>
      </div>

      <LogActivityDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        dealId={id}
        defaultType={logType}
      />
    </div>
  );
}
