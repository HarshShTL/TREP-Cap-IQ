"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldManagerTab } from "@/components/settings/field-manager-tab";
import { PipelineStagesTab } from "@/components/settings/pipeline-stages-tab";
import { UserManagementTab } from "@/components/settings/user-management-tab";
import { useIsAdmin } from "@/hooks/use-profile";
import {
  Users,
  GitBranch,
  FileText,
  Contact,
  Building2,
  Settings,
} from "lucide-react";

const TABS = [
  { value: "users", label: "User Management", icon: Users },
  { value: "pipeline", label: "Pipeline Stages", icon: GitBranch },
  { value: "deal-fields", label: "Deal Fields", icon: FileText },
  { value: "contact-fields", label: "Contact Fields", icon: Contact },
  { value: "company-fields", label: "Company Fields", icon: Building2 },
] as const;

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
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="-m-6 md:-m-7 min-h-[calc(100vh-4rem)]">
      <Tabs defaultValue="users" orientation="vertical">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Vertical sidebar nav */}
          <div className="w-56 shrink-0 border-r border-border bg-muted/30">
            <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
              <Settings className="size-5 text-muted-foreground" />
              <h1 className="text-base font-semibold tracking-tight">Settings</h1>
            </div>
            <TabsList
              variant="line"
              className="flex w-full flex-col items-stretch gap-0.5 bg-transparent p-2"
            >
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="justify-start gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm data-active:after:opacity-0"
                >
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="users" className="mt-0 h-full">
              <UserManagementTab />
            </TabsContent>
            <TabsContent value="pipeline" className="mt-0 h-full">
              <PipelineStagesTab />
            </TabsContent>
            <TabsContent value="deal-fields" className="mt-0 h-full">
              <FieldManagerTab entityType="deal" />
            </TabsContent>
            <TabsContent value="contact-fields" className="mt-0 h-full">
              <FieldManagerTab entityType="contact" />
            </TabsContent>
            <TabsContent value="company-fields" className="mt-0 h-full">
              <FieldManagerTab entityType="company" />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
