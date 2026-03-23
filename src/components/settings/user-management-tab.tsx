"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  ArrowUpDown,
  RotateCw,
  X,
  Mail,
  Clock,
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { useProfile } from "@/hooks/use-profile";
import { cn, formatDate } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

type SortField = "full_name" | "email" | "role" | "is_active" | "last_sign_in_at" | "created_at";

/* ─── Constants ───────────────────────────────────────────────────────────── */

const ROLE_BADGE: Record<string, string> = {
  super_admin: "bg-amber-600 text-white",
  user: "bg-blue-100 text-blue-800 border border-blue-200",
  read_only: "bg-slate-100 text-slate-600 border border-slate-200",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  user: "User",
  read_only: "Read Only",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  deactivated: "bg-red-100 text-red-600",
};

const ROLES_INFO = [
  {
    name: "Super Admin",
    icon: Shield,
    description: "Full access to all features including user management, settings, and all data.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    name: "User",
    icon: Users,
    description: "Can create, edit, and manage deals, contacts, companies, and activities.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    name: "Read Only",
    icon: Eye,
    description: "View-only access to all data. Can export but cannot create, edit, or delete records.",
    color: "text-slate-600 bg-slate-50",
  },
];

/* ─── Main Component ──────────────────────────────────────────────────────── */

