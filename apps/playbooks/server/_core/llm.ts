/**
 * LLM helper — OpenAI-compatible API (Google AI / OpenAI / any compatible endpoint)
 *
 * Configure via env vars:
 *   LLM_API_URL  — e.g. https://generativelanguage.googleapis.com/v1beta/openai  (Google AI)
 *                      or https://api.openai.com/v1  (OpenAI)
 *   LLM_API_KEY  — your API key
 *   LLM_MODEL    — model name, default: gemini-2.5-flash
 */
import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4";
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: { name: string };
};
export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};
export type OutputSchema = JsonSchema;
export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// ── Normalizers ───────────────────────────────────────────────────────────────

const ensureArray = (value: MessageContent | MessageContent[]): MessageContent[] =>
  Array.isArray(value) ? value : [value];

const normalizeContentPart = (part: MessageContent): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "text" || part.type === "image_url" || part.type === "file_url") return part;
  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(p => (typeof p === "string" ? p : JSON.stringify(p)))
      .join("\n");
    return { role, name, tool_call_id, content };
  }
  const parts = ensureArray(message.content).map(normalizeContentPart);
  if (parts.length === 1 && parts[0].type === "text") {
    return { role, name, content: (parts[0] as TextContent).text };
  }
  return { role, name, content: parts };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;
  if (toolChoice === "none" || toolChoice === "auto") return toolChoice;
  if (toolChoice === "required") {
    if (!tools?.length) throw new Error("tool_choice 'required' but no tools provided");
    if (tools.length > 1) throw new Error("tool_choice 'required' needs a single tool or explicit name");
    return { type: "function", function: { name: tools[0].function.name } };
  }
  if ("name" in toolChoice) return { type: "function", function: { name: toolChoice.name } };
  return toolChoice;
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: Pick<InvokeParams, "responseFormat" | "response_format" | "outputSchema" | "output_schema">) => {
  const explicit = responseFormat || response_format;
  if (explicit) return explicit;
  const schema = outputSchema || output_schema;
  if (!schema) return undefined;
  if (!schema.name || !schema.schema) throw new Error("outputSchema requires name and schema");
  return {
    type: "json_schema" as const,
    json_schema: { name: schema.name, schema: schema.schema, ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}) },
  };
};

// ── Main export ───────────────────────────────────────────────────────────────

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  if (!ENV.llmApiKey) {
    throw new Error("LLM_API_KEY is not configured. Set it in your environment variables.");
  }

  const { messages, tools, toolChoice, tool_choice, outputSchema, output_schema, responseFormat, response_format } = params;

  const apiUrl = `${ENV.llmApiUrl.replace(/\/$/, "")}/chat/completions`;

  const payload: Record<string, unknown> = {
    model: ENV.llmModel,
    messages: messages.map(normalizeMessage),
    max_tokens: params.maxTokens ?? params.max_tokens ?? 8192,
  };

  if (tools?.length) payload.tools = tools;

  const normalizedToolChoice = normalizeToolChoice(toolChoice || tool_choice, tools);
  if (normalizedToolChoice) payload.tool_choice = normalizedToolChoice;

  const normalizedResponseFormat = normalizeResponseFormat({ responseFormat, response_format, outputSchema, output_schema });
  if (normalizedResponseFormat) payload.response_format = normalizedResponseFormat;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.llmApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
  }

  return (await response.json()) as InvokeResult;
}
