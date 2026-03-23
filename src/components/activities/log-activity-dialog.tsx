"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateActivity } from "@/hooks/use-activities";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { ActivityType } from "@/types";

const schema = z.object({
  type: z.string().min(1),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().optional(),
  date: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LogActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId?: string;
  contactId?: string;
  companyId?: string;
  defaultType?: string;
}

export function LogActivityDialog({
  open,
  onOpenChange,
  dealId,
  contactId,
  companyId: _companyId,
  defaultType,
}: LogActivityDialogProps) {
  void _companyId; // reserved for future company_id column
  const createActivity = useCreateActivity();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: defaultType || "Note" },
  });

  const typeValue = watch("type");

  const onSubmit = async (data: FormData) => {
    await createActivity.mutateAsync({
      type: data.type as ActivityType,
      subject: data.subject,
      body: data.body || undefined,
      date: data.date || undefined,
      deal_id: dealId,
      contact_id: contactId,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <Select value={typeValue} onValueChange={(v: string) => setValue("type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject *</label>
            <Input {...register("subject")} placeholder="e.g. Follow-up call with investor" />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              {...register("body")}
              placeholder="Add notes..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" {...register("date")} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createActivity.isPending}>
              {createActivity.isPending ? "Logging…" : "Log Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
