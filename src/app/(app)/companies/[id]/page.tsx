"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  FileText,
  Mail,
  Phone,
  Users,
  MoreHorizontal,
  Shield,
  File,
  Search,
  Trash2,
  Loader2,
  Building2,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { CompanySummaryPanel } from "@/components/companies/company-summary-panel";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { useCompany, useCompanyContacts } from "@/hooks/use-companies";
import { useContactParticipants } from "@/hooks/use-deal-participants";
import { useFiles, useUploadFile, useDeleteFile, getFileSignedUrl } from "@/hooks/use-files";
import {
  formatCurrency,
  formatFileSize,
  STAGE_BADGE_CLASSES,
  LEAD_STATUS_BADGE_CLASSES,
  PARTICIPANT_STATUS_BADGE_CLASSES,
  ACTIVITY_TYPES,
} from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import type { Contact } from "@/types";

type Props = { params: { id: string } };

/* ═══ QUICK ACTIONS ═══════════════════════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { type: "Note", icon: FileText, label: "Note" },
  { type: "Email", icon: Mail, label: "Email" },
  { type: "Call", icon: Phone, label: "Call" },
  { type: "Meeting", icon: Users, label: "Meeting" },
] as const;

/* ═══ SUMMARY STATS ══════════════════════════════════════════════════════════ */

function SummaryStats({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
        <UserCheck className="size-4 text-slate-400 mx-auto mb-1" />
        <p className="text-lg font-bold tabular-nums">{contacts.length}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Contacts</p>
      </div>
    </div>
  );
}

/* ═══ CENTER: CONTACTS TAB ═══════════════════════════════════════════════════ */

