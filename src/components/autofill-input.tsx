"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type TableName = keyof Database["public"]["Tables"];

interface AutofillInputProps extends Omit<React.ComponentProps<"input">, "onSelect"> {
  table: TableName;
  column: string;
  onSelect?: (value: string) => void;
}

export function AutofillInput({
  table,
  column,
  onSelect,
  value,
  onChange,
  className,
  ...props
}: AutofillInputProps) {
  const [inputValue, setInputValue] = React.useState(
    typeof value === "string" ? value : ""
  );
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(inputValue, 200);

  React.useEffect(() => {
    setInputValue(typeof value === "string" ? value : "");
  }, [value]);

  React.useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from(table)
      .select(column)
      .ilike(column, `${debouncedQuery}%`)
      .is("deleted_at", null)
      .limit(10)
      .then(({ data }) => {
        if (!data) return;
        const seen = new Set<string>();
        const results: string[] = [];
        for (const row of data) {
          const v = row[column as keyof typeof row] as string | null;
          if (v && !seen.has(v)) {
            seen.add(v);
            results.push(v);
          }
        }
        setSuggestions(results);
        setOpen(results.length > 0);
        setHighlighted(-1);
      });
  }, [debouncedQuery, table, column]);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  const handleSelect = (v: string) => {
    setInputValue(v);
    setOpen(false);
    onSelect?.(v);
    // Synthesize a change event for react-hook-form compatibility
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (nativeInputValueSetter && containerRef.current) {
      const input = containerRef.current.querySelector("input");
      if (input) {
        nativeInputValueSetter.call(input, v);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...props}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={className}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-background shadow-md">
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm",
                i === highlighted
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted/60"
              )}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
