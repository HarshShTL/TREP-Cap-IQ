"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { FieldManagerTab } from "@/components/settings/field-manager-tab";
import { PipelineStagesTab } from "@/components/settings/pipeline-stages-tab";
import { useIsAdmin, useProfiles } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Shield, Users, Eye } from "lucide-react";

const ROLE_BADGE_CLASSES: Record<string, string> = {
  super_admin: "bg-amber-50 text-amber-700 border border-amber-200",
  user: "bg-blue-50 text-blue-700 border border-blue-200",
  read_only: "bg-slate-50 text-slate-600 border border-slate-200",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  user: "User",
  read_only: "Read Only",
};

function TeamMembersCard() {
  const { data: profiles = [], isLoading } = useProfiles();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <EntityAvatar
                name={profile.full_name ?? "?"}
                type="contact"
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {profile.full_name ?? "Unknown"}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  ROLE_BADGE_CLASSES[profile.role] ?? ROLE_BADGE_CLASSES.user,
                )}
              >
                {ROLE_LABELS[profile.role] ?? "User"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RolesCard() {
  const roles = [
    {
      name: "Super Admin",
      icon: Shield,
      description:
        "Full access to all features including user management, settings, and all data. Can invite team members and configure pipeline.",
      color: "text-amber-600 bg-amber-50",
    },
    {
      name: "User",
      icon: Users,
      description:
        "Can create, edit, and manage deals, contacts, companies, and activities. Cannot access settings or manage users.",
      color: "text-blue-600 bg-blue-50",
    },
    {
      name: "Read Only",
      icon: Eye,
      description:
        "View-only access to all data. Cannot create, edit, or delete any records. Can export data.",
      color: "text-slate-600 bg-slate-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Permissions & Roles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roles.map(({ name, icon: Icon, description, color }) => (
          <div key={name} className="flex gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                color,
              )}
            >
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  React.useEffect(() => {
    if (isAdmin === false) {
      router.replace("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage pipeline stages, custom fields, and workspace configuration"
      />

      {/* Team + Roles cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TeamMembersCard />
        <RolesCard />
      </div>

      {/* Field configuration tabs */}
      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger>
          <TabsTrigger value="deal-fields">Deal Fields</TabsTrigger>
          <TabsTrigger value="contact-fields">Contact Fields</TabsTrigger>
          <TabsTrigger value="company-fields">Company Fields</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="pipeline" className="mt-0">
            <PipelineStagesTab />
          </TabsContent>
          <TabsContent value="deal-fields" className="mt-0">
            <FieldManagerTab entityType="deal" />
          </TabsContent>
          <TabsContent value="contact-fields" className="mt-0">
            <FieldManagerTab entityType="contact" />
          </TabsContent>
          <TabsContent value="company-fields" className="mt-0">
            <FieldManagerTab entityType="company" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