function CompanyContactsTab({ companyId }: { companyId: string }) {
  const { data: contacts, isLoading } = useCompanyContacts(companyId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!contacts?.length) {
    return (
      <EmptyState
        title="No contacts"
        description="No contacts are linked to this company yet."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-100">
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Lead Status</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="hover:bg-slate-50 transition-colors border-b border-slate-100"
          >
            <TableCell className="py-3.5">
              <div className="flex items-center gap-2">
                <EntityAvatar
                  name={`${contact.first_name} ${contact.last_name}`}
                  type="contact"
                  size="sm"
                />
                <Link
                  href={`/contacts/${contact.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {contact.first_name} {contact.last_name}
                </Link>
              </div>
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.job_title ?? "—"}
            </TableCell>
            <TableCell className="py-3.5">
              {contact.lead_status ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {contact.lead_status}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              ) : "—"}
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.phone ? (
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              ) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ═══ CENTER: DEAL PARTICIPATION TAB ═════════════════════════════════════════ */

function CompanyDealParticipantsTab({ contacts }: { contacts: Contact[] }) {
  if (!contacts.length) {
    return (
      <EmptyState
        title="No deal participation"
        description="Contacts from this company have not been added to any deals yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <ContactDealRows key={contact.id} contact={contact} />
      ))}
    </div>
  );
}

function ContactDealRows({ contact }: { contact: Contact }) {
  const { data: participants, isLoading } = useContactParticipants(contact.id);

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (!participants?.length) return null;

  return (
    <>
      {participants.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
        >
          <EntityAvatar
            name={`${contact.first_name} ${contact.last_name}`}
            type="contact"
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/contacts/${contact.id}`}
                className="text-sm font-medium text-blue-600 hover:underline truncate"
              >
                {contact.first_name} {contact.last_name}
              </Link>
              {p.role && (
                <span className="text-xs text-muted-foreground">{p.role}</span>
              )}
            </div>
            {p.deals && (
              <Link
                href={`/deals/${p.deal_id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                {p.deals.name}
              </Link>
            )}
          </div>
          {p.deals?.stage && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                STAGE_BADGE_CLASSES[p.deals.stage] ?? "bg-gray-100 text-gray-700",
              )}
            >
              {p.deals.stage}
            </span>
          )}
          {p.status && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                PARTICIPANT_STATUS_BADGE_CLASSES[p.status] ?? "bg-gray-100 text-gray-600",
              )}
            >
              {p.status}
            </span>
          )}
          {p.commitment_amount != null && (
            <span className="text-xs font-medium tabular-nums shrink-0">
              {formatCurrency(p.commitment_amount)}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

/* ═══ CENTER: NDA TRACKING TAB ═══════════════════════════════════════════════ */

function CompanyNdaTab({ contacts }: { contacts: Contact[] }) {
  if (!contacts.length) {
    return (
      <EmptyState
        title="No NDAs tracked"
        description="NDA tracking information will appear here when deal participants have NDA dates recorded."
      />
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <ContactNdaRows key={contact.id} contact={contact} />
      ))}
    </div>
  );
}

function ContactNdaRows({ contact }: { contact: Contact }) {
  const { data: participants } = useContactParticipants(contact.id);
  const withNda = participants?.filter((p) => p.nda_sent_date || p.nda_signed_date) ?? [];

  if (!withNda.length) return null;

  return (
    <>
      {withNda.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/contacts/${contact.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {contact.first_name} {contact.last_name}
            </Link>
            {p.deals && (
              <p className="text-xs text-muted-foreground">{p.deals.name}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs shrink-0">
            {p.nda_sent_date && (
              <span className="text-muted-foreground">
                Sent: {format(new Date(p.nda_sent_date), "MMM d, yyyy")}
              </span>
            )}
            {p.nda_signed_date && (
              <span className="text-muted-foreground">
                Signed: {format(new Date(p.nda_signed_date), "MMM d, yyyy")}
              </span>
            )}
            {p.nda_signed_date ? (
              <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100">
                <Shield className="size-3" /> Signed
              </Badge>
            ) : p.nda_sent_date ? (
              <Badge variant="secondary" className="gap-1 text-amber-700 bg-amber-100">
                <Shield className="size-3" /> Sent
              </Badge>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

/* ═══ RIGHT COLUMN: CONTACTS PANEL ═══════════════════════════════════════════ */

function ContactsPanel({ contacts, loading }: { contacts: Contact[]; loading: boolean }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [contacts, search]);

  if (loading) {
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
        No contacts linked
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
              {c.job_title && (
                <p className="text-xs text-muted-foreground truncate">{c.job_title}</p>
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
              {c.phone && (
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600"
                >
                  <Phone className="size-3" />
                  {c.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ RIGHT COLUMN: DEALS PANEL ══════════════════════════════════════════════ */

function DealsPanel({ contacts }: { contacts: Contact[] }) {
  if (!contacts.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No associated deals
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.slice(0, 5).map((contact) => (
        <ContactDealCards key={contact.id} contactId={contact.id} />
      ))}
    </div>
  );
}

function ContactDealCards({ contactId }: { contactId: string }) {
  const { data: participants } = useContactParticipants(contactId);

  if (!participants?.length) return null;

  // Deduplicate deals
  const seenDeals = new Set<string>();

  return (
    <>
      {participants
        .filter((p) => {
          if (!p.deals || seenDeals.has(p.deal_id)) return false;
          seenDeals.add(p.deal_id);
          return true;
        })
        .map((p) => (
          <div key={p.id} className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
            <Link
              href={`/deals/${p.deal_id}`}
              className="text-sm font-medium text-blue-600 hover:underline block truncate"
            >
              {p.deals!.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {p.commitment_amount != null && (
                <span className="text-xs font-medium tabular-nums">{formatCurrency(p.commitment_amount)}</span>
              )}
              {p.deals?.stage && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    STAGE_BADGE_CLASSES[p.deals.stage] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {p.deals.stage}
                </span>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

/* ═══ RIGHT COLUMN: ATTACHMENTS PANEL ════════════════════════════════════════ */

function AttachmentsPanel({ companyId }: { companyId: string }) {
  const { data: files, isLoading } = useFiles({ companyId });
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      await uploadFile.mutateAsync({ file, companyId });
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
              { file: targetFile, params: { companyId } },
              { onSuccess: () => setDeleteTarget(null) },
            );
          }
        }}
      />
    </div>
  );
}

/* ═══ MAIN PAGE ══════════════════════════════════════════════════════════════ */

export default function CompanyDetailPage({ params }: Props) {
  const { id } = params;
  const { data: company, isLoading } = useCompany(id);
  const { data: contacts = [], isLoading: contactsLoading } = useCompanyContacts(id);
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

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <EmptyState title="Company not found" description="This company may have been deleted." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back link */}
      <div className="px-6 pt-4 pb-2">
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Companies
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="px-6 pb-6 grid grid-cols-1 gap-5 lg:grid-cols-[30%_1fr_20%]">
        {/* ─── LEFT COLUMN ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Company Header Card */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="size-14 rounded-xl bg-[hsl(220,70%,22%)] flex items-center justify-center">
                <Building2 className="size-7 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {company.name}
              </h1>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  {company.domain ?? company.website}
                </a>
              )}
              {company.company_type && (
                <Badge variant="secondary" className="text-xs">
                  {company.company_type}
                </Badge>
              )}
            </div>

            {/* Summary stats */}
            <SummaryStats contacts={contacts} />

            {/* Quick Actions */}
            <div className="border-t border-slate-100 pt-4 mt-4">
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

          {/* Company Summary Panel */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
            <CompanySummaryPanel companyId={id} />
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
                    { value: "contacts", label: "Contacts" },
                    { value: "deal-participation", label: "Deal Participants" },
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

            {/* Activities Tab */}
            <TabsContent value="activity" className="mt-0">
              <ActivityFeed
                companyId={id}
                typeFilter={activityTypeFilter || undefined}
                search={activitySearch || undefined}
                onLogActivity={() => openLog()}
              />
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="mt-0">
              <CompanyContactsTab companyId={id} />
            </TabsContent>

            {/* Deal Participation Tab */}
            <TabsContent value="deal-participation" className="mt-0">
              <CompanyDealParticipantsTab contacts={contacts} />
            </TabsContent>

            {/* NDA Tracking Tab */}
            <TabsContent value="nda" className="mt-0">
              <CompanyNdaTab contacts={contacts} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Contacts */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">
                Contacts ({contacts.length})
              </p>
            </div>
            <ContactsPanel contacts={contacts} loading={contactsLoading} />
          </div>

          {/* Deals */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(220,70%,22%)]">
                Deals
              </p>
            </div>
            <DealsPanel contacts={contacts} />
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
                  const input = document.querySelector<HTMLInputElement>("#company-file-upload");
                  input?.click();
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>
            <AttachmentsPanel companyId={id} />
          </div>
        </div>
      </div>

      <LogActivityDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        companyId={id}
        defaultType={logType}
      />
    </div>
  );
}
