import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_deals",
    description: "Search deals by name, stage, or other criteria. Returns matching deals.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Name or keyword to search" },
        stage: { type: "string", description: "Filter by stage (optional)" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
      required: ["query"],
    },
  },
  {
    name: "search_contacts",
    description: "Search contacts by name, email, or company.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Name, email, or company to search" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_deal_participants",
    description: "Get all participants (investors, lenders, etc.) for a specific deal.",
    input_schema: {
      type: "object" as const,
      properties: {
        deal_id: { type: "string", description: "UUID of the deal" },
      },
      required: ["deal_id"],
    },
  },
  {
    name: "get_recent_activities",
    description: "Get recent activities, optionally filtered by deal or contact.",
    input_schema: {
      type: "object" as const,
      properties: {
        deal_id: { type: "string", description: "Filter by deal UUID (optional)" },
        contact_id: { type: "string", description: "Filter by contact UUID (optional)" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
    },
  },
  {
    name: "propose_changes",
    description:
      "Propose structured changes to deals, contacts, and deal participants for the user to review before saving. Use this when the user wants to update data.",
    input_schema: {
      type: "object" as const,
      properties: {
        summary: {
          type: "string",
          description: "Human-readable summary of what will change",
        },
        deal_updates: {
          type: "array",
          description: "List of deal field changes",
          items: {
            type: "object",
            properties: {
              deal_id: { type: "string" },
              deal_name: { type: "string" },
              field: { type: "string" },
              old_value: { type: "string" },
              new_value: { type: "string" },
            },
            required: ["deal_id", "deal_name", "field", "new_value"],
          },
        },
        participant_updates: {
          type: "array",
          description: "List of deal participant changes",
          items: {
            type: "object",
            properties: {
              deal_id: { type: "string" },
              deal_name: { type: "string" },
              contact_id: { type: "string" },
              contact_name: { type: "string" },
              field: { type: "string" },
              old_value: { type: "string" },
              new_value: { type: "string" },
              is_new_participant: { type: "boolean" },
            },
            required: ["deal_id", "deal_name", "contact_id", "contact_name", "field", "new_value"],
          },
        },
        activity_creates: {
          type: "array",
          description: "List of activities to log",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              subject: { type: "string" },
              body: { type: "string" },
              deal_id: { type: "string" },
              contact_id: { type: "string" },
              deal_name: { type: "string" },
              contact_name: { type: "string" },
            },
            required: ["type", "subject"],
          },
        },
      },
      required: ["summary"],
    },
  },
];

// ─── Tool execution ────────────────────────────────────────────────────────────

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const supabase = getSupabase();

  if (name === "search_deals") {
    const { query, stage, limit = 10 } = input as { query: string; stage?: string; limit?: number };
    let q = supabase
      .from("deals")
      .select("id, name, stage, amount, priority, location, deal_owner, expected_close_date")
      .ilike("name", `%${query}%`)
      .is("deleted_at", null)
      .limit(limit);
    if (stage) q = q.eq("stage", stage);
    const { data } = await q;
    return JSON.stringify(data ?? []);
  }

  if (name === "search_contacts") {
    const { query, limit = 10 } = input as { query: string; limit?: number };
    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, company_name, job_title, lead_status")
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`
      )
      .is("deleted_at", null)
      .limit(limit);
    return JSON.stringify(data ?? []);
  }

  if (name === "get_deal_participants") {
    const { deal_id } = input as { deal_id: string };
    const { data } = await supabase
      .from("deal_participants")
      .select(
        "id, role, status, commitment_amount, nda_sent_date, nda_signed_date, contacts(id, first_name, last_name, email, company_name)"
      )
      .eq("deal_id", deal_id);
    return JSON.stringify(data ?? []);
  }

  if (name === "get_recent_activities") {
    const { deal_id, contact_id, limit = 10 } = input as {
      deal_id?: string;
      contact_id?: string;
      limit?: number;
    };
    let q = supabase
      .from("activities")
      .select("id, type, subject, body, date, created_at, deals(name), contacts(first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (deal_id) q = q.eq("deal_id", deal_id);
    if (contact_id) q = q.eq("contact_id", contact_id);
    const { data } = await q;
    return JSON.stringify(data ?? []);
  }

  if (name === "propose_changes") {
    // Not executed server-side — returned to client as structured data
    return JSON.stringify({ status: "proposed", data: input });
  }

  return JSON.stringify({ error: "Unknown tool" });
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the AI assistant for RE Capital IQ, a private real estate investor relations platform.
You help IR professionals manage deals, contacts, and activities.

Your capabilities:
- Search and retrieve deals, contacts, companies, and activities
- Propose updates to deals and deal participants (status, commitment amounts, NDA dates, etc.)
- Log new activities (calls, emails, meetings, notes)
- Answer questions about the pipeline and investor relationships

Rules:
- NEVER delete records
- NEVER create new deals, contacts, or companies — only update existing ones
- Always use propose_changes when the user wants to modify data, so they can review before saving
- Be concise and specific. Reference names and values from the actual database
- If a name is ambiguous, search first and ask for clarification
- Dates format: YYYY-MM-DD

When a user says something like "met with Sarah Kim, she's interested", you should:
1. Search for Sarah Kim in contacts
2. Identify the relevant deal from context
3. Propose: update participant status, log an activity

For financial amounts, always confirm the currency is USD unless specified.`;

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local." },
      { status: 503 }
    );
  }

  const { messages } = await req.json() as {
    messages: Anthropic.MessageParam[];
  };

  try {
    // Agentic loop — Claude may call tools multiple times before a final answer
    let loopMessages = [...messages];

    for (let i = 0; i < 8; i++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: loopMessages,
      });

      loopMessages.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "end_turn") {
        // Extract text and any propose_changes tool use
        const textBlock = response.content.find((b) => b.type === "text");
        const proposeBlock = response.content.find(
          (b) => b.type === "tool_use" && b.name === "propose_changes"
        ) as Anthropic.ToolUseBlock | undefined;

        return NextResponse.json({
          message: textBlock?.type === "text" ? textBlock.text : "",
          proposed_changes: proposeBlock ? proposeBlock.input : null,
        });
      }

      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter(
          (b) => b.type === "tool_use"
        ) as Anthropic.ToolUseBlock[];

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const toolUse of toolUseBlocks) {
          // If Claude proposes changes, return immediately to client
          if (toolUse.name === "propose_changes") {
            const textBlock = response.content.find((b) => b.type === "text");
            return NextResponse.json({
              message: textBlock?.type === "text" ? textBlock.text : "Here are the proposed changes:",
              proposed_changes: toolUse.input,
            });
          }

          const result = await executeTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result,
          });
        }

        loopMessages.push({ role: "user", content: toolResults });
      }
    }

    return NextResponse.json({ message: "I wasn't able to complete the request. Please try again.", proposed_changes: null });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
