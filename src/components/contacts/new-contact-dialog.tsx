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
import { useCreateContact } from "@/hooks/use-contacts";
import type { ContactInsert } from "@/types";
import { useProfiles } from "@/hooks/use-profile";
import {
  LEAD_STATUSES,
  CAPITAL_TYPES,
  ASSET_CLASSES,
  REGIONS,
  INVESTMENT_STRATEGIES,
  RELATIONSHIP_TYPES,
  DATABASE_SOURCES,
} from "@/lib/constants";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  company_name: z.string().optional(),
  lead_status: z.string().optional(),
  relationship: z.string().optional(),
  capital_type: z.string().optional(),
  asset_class: z.string().optional(),
  region: z.string().optional(),
  investment_strategy: z.string().optional(),
  next_steps: z.string().optional(),
  contact_owner: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  database_source: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NewContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewContactDialog({ open, onOpenChange }: NewContactDialogProps) {
  const createContact = useCreateContact();
  const { data: profiles = [] } = useProfiles();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = (values: FormValues) => {
    const contact: ContactInsert = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      job_title: values.job_title || undefined,
      company_name: values.company_name || undefined,
      lead_status: (values.lead_status || undefined) as ContactInsert["lead_status"],
      capital_type: (values.capital_type || undefined) as ContactInsert["capital_type"],
      investment_strategy: (values.investment_strategy || undefined) as ContactInsert["investment_strategy"],
      region: (values.region || undefined) as ContactInsert["region"],
      asset_class: (values.asset_class || undefined) as ContactInsert["asset_class"],
      relationship: (values.relationship || undefined) as ContactInsert["relationship"],
      database_source: (values.database_source || undefined) as ContactInsert["database_source"],
      next_steps: values.next_steps || undefined,
      contact_owner: values.contact_owner || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
    };
    createContact.mutate(
      contact,
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
            <DialogTitle>New Contact</DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                <Input {...register("first_name")} placeholder="Jane" />
                {errors.first_name && (
                  <p className="text-xs text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Last Name *</label>
                <Input {...register("last_name")} placeholder="Smith" />
                {errors.last_name && (
                  <p className="text-xs text-destructive">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input {...register("email")} type="email" placeholder="jane@example.com" />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            {/* Job / Company */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                <Controller
                  name="job_title"
                  control={control}
                  render={({ field }) => (
                    <AutofillInput
                      table="contacts"
                      column="job_title"
                      placeholder="Managing Director"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Company</label>
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field }) => (
                    <AutofillInput
                      table="contacts"
                      column="company_name"
                      placeholder="Acme Capital"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Lead Status / Relationship */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Lead Status</label>
                <Controller
                  name="lead_status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Relationship</label>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_TYPES.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Capital Type / Asset Class */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Capital Type</label>
                <Controller
                  name="capital_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAPITAL_TYPES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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

            {/* Region / Strategy */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Region</label>
                <Controller
                  name="region"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Investment Strategy</label>
                <Controller
                  name="investment_strategy"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {INVESTMENT_STRATEGIES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* City / State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">City</label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <AutofillInput
                      table="contacts"
                      column="city"
                      placeholder="New York"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">State</label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <AutofillInput
                      table="contacts"
                      column="state"
                      placeholder="NY"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Contact Owner / Database Source */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Contact Owner</label>
                <Controller
                  name="contact_owner"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to…" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.full_name ?? p.id}>
                            {p.full_name ?? p.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Database Source</label>
                <Controller
                  name="database_source"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATABASE_SOURCES.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Next Steps</label>
              <Textarea
                {...register("next_steps")}
                placeholder="What's the next action?"
                rows={3}
                className="resize-none"
              />
            </div>

          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={createContact.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createContact.isPending}>
              {createContact.isPending ? "Creating…" : "Create Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
