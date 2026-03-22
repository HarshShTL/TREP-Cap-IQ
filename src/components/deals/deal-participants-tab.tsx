"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  useDealParticipants,
  useAddParticipant,
  useRemoveParticipant,
} from "@/hooks/use-deal-participants";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, PARTICIPANT_ROLES, PARTICIPANT_STATUSES } from "@/lib/constants";
import type { Contact } from "@/types";

function ContactSearchResult({
  contact,
  onSelect,
}: {
  contact: Contact;
  onSelect: (c: Contact) => void;
}) {
  return (
    <button
      type="button"
      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/60"
      onClick={() => onSelect(contact)}
    >
      <span className="font-medium">
        {contact.first_name} {contact.last_name}
      </span>
      {contact.email && (
        <span className="ml-2 text-xs text-muted-foreground">{contact.email}</span>
      )}
      {contact.company_name && (
        <span className="ml-1 text-xs text-muted-foreground">· {contact.company_name}</span>
      )}
    </button>
  );
}

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId: string;
}

function AddParticipantDialog({ open, onOpenChange, dealId }: AddParticipantDialogProps) {
  const addParticipant = useAddParticipant();
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<Contact[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [role, setRole] = React.useState("Investor");
  const [status, setStatus] = React.useState("Active");
  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults([]);
      return;
    }
    if (selectedContact) return;
    let cancelled = false;
    setSearching(true);
    createClient()
      .from("contacts")
      .select("id, first_name, last_name, email, job_title, company_name")
      .or(
        `first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`
      )
      .is("deleted_at", null)
      .limit(8)
      .then(({ data }) => {
        if (!cancelled) {
          setResults((data ?? []) as unknown as Contact[]);
          setSearching(false);
        }
      })
      .catch(() => {
        if (!cancelled) setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedContact]);

  const handleSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setSearch(`${contact.first_name} ${contact.last_name}`);
    setResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedContact) return;
    await addParticipant.mutateAsync({
      deal_id: dealId,
      contact_id: selectedContact.id,
      role,
      status,
      commitment_amount: null,
      nda_sent_date: null,
      nda_signed_date: null,
      last_activity_date: null,
    });
    onOpenChange(false);
    setSearch("");
    setSelectedContact(null);
    setRole("Investor");
    setStatus("Active");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Contact *</label>
            <div className="relative">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedContact(null);
                }}
              />
              {searching && (
                <Loader2 className="absolute right-2 top-2.5 size-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {results.length > 0 && (
              <div className="max-h-48 overflow-y-auto divide-y rounded-md border">
                {results.map((c) => (
                  <ContactSearchResult key={c.id} contact={c} onSelect={handleSelect} />
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTICIPANT_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTICIPANT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedContact || addParticipant.isPending}
          >
            {addParticipant.isPending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DealParticipantsTabProps {
  dealId: string;
}

export function DealParticipantsTab({ dealId }: DealParticipantsTabProps) {
  const { data: participants, isLoading } = useDealParticipants(dealId);
  const removeParticipant = useRemoveParticipant();
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeId, setRemoveId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">
          {participants?.length ?? 0} participants
        </span>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Participant
        </Button>
      </div>

      {!participants?.length ? (
        <EmptyState
          title="No participants"
          description="Add investors, lenders, or other contacts to this deal."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add Participant
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commitment</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.contacts ? (
                    <Link
                      href={`/contacts/${p.contact_id}`}
                      className="font-medium hover:underline"
                    >
                      {p.contacts.first_name} {p.contacts.last_name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  {p.contacts?.company_name && (
                    <p className="text-xs text-muted-foreground">{p.contacts.company_name}</p>
                  )}
                </TableCell>
                <TableCell>{p.role ?? "—"}</TableCell>
                <TableCell>{p.status ?? "—"}</TableCell>
                <TableCell>
                  {p.commitment_amount != null ? formatCurrency(p.commitment_amount) : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setRemoveId(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AddParticipantDialog open={addOpen} onOpenChange={setAddOpen} dealId={dealId} />

      <ConfirmDialog
        open={!!removeId}
        onOpenChange={(open) => {
          if (!open) setRemoveId(null);
        }}
        title="Remove participant?"
        description="This will remove the contact from this deal."
        confirmLabel="Remove"
        loading={removeParticipant.isPending}
        onConfirm={() => {
          if (removeId) {
            removeParticipant.mutate(
              { id: removeId, dealId },
              { onSuccess: () => setRemoveId(null) }
            );
          }
        }}
      />
    </>
  );
}
