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
import { useCreateCompany } from "@/hooks/use-companies";
import type { CompanyInsert } from "@/types";
import {
  COMPANY_TYPES,
  ASSET_CLASSES,
  REGIONS,
  CAPITAL_TYPES,
  INVESTMENT_STRATEGIES,
} from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().optional(),
  company_type: z.string().optional(),
  industry: z.string().optional(),
  hq_city: z.string().optional(),
  hq_state: z.string().optional(),
  hq_country: z.string().optional(),
  capital_type: z.string().optional(),
  asset_class: z.string().optional(),
  region: z.string().optional(),
  investment_strategy: z.string().optional(),
  aum: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewCompanyDialogProps {
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
      <Select
        value={value || "__none__"}
        onValueChange={(v: string) => onChange(v === "__none__" ? "" : v)}
      >
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

export function NewCompanyDialog({ open, onOpenChange }: NewCompanyDialogProps) {
  const createCompany = useCreateCompany();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await createCompany.mutateAsync({
      name: data.name,
      website: data.website || undefined,
      company_type: (data.company_type || undefined) as CompanyInsert["company_type"],
      industry: data.industry || undefined,
      hq_city: data.hq_city || undefined,
      hq_state: data.hq_state || undefined,
      hq_country: data.hq_country || undefined,
      capital_type: (data.capital_type || undefined) as CompanyInsert["capital_type"],
      investment_strategy: (data.investment_strategy || undefined) as CompanyInsert["investment_strategy"],
      region: (data.region || undefined) as CompanyInsert["region"],
      asset_class: (data.asset_class || undefined) as CompanyInsert["asset_class"],
      aum: data.aum ? Number(data.aum) : undefined,
      notes: data.notes || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="text-sm font-medium">Company Name *</label>
              <Input {...register("name")} placeholder="Acme Capital" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <SelectField
              label="Company Type"
              value={watch("company_type") ?? ""}
              onChange={(v) => setValue("company_type", v)}
              options={COMPANY_TYPES}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium">Industry</label>
              <Input {...register("industry")} placeholder="Real Estate" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Website</label>
              <Input {...register("website")} placeholder="https://example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">HQ City</label>
                <Input {...register("hq_city")} placeholder="New York" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">HQ State</label>
                <Input {...register("hq_state")} placeholder="NY" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HQ Country</label>
              <Input {...register("hq_country")} placeholder="USA" />
            </div>
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
              <label className="text-sm font-medium">AUM ($)</label>
              <Input {...register("aum")} type="number" placeholder="500000000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                {...register("notes")}
                rows={3}
                className="resize-none"
                placeholder="Key notes..."
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createCompany.isPending}>
              {createCompany.isPending ? "Creating…" : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