export function UserManagementTab() {
  const { data: currentProfile } = useProfile();
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("created_at");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [deactivateTarget, setDeactivateTarget] = React.useState<UserRow | null>(null);
  const [deactivating, setDeactivating] = React.useState(false);
  const [rolesExpanded, setRolesExpanded] = React.useState(false);
  const [invitesExpanded, setInvitesExpanded] = React.useState(true);

  const fetchUsers = React.useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
    }
  }, []);

  const fetchInvites = React.useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("invites")
      .select("id, email, role, accepted_at, expires_at, created_at")
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    setInvites((data ?? []) as Invite[]);
  }, []);

  React.useEffect(() => {
    Promise.all([fetchUsers(), fetchInvites()]).finally(() => setLoading(false));
  }, [fetchUsers, fetchInvites]);

  /* Sort + filter */
  const filteredUsers = React.useMemo(() => {
    const q = search.toLowerCase();
    let filtered = users;
    if (q) {
      filtered = users.filter(
        (u) =>
          (u.full_name ?? "").toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortField] ?? "") as string;
      const bVal = (b[sortField] ?? "") as string;
      const cmp = aVal.localeCompare(bVal);
      return sortAsc ? cmp : -cmp;
    });
  }, [users, search, sortField, sortAsc]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  /* Role change */
  async function handleRoleChange(userId: string, role: string) {
    const res = await fetch("/api/admin/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.success("Role updated");
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to update role");
    }
  }

  /* Deactivate / reactivate */
  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setDeactivating(true);
    const newActive = !deactivateTarget.is_active;
    const res = await fetch("/api/admin/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: deactivateTarget.id, active: newActive }),
    });
    setDeactivating(false);
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === deactivateTarget.id ? { ...u, is_active: newActive } : u)),
      );
      toast.success(newActive ? "User reactivated" : "User deactivated");
      setDeactivateTarget(null);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to update user");
    }
  }

  /* Invite handlers */
  async function handleInviteSubmit(firstName: string, lastName: string, email: string, role: string) {
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, firstName, lastName }),
    });
    if (res.ok) {
      toast.success(`Invite sent to ${email}`);
      setInviteOpen(false);
      fetchInvites();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to send invite");
    }
  }

  async function handleResendInvite(inviteId: string) {
    const res = await fetch("/api/admin/invite", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId }),
    });
    if (res.ok) {
      toast.success("Invite resent");
      fetchInvites();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to resend invite");
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    const res = await fetch("/api/admin/invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId }),
    });
    if (res.ok) {
      toast.success("Invite revoked");
      fetchInvites();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to revoke invite");
    }
  }

  /* Column header helper */
  function SortHeader({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 text-left"
      >
        {children}
        <ArrowUpDown className={cn("size-3", sortField === field ? "text-foreground" : "text-muted-foreground/50")} />
      </button>
    );
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/40" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">User Management</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage team access and invite new members
        </p>
      </div>

      {/* Roles info banner — collapsible */}
      <div className="rounded-lg border border-border bg-muted/20">
        <button
          type="button"
          onClick={() => setRolesExpanded(!rolesExpanded)}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="size-4" />
          Roles & Permissions
          {rolesExpanded ? (
            <ChevronDown className="size-4 ml-auto" />
          ) : (
            <ChevronRight className="size-4 ml-auto" />
          )}
        </button>
        {rolesExpanded && (
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {ROLES_INFO.map(({ name, icon: Icon, description, color }) => (
              <div key={name} className="flex gap-3 items-start">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", color)}>
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <UserPlus className="mr-2 size-4" />
          Invite User
        </Button>
      </div>

      {/* User table */}
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="full_name">User</SortHeader>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="role">Role</SortHeader>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="is_active">Status</SortHeader>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="last_sign_in_at">Last Sign In</SortHeader>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="created_at">Joined</SortHeader>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user, idx) => {
              const isSelf = user.id === currentProfile?.id;
              return (
                <tr
                  key={user.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    idx % 2 === 1 && "bg-muted/15",
                  )}
                >
                  {/* User column — avatar + name + email stacked */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <EntityAvatar
                        name={user.full_name ?? user.email}
                        type="contact"
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {user.full_name ?? "Unknown"}
                          </p>
                          {isSelf && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          ROLE_BADGE[user.role] ?? ROLE_BADGE.user,
                        )}
                      >
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    ) : (
                      <Select
                        value={user.role}
                        onValueChange={(v: string) => handleRoleChange(user.id, v)}
                      >
                        <SelectTrigger className="h-7 w-[130px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="read_only">Read Only</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        user.is_active ? STATUS_BADGE.active : STATUS_BADGE.deactivated,
                      )}
                    >
                      {user.is_active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  {/* Last Sign In */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Never"}
                  </td>
                  {/* Joined */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(user.created_at)}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 text-xs",
                          user.is_active
                            ? "text-destructive hover:text-destructive"
                            : "text-emerald-600 hover:text-emerald-700",
                        )}
                        onClick={() => setDeactivateTarget(user)}
                      >
                        {user.is_active ? "Deactivate" : "Reactivate"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {search ? "No users match your search." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pending invites — collapsible */}
      {invites.length > 0 && (
        <div className="rounded-xl border border-dashed border-border shadow-sm">
          <button
            type="button"
            onClick={() => setInvitesExpanded(!invitesExpanded)}
            className="flex w-full items-center gap-2 px-5 py-3 text-sm font-medium hover:bg-muted/30 transition-colors rounded-t-xl"
          >
            <Clock className="size-4 text-muted-foreground" />
            Pending Invites
            <Badge variant="secondary" className="ml-1 text-xs">{invites.length}</Badge>
            {invitesExpanded ? (
              <ChevronDown className="size-4 ml-auto text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 ml-auto text-muted-foreground" />
            )}
          </button>
          {invitesExpanded && (
            <div className="divide-y divide-border border-t border-border">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                >
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <span className="font-medium truncate min-w-0">{inv.email}</span>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      ROLE_BADGE[inv.role] ?? ROLE_BADGE.user,
                    )}
                  >
                    {ROLE_LABELS[inv.role] ?? inv.role}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                    Sent {formatDate(inv.created_at)}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    Expires {formatDate(inv.expires_at)}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleResendInvite(inv.id)}
                    >
                      <RotateCw className="mr-1 size-3" />
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => handleRevokeInvite(inv.id)}
                    >
                      <X className="mr-1 size-3" />
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite dialog */}
      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInviteSubmit}
      />

      {/* Deactivate confirmation */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => { if (!open) setDeactivateTarget(null); }}
        title={deactivateTarget?.is_active ? "Deactivate user?" : "Reactivate user?"}
        description={
          deactivateTarget?.is_active
            ? `${deactivateTarget.full_name ?? deactivateTarget.email} will no longer be able to sign in.`
            : `${deactivateTarget?.full_name ?? deactivateTarget?.email} will be able to sign in again.`
        }
        confirmLabel={deactivateTarget?.is_active ? "Deactivate" : "Reactivate"}
        loading={deactivating}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}

/* ─── Invite Dialog ───────────────────────────────────────────────────────── */

function InviteDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (firstName: string, lastName: string, email: string, role: string) => Promise<void>;
}) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("user");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await onSubmit(firstName, lastName, email, role);
    setSubmitting(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("user");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an email invitation to join the workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First Name</label>
              <Input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                placeholder="Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email address *</label>
            <Input
              type="email"
              placeholder="colleague@timberlinerep.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="read_only">Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !email}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
