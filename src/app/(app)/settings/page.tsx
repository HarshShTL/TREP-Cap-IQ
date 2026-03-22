"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { FieldManagerTab } from "@/components/settings/field-manager-tab";
import { PipelineStagesTab } from "@/components/settings/pipeline-stages-tab";
import { useIsAdmin } from "@/hooks/use-profile";

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
    <div className="space-y-4">
      <PageHeader title="Settings" description="Manage pipeline stages, custom fields, and workspace configuration" />

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
