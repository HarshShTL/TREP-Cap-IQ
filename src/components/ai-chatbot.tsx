"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Check,
  CheckSquare,
  Square,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DealUpdate {
  deal_id: string;
  deal_name: string;
  field: string;
  old_value?: string;
  new_value: string;
}

interface ParticipantUpdate {
  deal_id: string;
  deal_name: string;
  contact_id: string;
  contact_name: string;
  field: string;
  old_value?: string;
  new_value: string;
  is_new_participant?: boolean;
}

interface ActivityCreate {
  type: string;
  subject: string;
  body?: string;
  deal_id?: string;
  contact_id?: string;
  deal_name?: string;
  contact_name?: string;
}

interface ProposedChanges {
  summary: string;
  deal_updates?: DealUpdate[];
  participant_updates?: ParticipantUpdate[];
  activity_creates?: ActivityCreate[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  proposed_changes?: ProposedChanges | null;
}

// ─── Proposed Changes Panel ────────────────────────────────────────────────────

function ProposedChangesPanel({
  changes,
  onConfirm,
  onDiscard,
}: {
  changes: ProposedChanges;
  onConfirm: (selected: Set<string>) => void;
  onDiscard: () => void;
}) {
  const allItems = [
    ...(changes.deal_updates ?? []).map((u, i) => ({
      key: `deal_${i}`,
      label: `${u.deal_name}: ${u.field} → ${u.new_value}`,
      old: u.old_value,
    })),
    ...(changes.participant_updates ?? []).map((u, i) => ({
      key: `participant_${i}`,
      label: `${u.contact_name} on ${u.deal_name}: ${u.field} → ${u.new_value}`,
      old: u.old_value,
    })),
    ...(changes.activity_creates ?? []).map((a, i) => ({
      key: `activity_${i}`,
      label: `Log ${a.type}: "${a.subject}"${a.deal_name ? ` (${a.deal_name})` : ""}${a.contact_name ? ` · ${a.contact_name}` : ""}`,
      old: undefined,
    })),
  ];

  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(allItems.map((i) => i.key))
  );
  const [confirming, setConfirming] = React.useState(false);

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm(selected);
    setConfirming(false);
  };

  if (!allItems.length) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-3 space-y-2">
      <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
        <Sparkles className="size-3.5" />
        Proposed Changes — review and confirm
      </p>
      <ul className="space-y-1.5">
        {allItems.map((item) => (
          <li
            key={item.key}
            className="flex items-start gap-2 cursor-pointer"
            onClick={() => toggle(item.key)}
          >
            {selected.has(item.key) ? (
              <CheckSquare className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            ) : (
              <Square className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
            )}
            <span className="text-xs leading-snug">
              {item.label}
              {item.old && (
                <span className="ml-1 text-muted-foreground line-through text-[11px]">
                  {item.old}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white"
          disabled={selected.size === 0 || confirming}
          onClick={handleConfirm}
        >
          {confirming ? (
            <Loader2 className="size-3 animate-spin mr-1" />
          ) : (
            <Check className="size-3 mr-1" />
          )}
          Confirm {selected.size > 0 ? `(${selected.size})` : ""}
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onDiscard}>
          Discard
        </Button>
      </div>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────

export function AiChatbot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [discardedChanges, setDiscardedChanges] = React.useState<Set<number>>(new Set());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Ctrl+K / Cmd+K shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  React.useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [open]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Chat error");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Something went wrong." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            proposed_changes: data.proposed_changes ?? null,
          },
        ]);
      }
    } catch {
      toast.error("Failed to reach AI");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const applyChanges = async (
    changes: ProposedChanges,
    selected: Set<string>
  ) => {
    const supabase = createClient();
    let applied = 0;

    // Apply selected deal updates
    const dealUpdates = changes.deal_updates ?? [];
    for (let i = 0; i < dealUpdates.length; i++) {
      if (!selected.has(`deal_${i}`)) continue;
      const u = dealUpdates[i];
      const { error } = await supabase
        .from("deals")
        .update({ [u.field]: u.new_value || null })
        .eq("id", u.deal_id);
      if (error) toast.error(`Failed to update ${u.deal_name}: ${error.message}`);
      else applied++;
    }

    // Apply selected participant updates
    const participantUpdates = changes.participant_updates ?? [];
    for (let i = 0; i < participantUpdates.length; i++) {
      if (!selected.has(`participant_${i}`)) continue;
      const u = participantUpdates[i];

      if (u.is_new_participant) {
        const { error } = await supabase.from("deal_participants").insert({
          deal_id: u.deal_id,
          contact_id: u.contact_id,
          [u.field]: u.new_value || null,
        });
        if (error) toast.error(`Failed to add ${u.contact_name}: ${error.message}`);
        else applied++;
      } else {
        const { data: existing } = await supabase
          .from("deal_participants")
          .select("id")
          .eq("deal_id", u.deal_id)
          .eq("contact_id", u.contact_id)
          .single();
        if (existing) {
          const { error } = await supabase
            .from("deal_participants")
            .update({ [u.field]: u.new_value || null })
            .eq("id", existing.id);
          if (error) toast.error(`Failed to update ${u.contact_name}: ${error.message}`);
          else applied++;
        }
      }
    }

    // Apply selected activity creates
    const activityCreates = changes.activity_creates ?? [];
    for (let i = 0; i < activityCreates.length; i++) {
      if (!selected.has(`activity_${i}`)) continue;
      const a = activityCreates[i];
      const { error } = await supabase.from("activities").insert({
        type: a.type as "Email" | "Call" | "Meeting" | "Note" | "NDA" | "Document" | "AI Update",
        subject: a.subject,
        body: a.body ?? null,
        deal_id: a.deal_id ?? null,
        contact_id: a.contact_id ?? null,
      });
      if (error) toast.error(`Failed to log activity: ${error.message}`);
      else applied++;
    }

    if (applied > 0) {
      toast.success(`${applied} change${applied > 1 ? "s" : ""} saved`);
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: ["deal-participants"] });
    }
  };

  const handleConfirm = async (msgIndex: number, selected: Set<string>) => {
    const msg = messages[msgIndex];
    if (!msg.proposed_changes) return;
    await applyChanges(msg.proposed_changes, selected);
    // Mark changes as applied by clearing them
    setMessages((prev) =>
      prev.map((m, i) =>
        i === msgIndex ? { ...m, proposed_changes: null } : m
      )
    );
  };

  const handleDiscard = (msgIndex: number) => {
    setDiscardedChanges((prev) => { const s = new Set(prev); s.add(msgIndex); return s; });
    setMessages((prev) =>
      prev.map((m, i) =>
        i === msgIndex ? { ...m, proposed_changes: null } : m
      )
    );
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-[hsl(220,70%,22%)] text-white hover:bg-[hsl(220,70%,28%)] hover:shadow-xl",
          open && "rotate-180 bg-[hsl(220,70%,16%)]"
        )}
        title="AI Assistant (Ctrl+K)"
        aria-label="Open AI Assistant"
      >
        {open ? <ChevronDown className="size-6" /> : <Sparkles className="size-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[400px] flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-[hsl(220,70%,22%)] px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">AI Assistant</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
                Ctrl+K
              </span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => setMessages([])}
                  title="Clear conversation"
                >
                  <X className="size-3.5" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: "420px" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Sparkles className="size-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">How can I help?</p>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-[280px]">
                  Ask about deals, log activities, update investor status, or query the pipeline.
                </p>
                <div className="mt-4 space-y-1.5 w-full">
                  {[
                    "What's the status of the Oakmont deal?",
                    "Log a call with John Park about Sunridge",
                    "Who are the investors on the Rivana deal?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => {
                        setInput(suggestion);
                        textareaRef.current?.focus();
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[hsl(220,70%,22%)] text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  {msg.proposed_changes && !discardedChanges.has(i) && (
                    <ProposedChangesPanel
                      changes={msg.proposed_changes}
                      onConfirm={(selected) => handleConfirm(i, selected)}
                      onDiscard={() => handleDiscard(i)}
                    />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                    <div className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                    <div className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="resize-none text-sm flex-1 min-h-[60px] max-h-[120px]"
              />
              <Button
                size="icon"
                className="size-9 shrink-0 bg-[hsl(220,70%,22%)] hover:bg-[hsl(220,70%,28%)] text-white"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
