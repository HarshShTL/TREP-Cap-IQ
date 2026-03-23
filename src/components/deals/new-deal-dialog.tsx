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
import { useProfiles } from "@/hooks/use-profile";
import {
  DEAL_STAGES,
  PRIORITIES,
  DEAL_TYPES,
  ASSET_CLASSES,
} from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Deal name is required"),
  stage: z.string().min(1, "Stage is required"),
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
  const { data: profiles = [] } = useProfiles();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
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
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-5 pr-1">
            {/* ── Required ── */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Required
              </p>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Deal Name <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="Enter deal name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stage <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    name="stage"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DEAL_STAGES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.stage && (
                    <p className="text-xs text-destructive">
                      {errors.stage.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Priority
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITIES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* ── Deal Details ── */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Deal Details
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    {...register("amount")}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Deal Type
                  </label>
                  <Controller
                    name="deal_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DEAL_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Location
                  </label>
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
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Asset Class
                  </label>
                  <Controller
                    name="asset_class"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSET_CLASSES.map((a) => (
                            <SelectItem key={a} value={a}>
                              {a}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Expected Close Date
                </label>
                <Input
                  type="date"
                  {...register("expected_close_date")}
                />
              </div>
            </section>

            {/* ── Team ── */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Team
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Deal Owner
                  </label>
                  <Controller
                    name="deal_owner"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.full_name ?? p.id}
                            >
                              {p.full_name ?? p.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Collaborator
                  </label>
                  <Controller
                    name="deal_collaborator"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.full_name ?? p.id}
                            >
                              {p.full_name ?? p.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* ── Notes ── */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </p>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Deal notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </section>
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
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={createDeal.isPending}
            >
              {createDeal.isPending ? "Creating..." : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
