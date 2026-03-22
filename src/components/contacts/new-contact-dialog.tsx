"use client";

import * as React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutofillInput } from "@/components/autofill-input";
import { useCreateContact } from "@/hooks/use-contacts";
import {
  LEAD_STATUSES,
  CAPITAL_TYPES,
  ASSET_CLASSES,
  REGIONS,
  INVESTMENT_STRATEGIES,
} from "@/lib/constants";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  company_name: z.string().optional(),
  lead_status: z.string().optional(),
  capital_type: z.string().optional(),
  asset_class: z.string().optional(),
  region: z.string().optional(),
  investment_strategy: z.string().optional(),
  relationship: z.string().optional(),
  next_steps: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  database_source: z.string().optional(),
  contact_owner: z.string().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value || "__none__"} onValueChange={(v) => onChange(v === "__none__" ? "" : v)}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">—</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function NewContactDialog({ open, onOpenChange }: NewContactDialogProps) {
  const createContact = useCreateContact();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormData) => {
    await createContact.mutateAsync({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || null,
      phone: data.phone || null,
      job_title: data.job_title || null,
      company_name: data.company_name || null,
      company_id: null,
      lead_status: data.lead_status || null,
      capital_type: data.capital_type || null,
      family_office: null,
      institutional: null,
      retail: null,
      indirect: null,
      ownership: null,
      investment_strategy: data.investment_strategy || null,
      region: data.region || null,
      asset_class: data.asset_class || null,
      relationship: data.relationship || null,
      next_steps: data.next_steps || null,
      database_source: data.database_source || null,
      email_verification: null,
      trep_capital_type_prior_outreach: null,
      trep_deal_prior_outreach: null,
      contact_owner: data.contact_owner || null,
      street_address: data.street_address || null,
      city: data.city || null,
      state: data.state || null,
      postal_code: data.postal_code || null,
      country: data.country || null,
      time_zone: null,
      industry: null,
      website: data.website || null,
      last_interaction_date: null,
      custom_fields: null,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>

            <div className="max-h-[55vh] overflow-y-auto pr-1">
              <TabsContent value="basic" className="mt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">First Name *</label>
                    <Input {...register("first_name")} placeholder="Jane" />
                    {errors.first_name && (
                      <p className="text-xs text-destructive">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input {...register("last_name")} placeholder="Smith" />
                    {errors.last_name && (
                      <p className="text-xs text-destructive">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...register("email")} type="email" placeholder="jane@example.com" />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Job Title</label>
                  <AutofillInput
                    table="contacts"
                    column="job_title"
                    placeholder="Managing Director"
                    {...register("job_title")}
                    onSelect={(v) => setValue("job_title", v)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Company</label>
                  <AutofillInput
                    table="contacts"
                    column="company_name"
                    placeholder="Acme Capital"
                    {...register("company_name")}
                    onSelect={(v) => setValue("company_name", v)}
                  />
                </div>
                <SelectField
                  label="Lead Status"
                  value={watch("lead_status") ?? ""}
                  onChange={(v) => setValue("lead_status", v)}
                  options={LEAD_STATUSES}
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contact Owner</label>
                  <Input {...register("contact_owner")} placeholder="Your name" />
                </div>
              </TabsContent>

              <TabsContent value="investment" className="mt-0 space-y-3">
                <SelectField
                  label="Capital Type"
                  value={watch("capital_type") ?? ""}
                  onChange={(v) => setValue("capital_type", v)}
                  options={CAPITAL_TYPES}
                />
                <SelectField
                  label="Asset Class"
                  value={watch("asset_class") ?? ""}
                  onChange={(v) => setValue("asset_class", v)}
                  options={ASSET_CLASSES}
                />
                <SelectField
                  label="Region"
                  value={watch("region") ?? ""}
                  onChange={(v) => setValue("region", v)}
                  options={REGIONS}
                />
                <SelectField
                  label="Investment Strategy"
                  value={watch("investment_strategy") ?? ""}
                  onChange={(v) => setValue("investment_strategy", v)}
                  options={INVESTMENT_STRATEGIES}
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium">Relationship Notes</label>
                  <Textarea
                    {...register("relationship")}
                    rows={3}
                    className="resize-none"
                    placeholder="How did we meet? Key relationship context..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Next Steps</label>
                  <Textarea
                    {...register("next_steps")}
                    rows={2}
                    className="resize-none"
                    placeholder="What's the next action?"
                  />
                </div>
              </TabsContent>

              <TabsContent value="address" className="mt-0 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input {...register("street_address")} placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">City</label>
                    <AutofillInput
                      table="contacts"
                      column="city"
                      placeholder="New York"
                      {...register("city")}
                      onSelect={(v) => setValue("city", v)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">State</label>
                    <AutofillInput
                      table="contacts"
                      column="state"
                      placeholder="NY"
                      {...register("state")}
                      onSelect={(v) => setValue("state", v)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Postal Code</label>
                    <Input {...register("postal_code")} placeholder="10001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Country</label>
                    <Input {...register("country")} placeholder="USA" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="source" className="mt-0 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Database Source</label>
                  <Input {...register("database_source")} placeholder="Referral, LinkedIn, etc." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Website</label>
                  <Input {...register("website")} placeholder="https://example.com" />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-4">
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
            <Button type="submit" disabled={createContact.isPending}>
              {createContact.isPending ? "Creating…" : "Create Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
