"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  FileText,
  Users,
  MoreHorizontal,
  Search,
  File,
  Trash2,
  Shield,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactSummaryPanel } from "@/components/contacts/contact-summary-panel";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useContact } from "@/hooks/use-contacts";
import { useContactParticipants } from "@/hooks/use-deal-participants";
import { useCompany } from "@/hooks/use-companies";
import { useFiles, useUploadFile, useDeleteFile, getFileSignedUrl } from "@/hooks/use-files";
import {
  formatCurrency,
  formatFileSize,
  STAGE_BADGE_CLASSES,
  PARTICIPANT_STATUS_BADGE_CLASSES,
  ACTIVITY_TYPES,
} from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

type Props = { params: { id: string } };

// ─── Center Column: Deal Participants Tab ───────────────────────────────────────

function ContactDealsTab({ contactId }: { contactId: string }) {
  const { data: participants, isLoading } = useContactParticipants(contactId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!participants?.length) {
    return (
      <EmptyState
        title="No deal participation"
        description="This contact has not been added to any deals yet."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-100">
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Deal</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Stage</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Commitment</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">NDA Sent</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">NDA Signed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((p) => (
          <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
            <TableCell className="py-3">
              {p.deals ? (
                <Link href={`/deals/${p.deal_id}`} className="font-medium text-blue-600 hover:underline">
                  {p.deals.name}
                </Link>
              ) : "—"}
            </TableCell>
            <TableCell className="py-3">
              {p.deals?.stage ? (
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", STAGE_BADGE_CLASSES[p.deals.stage] ?? "bg-gray-100 text-gray-700")}>
                  {p.deals.stage}
                </span>
              ) : "—"}
            </TableCell>
            <TableCell className="py-3 text-sm">{p.role ?? "—"}</TableCell>
            <TableCell className="py-3 text-sm tabular-nums">
              {p.commitment_amount != null ? formatCurrency(p.commitment_amount) : "—"}
            </TableCell>
            <TableCell className="py-3">
              {p.status ? (
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", PARTICIPANT_STATUS_BADGE_CLASSES[p.status] ?? "bg-gray-100 text-gray-600")}>
                  {p.status}
                </span>
              ) : "—"}
            </TableCell>
            <TableCell className="py-3 text-sm text-muted-foreground">
              {p.nda_sent_date ? format(new Date(p.nda_sent_date), "MMM d, yyyy") : "—"}
            </TableCell>
            <TableCell className="py-3 text-sm text-muted-foreground">
              {p.nda_signed_date ? format(new Date(p.nda_signed_date), "MMM d, yyyy") : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Center Column: NDA Tracking Tab ────────────────────────────────────────────

function ContactNdaTab({ contactId }: { contactId: string }) {
  const { data: participants, isLoading } = useContactParticipants(contactId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const withNda = participants?.filter((p) => p.nda_sent_date || p.nda_signed_date) ?? [];

  if (!withNda.length) {
    return (
      <EmptyState
        title="No NDAs tracked"
        description="NDA tracking information will appear here when deal participants have NDA dates recorded."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-100">
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Deal</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">NDA Sent</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">NDA Signed</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withNda.map((p) => (
          <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
            <TableCell className="py-3">
              {p.deals ? (
                <Link href={`/deals/${p.deal_id}`} className="font-medium text-blue-600 hover:underline">
                  {p.deals.name}
                </Link>
              ) : "—"}
            </TableCell>
            <TableCell className="py-3 text-sm">{p.role ?? "—"}</TableCell>
            <TableCell className="py-3 text-sm text-muted-foreground">
              {p.nda_sent_date ? format(new Date(p.nda_sent_date), "MMM d, yyyy") : "—"}
            </TableCell>
            <TableCell className="py-3 text-sm text-muted-foreground">
              {p.nda_signed_date ? format(new Date(p.nda_signed_date), "MMM d, yyyy") : "—"}
            </TableCell>
            <TableCell className="py-3">
              {p.nda_signed_date ? (
                <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100">
                  <Shield className="size-3" /> Signed
                </Badge>
              ) : p.nda_sent_date ? (
                <Badge variant="secondary" className="gap-1 text-amber-700 bg-amber-100">
                  <Shield className="size-3" /> Sent
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-muted-foreground">
                  Not Sent
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Right Column: Companies Panel ──────────────────────────────────────────────

function CompaniesPanel({ contact }: { contact: { company_id: string | null; company_name: string | null } }) {
  const { data: company } = useCompany(contact.company_id ?? "");

  if (!contact.company_id && !contact.company_name) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No associated companies
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
        <div className="flex items-start gap-2.5">
          <EntityAvatar name={contact.company_name ?? "?"} type="entity" size="sm" />
          <div className="min-w-0 flex-1">
            {contact.company_id ? (
              <Link
                href={`/companies/${contact.company_id}`}
                className="text-sm font-medium text-blue-600 hover:underline block truncate"
              >
                {contact.company_name}
              </Link>
            ) : (
              <p className="text-sm font-medium truncate">{contact.company_name}</p>
            )}
            {company?.domain && (
              <p className="text-xs text-muted-foreground truncate">{company.domain}</p>
            )}
            {company?.hq_city && (
              <p className="text-xs text-muted-foreground">
                {[company.hq_city, company.hq_state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
      {contact.company_id && (
        <Link
          href={`/companies/${contact.company_id}`}
          className="block text-xs text-blue-600 hover:underline text-center"
        >
          View all associated Companies
        </Link>
      )}
    </div>
  );
}

// ─── Right Column: Deals Panel ──────────────────────────────────────────────────

function DealsPanel({ contactId }: { contactId: string }) {
  const { data: participants, isLoading } = useContactParticipants(contactId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!participants?.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No associated deals
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p) => (
        <div key={p.id} className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
          {p.deals ? (
            <Link href={`/deals/${p.deal_id}`} className="text-sm font-medium text-blue-600 hover:underline block truncate">
              {p.deals.name}
            </Link>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">Unknown Deal</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {p.commitment_amount != null && (
              <span className="text-xs font-medium tabular-nums">{formatCurrency(p.commitment_amount)}</span>
            )}
            {p.deals?.stage && (
              <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium", STAGE_BADGE_CLASSES[p.deals.stage] ?? "bg-gray-100 text-gray-700")}>
                {p.deals.stage}
              </span>
            )}
          </div>
          {p.role && <p className="text-xs text-muted-foreground mt-0.5">{p.role}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── Right Column: Attachments Panel ────────────────────────────────────────────

function AttachmentsPanel({ contactId }: { contactId: string }) {
  const { data: files, isLoading } = useFiles({ contactId });
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      await uploadFile.mutateAsync({ file, contactId });
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
          dragging ? "border-blue-400 bg-blue-50" : "border-slate-200"
        )}
      >
        <p className="text-xs text-muted-foreground">
          Drag & drop files here
        </p>
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
              { file: targetFile, params: { contactId } },
              { onSuccess: () => setDeleteTarget(null) }
            );
          }
        }}
      />
    </div>
  );
}

// ─── Quick Action Buttons ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { type: "Note", icon: FileText, label: "Note" },
  { type: "Email", icon: Mail, label: "Email" },
  { type: "Call", icon: Phone, label: "Call" },
  { type: "Meeting", icon: Users, label: "Meeting" },
] as const;

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function ContactDetailPage({ params }: Props) {
  const { id } = params;
  const { data: contact, isLoading } = useContact(id);
  const [logOpen, setLogOpen] = React.useState(false);
  const [logType, setLogType] = React.useState<string | undefined>();
  const [activityTypeFilter, setActivityTypeFilter] = React.useState<string>("");
  const [activitySearch, setActivitySearch] = React.useState("");

  const openLog = (type?: string) => {
    setLogType(type);
    setLogOpen(true);
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[30%_1fr_20%]">
          <div className="space-y-4 rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-20 rounded-full" />
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

  if (!contact) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <EmptyState title="Contact not found" description="This contact may have been deleted." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back link */}
      <div className="px-6 pt-4 pb-2">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Contacts
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="px-6 pb-6 grid grid-cols-1 gap-5 lg:grid-cols-[30%_1fr_20%]">
        {/* ─── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
            <ContactSummaryPanel contactId={id} />
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</p>
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

        {/* ─── CENTER COLUMN ───────────────────────────────────────────────── */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 min-h-[500px]">
          <Tabs defaultValue="activity">
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <TabsList className="h-9 gap-0.5 bg-slate-100 p-1 rounded-lg flex-wrap">
                  {[
                    { value: "activity", label: "Activity" },
                    { value: "notes", label: "Notes" },
                    { value: "emails", label: "Emails" },
                    { value: "calls", label: "Calls" },
                    { value: "meetings", label: "Meetings" },
                    { value: "deal-participants", label: "Deal Participants" },
                    { value: "nda-tracking", label: "NDA Tracking" },
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
                <Button size="sm" onClick={() => openLog()} className="shrink-0 bg-[hsl(220,70%,22%)] hover:bg-[hsl(220,70%,28%)]">
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
                  onValueChange={(v) => setActivityTypeFilter(v === "all" ? "" : v ?? "")}
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
                contactId={id}
                typeFilter={activityTypeFilter || undefined}
                search={activitySearch || undefined}
                onLogActivity={() => openLog()}
              />
            </TabsContent>

            {/* Filtered tabs for Notes, Emails, Calls, Meetings */}
            <TabsContent value="notes" className="mt-0">
              <ActivityFeed
                contactId={id}
                typeFilter="Note"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Note")}
              />
            </TabsContent>
            <TabsContent value="emails" className="mt-0">
              <ActivityFeed
                contactId={id}
                typeFilter="Email"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Email")}
              />
            </TabsContent>
            <TabsContent value="calls" className="mt-0">
              <ActivityFeed
                contactId={id}
                typeFilter="Call"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Call")}
              />
            </TabsContent>
            <TabsContent value="meetings" className="mt-0">
              <ActivityFeed
                contactId={id}
                typeFilter="Meeting"
                search={activitySearch || undefined}
                onLogActivity={() => openLog("Meeting")}
              />
            </TabsContent>

            {/* Deal Participants Tab */}
            <TabsContent value="deal-participants" className="mt-0">
              <ContactDealsTab contactId={id} />
            </TabsContent>

            {/* NDA Tracking Tab */}
            <TabsContent value="nda-tracking" className="mt-0">
              <ContactNdaTab contactId={id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Companies */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">Companies</p>
            </div>
            <CompaniesPanel contact={contact} />
          </div>

          {/* Deals */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">Deals</p>
            </div>
            <DealsPanel contactId={id} />
          </div>

          {/* Attachments */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">Attachments</p>
              <button
                type="button"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>("#contact-file-upload");
                  input?.click();
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>
            <AttachmentsPanel contactId={id} />
          </div>
        </div>
      </div>

      <LogActivityDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        contactId={id}
        defaultType={logType}
      />
    </div>
  );
}
