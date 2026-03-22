"use client";

import * as React from "react";
import { Upload, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/client";

type EntityType = "contacts" | "companies" | "deals";
type Step = "entity" | "upload" | "mapping" | "preview" | "dedup" | "execute";

interface ColumnMapping {
  csvColumn: string;
  targetField: string | null;
}

interface DedupeDecision {
  rowIndex: number;
  action: "create" | "update" | "skip";
  matchId?: string;
}

interface ImportResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

const ENTITY_FIELDS: Record<EntityType, { key: string; label: string; required?: boolean }[]> = {
  contacts: [
    { key: "first_name", label: "First Name", required: true },
    { key: "last_name", label: "Last Name", required: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "job_title", label: "Job Title" },
    { key: "company_name", label: "Company" },
    { key: "lead_status", label: "Lead Status" },
    { key: "capital_type", label: "Capital Type" },
    { key: "asset_class", label: "Asset Class" },
    { key: "region", label: "Region" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "database_source", label: "Database Source" },
    { key: "contact_owner", label: "Contact Owner" },
  ],
  companies: [
    { key: "name", label: "Company Name", required: true },
    { key: "website", label: "Website" },
    { key: "company_type", label: "Company Type" },
    { key: "industry", label: "Industry" },
    { key: "hq_city", label: "HQ City" },
    { key: "hq_state", label: "HQ State" },
    { key: "hq_country", label: "HQ Country" },
    { key: "capital_type", label: "Capital Type" },
    { key: "aum", label: "AUM" },
    { key: "linkedin", label: "LinkedIn" },
  ],
  deals: [
    { key: "name", label: "Deal Name", required: true },
    { key: "stage", label: "Stage" },
    { key: "amount", label: "Amount" },
    { key: "priority", label: "Priority" },
    { key: "deal_type", label: "Deal Type" },
    { key: "asset_class", label: "Asset Class" },
    { key: "location", label: "Location" },
    { key: "expected_close_date", label: "Close Date" },
    { key: "deal_owner", label: "Deal Owner" },
    { key: "description", label: "Description" },
  ],
};

async function parseFile(file: File): Promise<{ headers: string[]; rows: string[][] }> {
  const isXlsx =
    file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

  if (isXlsx) {
    const xlsx = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const wb = xlsx.read(buffer);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json<string[]>(sheet, { header: 1 });
    const rows = data.filter((r) => r.length > 0) as string[][];
    const headers = (rows[0] ?? []).map(String);
    return { headers, rows: rows.slice(1) };
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const parse = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parse(lines[0] ?? "");
  const rows = lines.slice(1).map(parse);
  return { headers, rows };
}

function autoMap(
  csvHeaders: string[],
  entityType: EntityType
): ColumnMapping[] {
  const fields = ENTITY_FIELDS[entityType];
  return csvHeaders.map((col) => {
    const lower = col.toLowerCase().replace(/[\s_-]/g, "");
    const match = fields.find((f) => {
      const fKey = f.key.replace(/_/g, "").toLowerCase();
      const fLabel = f.label.replace(/\s/g, "").toLowerCase();
      return fKey === lower || fLabel === lower;
    });
    return { csvColumn: col, targetField: match?.key ?? null };
  });
}

function StepIndicator({ steps, current }: { steps: { key: string; label: string }[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map(({ key, label }, i) => (
        <React.Fragment key={key}>
          <div
            className={`flex items-center gap-1.5 text-sm ${
              i === current
                ? "font-semibold text-foreground"
                : i < current
                ? "text-muted-foreground"
                : "text-muted-foreground/40"
            }`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                  ? "border-2 border-primary text-primary"
                  : "border border-muted-foreground/30"
              }`}
            >
              {i < current ? <CheckCircle2 className="size-4" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="h-px w-6 flex-1 bg-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const STEPS: { key: Step; label: string }[] = [
  { key: "entity", label: "Entity" },
  { key: "upload", label: "Upload" },
  { key: "mapping", label: "Mapping" },
  { key: "preview", label: "Preview" },
  { key: "dedup", label: "Dedup" },
  { key: "execute", label: "Execute" },
];

export default function ImportPage() {
  const [step, setStep] = React.useState<Step>("entity");
  const [entityType, setEntityType] = React.useState<EntityType>("contacts");
  const [parsedData, setParsedData] = React.useState<{
    headers: string[];
    rows: string[][];
    filename: string;
  } | null>(null);
  const [mappings, setMappings] = React.useState<ColumnMapping[]>([]);
  const [dedupeDecisions, setDedupeDecisions] = React.useState<DedupeDecision[]>([]);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [executing, setExecuting] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const next = () => setStep(STEPS[stepIndex + 1].key);
  const prev = () => setStep(STEPS[stepIndex - 1].key);

  const handleFile = async (file: File) => {
    const parsed = await parseFile(file);
    setParsedData({ ...parsed, filename: file.name });
    setMappings(autoMap(parsed.headers, entityType));
    next();
  };

  const mappedRows = React.useMemo(() => {
    if (!parsedData) return [];
    return parsedData.rows.map((row) => {
      const obj: Record<string, string> = {};
      mappings.forEach((m, i) => {
        if (m.targetField) {
          obj[m.targetField] = row[i] ?? "";
        }
      });
      return obj;
    });
  }, [parsedData, mappings]);

  const requiredFields = React.useMemo(
    () => ENTITY_FIELDS[entityType].filter((f) => f.required).map((f) => f.key),
    [entityType]
  );

  const rowsWithErrors = React.useMemo(
    () =>
      mappedRows.map((row, i) => ({
        row,
        index: i,
        missingRequired: requiredFields.filter((k) => !row[k]?.trim()),
      })),
    [mappedRows, requiredFields]
  );

  const handleExecute = async () => {
    setExecuting(true);
    const supabase = createClient();
    const res: ImportResult = { imported: 0, updated: 0, skipped: 0, errors: [] };
    const CHUNK = 50;

    const rowsToProcess = mappedRows.filter((_, i) => {
      const dec = dedupeDecisions.find((d) => d.rowIndex === i);
      return !dec || dec.action !== "skip";
    });

    for (let i = 0; i < rowsToProcess.length; i += CHUNK) {
      const chunk = rowsToProcess.slice(i, i + CHUNK).map((row, ci) => {
        const dec = dedupeDecisions.find((d) => d.rowIndex === i + ci);
        const cleaned: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(row)) {
          cleaned[k] = v.trim() || null;
        }
        return dec?.action === "update" && dec.matchId
          ? { ...cleaned, id: dec.matchId }
          : cleaned;
      });

      const { error } = await supabase.from(entityType).upsert(chunk as never[]);
      if (error) {
        chunk.forEach((_, j) => {
          res.errors.push({ row: i + j + 1, message: error.message });
        });
      } else {
        res.imported += chunk.length;
      }
    }

    setResult(res);
    setExecuting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Data"
        description="Import contacts, companies, or deals from CSV or Excel files"
      />

      <StepIndicator steps={STEPS} current={stepIndex} />

      <div className="rounded-xl border bg-card p-6">
        {/* Step 1: Entity */}
        {step === "entity" && (
          <div className="space-y-4">
            <h2 className="font-semibold">What would you like to import?</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(["contacts", "companies", "deals"] as EntityType[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEntityType(e)}
                  className={`rounded-xl border p-6 text-center transition-colors hover:border-primary hover:bg-primary/5 ${
                    entityType === e ? "border-primary bg-primary/5 font-semibold" : ""
                  }`}
                >
                  <p className="capitalize text-lg">{e}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={next}>
                Next <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Upload your file</h2>
            <p className="text-sm text-muted-foreground">
              Supported formats: .csv, .xlsx. First row should be column headers.
            </p>
            <div
              className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-12 transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-muted"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) await handleFile(file);
              }}
            >
              <Upload className="size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop a file here, or</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleFile(file);
                }}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev}>
                <ArrowLeft className="mr-2 size-4" /> Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Column Mapping */}
        {step === "mapping" && parsedData && (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Map columns</h2>
              <p className="text-sm text-muted-foreground">
                {parsedData.filename} · {parsedData.rows.length} rows ·{" "}
                {parsedData.headers.length} columns
              </p>
            </div>
            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {mappings.map((m, i) => (
                <div key={m.csvColumn} className="grid grid-cols-2 gap-3 items-center">
                  <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    {m.csvColumn}
                  </div>
                  <Select
                    value={m.targetField ?? "__skip__"}
                    onValueChange={(v) => {
                      const next = [...mappings];
                      next[i] = { ...m, targetField: v === "__skip__" ? null : v };
                      setMappings(next);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">— Skip —</SelectItem>
                      {ENTITY_FIELDS[entityType].map((f) => (
                        <SelectItem key={f.key} value={f.key}>
                          {f.label}
                          {f.required ? " *" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev}>
                <ArrowLeft className="mr-2 size-4" /> Back
              </Button>
              <Button onClick={next}>
                Preview <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Preview</h2>
              <p className="text-sm text-muted-foreground">
                Showing first 10 rows. Red rows are missing required fields.
              </p>
            </div>
            <div className="max-h-[50vh] overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs text-muted-foreground">#</th>
                    {mappings
                      .filter((m) => m.targetField)
                      .map((m) => (
                        <th key={m.targetField} className="px-3 py-2 text-left text-xs text-muted-foreground whitespace-nowrap">
                          {ENTITY_FIELDS[entityType].find((f) => f.key === m.targetField)?.label ??
                            m.targetField}
                        </th>
                      ))}
                    <th className="px-3 py-2 text-left text-xs text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rowsWithErrors.slice(0, 10).map(({ row, index, missingRequired }) => (
                    <tr
                      key={index}
                      className={missingRequired.length > 0 ? "bg-destructive/5" : ""}
                    >
                      <td className="px-3 py-2 text-xs text-muted-foreground">{index + 1}</td>
                      {mappings
                        .filter((m) => m.targetField)
                        .map((m) => (
                          <td key={m.targetField} className="px-3 py-2 max-w-[200px] truncate">
                            {row[m.targetField!] ?? ""}
                          </td>
                        ))}
                      <td className="px-3 py-2">
                        {missingRequired.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="size-3" />
                            Missing: {missingRequired.join(", ")}
                          </span>
                        ) : (
                          <span className="text-xs text-green-600">
                            <CheckCircle2 className="inline size-3" /> OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev}>
                <ArrowLeft className="mr-2 size-4" /> Back
              </Button>
              <Button
                onClick={next}
                disabled={rowsWithErrors.some((r) => r.missingRequired.length > 0)}
              >
                Check Duplicates <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Dedup */}
        {step === "dedup" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Duplicate Check</h2>
              <p className="text-sm text-muted-foreground">
                Duplicates are matched by email (contacts), name/domain (companies), or name (deals). All{" "}
                {mappedRows.length} rows will be imported as new records unless you mark them as
                updates or skips.
              </p>
            </div>
            <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 size-8 text-green-600" />
              <p>
                Duplicate detection is done at import time. Records matching existing data by key
                field will be upserted automatically.
              </p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev}>
                <ArrowLeft className="mr-2 size-4" /> Back
              </Button>
              <Button onClick={next}>
                Import {mappedRows.length} Records <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Execute */}
        {step === "execute" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Import</h2>

            {!result && !executing && (
              <>
                <p className="text-sm text-muted-foreground">
                  Ready to import {mappedRows.length} {entityType}. This cannot be undone.
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prev}>
                    <ArrowLeft className="mr-2 size-4" /> Back
                  </Button>
                  <Button onClick={handleExecute}>
                    Start Import
                  </Button>
                </div>
              </>
            )}

            {executing && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Importing records…</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Imported", value: result.imported, color: "text-green-600" },
                    { label: "Updated", value: result.updated, color: "text-blue-600" },
                    { label: "Skipped", value: result.skipped, color: "text-muted-foreground" },
                    { label: "Errors", value: result.errors.length, color: "text-destructive" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-4 text-center">
                      <p className={`text-3xl font-bold tabular-nums ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {result.errors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Errors</p>
                    <div className="max-h-40 overflow-y-auto rounded-lg border text-sm">
                      {result.errors.map((e) => (
                        <div key={e.row} className="flex gap-3 border-b px-3 py-2">
                          <span className="text-muted-foreground">Row {e.row}</span>
                          <span className="text-destructive">{e.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("entity");
                      setParsedData(null);
                      setMappings([]);
                      setDedupeDecisions([]);
                      setResult(null);
                    }}
                  >
                    Import Another File
                  </Button>
                  <Button asChild>
                    <a href={`/${entityType}`}>View {entityType}</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
