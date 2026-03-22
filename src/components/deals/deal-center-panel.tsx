"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { DealParticipantsTab } from "./deal-participants-tab";
import { NdaTrackingTab } from "./nda-tracking-tab";

interface DealCenterPanelProps {
  dealId: string;
}

export function DealCenterPanel({ dealId }: DealCenterPanelProps) {
  const [logOpen, setLogOpen] = React.useState(false);

  return (
    <>
      <Tabs defaultValue="activities">
        <div className="mb-4 flex items-center justify-between">
          <TabsList className="h-9 gap-1 bg-muted/50 p-1">
            <TabsTrigger value="activities" className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none">Activities</TabsTrigger>
            <TabsTrigger value="participants" className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none">Participants</TabsTrigger>
            <TabsTrigger value="nda" className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none">NDA Tracking</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Log Activity
          </Button>
        </div>
        <TabsContent value="activities" className="mt-0">
          <ActivityFeed dealId={dealId} onLogActivity={() => setLogOpen(true)} />
        </TabsContent>
        <TabsContent value="participants" className="mt-0">
          <DealParticipantsTab dealId={dealId} />
        </TabsContent>
        <TabsContent value="nda" className="mt-0">
          <NdaTrackingTab dealId={dealId} />
        </TabsContent>
      </Tabs>

      <LogActivityDialog open={logOpen} onOpenChange={setLogOpen} dealId={dealId} />
    </>
  );
}
