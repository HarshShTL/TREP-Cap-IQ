"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutofillInput } from "@/components/autofill-input";
import { useCreateDeal } from "@/hooks/use-deals";
import {
  DEAL_STAGES,
  PRIORITIES,
  DEAL_TYPES,
  ASSET_CLASSES,
} from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  stage: z.string().default("Overviews"),
  amount: z.coerce.number().optional(),
  deal_type: z.string().optional(),
  priority: z.string().optional(),
  location: z.string().optional(),
  asset_class: z.string().optional(),
  description: z.string().optional(),
  expected_close_date: z.string().optional(),
  deal_owner: z.string().optional(),
  deal_collaborator: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface NewDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStage?: string;
}

export function NewDealDialog({
  open,
  onOpenChange,
  defaultStage,
}: NewDealDialogProps) {
  const createDeal = useCreateDeal();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stage: defaultStage ?? "Overviews" },
  });

  const onSubmit = (values: FormValues) => {
    createDeal.mutate(
      {
        ...values,
        amount: values.amount ?? null,
        deal_type: values.deal_type ?? null,
        priority: values.priority ?? null,
        location: values.location ?? null,
        asset_class: values.asset_class ?? null,
        description: values.description ?? null,
        expected_close_date: values.expected_close_date ?? null,
        deal_owner: values.deal_owner ?? null,
        deal_collaborator: values.deal_collaborator ?? null,
        custom_fields: null,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>New Deal</DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Deal Name *
              </label>
              <Input {...register("name")} placeholder="Enter deal name" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Stage */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Stage</label>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEAL_STAGES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Amount ($)</label>
                <Input
                  type="number"
                  {...register("amount")}
                  placeholder="0"
                />
              </div>

              {/* Deal Type */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Deal Type</label>
                <Controller
                  name="deal_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEAL_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <AutofillInput
                      table="deals"
                      column="location"
                      placeholder="City, State"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Asset Class */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Asset Class</label>
                <Controller
                  name="asset_class"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_CLASSES.map((a) => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Expected Close Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Expected Close Date</label>
              <Input type="date" {...register("expected_close_date")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Deal Owner</label>
                <Input {...register("deal_owner")} placeholder="Name or email" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Collaborator</label>
                <Input {...register("deal_collaborator")} placeholder="Name or email" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Textarea
                {...register("description")}
                placeholder="Deal notes…"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createDeal.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createDeal.isPending}>
              {createDeal.isPending ? "Creating…" : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
