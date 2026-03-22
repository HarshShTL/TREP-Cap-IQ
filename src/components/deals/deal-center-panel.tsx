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
      <Tabs defaultValue="activities" className="flex flex-col h-full">
        <div className="mb-4 flex items-center gap-3">
          <TabsList className="flex w-full gap-1 rounded-full bg-muted/50 p-1">
            <TabsTrigger
              value="activities"
              className="flex-1 rounded-full px-4 py-2 text-sm font-medium data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="flex-1 rounded-full px-4 py-2 text-sm font-medium data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
            >
              Participants
            </TabsTrigger>
            <TabsTrigger
              value="nda"
              className="flex-1 rounded-full px-4 py-2 text-sm font-medium data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
            >
              NDA Tracking
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="shrink-0" onClick={() => setLogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Log Activity
          </Button>
        </div>

        <TabsContent value="activities" className="mt-0 flex-1">
          <ActivityFeed dealId={dealId} onLogActivity={() => setLogOpen(true)} />
        </TabsContent>
        <TabsContent value="participants" className="mt-0 flex-1">
          <DealParticipantsTab dealId={dealId} />
        </TabsContent>
        <TabsContent value="nda" className="mt-0 flex-1">
          <NdaTrackingTab dealId={dealId} />
        </TabsContent>
      </Tabs>

      <LogActivityDialog open={logOpen} onOpenChange={setLogOpen} dealId={dealId} />
    </>
  );
}
