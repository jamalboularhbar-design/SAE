/**
 * The Brain — orchestrates a team of the user's Hub specialists.
 * "Ask once → Nexus breaks the job down → specialists work in parallel → one answer."
 *
 * Runs asynchronously and streams progress into the store so the UI can show
 * the team working in real time (poll GET /api/runs/:id).
 */
import type { Run, RunStep, Specialist, SubTask } from "../shared/types.ts";
import { SPECIALISTS, WORKSPACES } from "./catalog.ts";
import { store } from "./store.ts";
import { chat, isLiveMode } from "./llm.ts";
import { demoObjective, demoResult, demoSynthesis, demoThink, categoryTool } from "./demoEngine.ts";
import { runIntegrationAction } from "./adapters.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A concrete next-step a specialist drafts, awaiting the user's approval. */
function draftActionFor(category: string): { title: string; channel: string } {
  switch (category) {
    case "Marketing & Campaign": return { title: "Approve campaign asset", channel: "notion" };
    case "Social Media": return { title: "Publish drafted post", channel: "slack" };
    case "Sales & Revenue": return { title: "Send drafted outreach", channel: "hubspot" };
    case "Writing": return { title: "Approve draft", channel: "notion" };
    case "Operations & Systems": return { title: "Apply proposed automation", channel: "webhooks" };
    case "Strategy & Growth": return { title: "Adopt recommendation", channel: "hub" };
    case "Customer Success": return { title: "Send drafted message", channel: "email" };
    case "E-commerce": return { title: "Apply store change", channel: "hubspot" };
    case "Daily AI Assistant": return { title: "Confirm the plan", channel: "calendar" };
    default: return { title: "Approve next step", channel: "hub" };
  }
}

const ROSTER = SPECIALISTS.filter((s) => s.id !== "chief-of-staff");
const byId = (id: string) => SPECIALISTS.find((s) => s.id === id);

/** Score each Hub specialist against the prompt; return the top matches + Chief of Staff. */
export function routeSpecialists(prompt: string): string[] {
  const p = prompt.toLowerCase();
  const words = new Set(p.split(/[^a-z0-9]+/).filter((w) => w.length > 3));

  const scored = ROSTER.map((s) => {
    const hay = `${s.name} ${s.role} ${s.category} ${s.prompt ?? ""}`.toLowerCase();
    let score = 0;
    for (const w of words) if (hay.includes(w)) score += 1;
    // category keyword boosts
    if (/post|linkedin|instagram|tweet|tiktok|social/.test(p) && s.category === "Social Media") score += 2;
    if (/email|inbox|reply|nurture|sequence/.test(p) && /Email/.test(s.name)) score += 2;
    if (/deal|pipeline|lead|sales|revenue|pricing|close/.test(p) && s.category === "Sales & Revenue") score += 2;
    if (/write|draft|copy|blog|content|post/.test(p) && (s.category === "Writing" || s.category === "Marketing & Campaign")) score += 1;
    if (/plan|priorit|today|schedule|focus|day/.test(p) && s.id === "planner") score += 2;
    if (/research|compare|find|analy|market/.test(p) && (s.id === "research-ai" || s.id === "research")) score += 2;
    if (/strategy|position|decide|growth|launch/.test(p) && s.category === "Strategy & Growth") score += 2;
    if (/onboard|churn|retention|support|customer/.test(p) && s.category === "Customer Success") score += 2;
    if (/automat|process|sop|workflow|ops/.test(p) && s.category === "Operations & Systems") score += 2;
    return { id: s.id, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  let team = scored.slice(0, 4).map((x) => x.id);
  if (team.length === 0) team = ["strategy", "planner"]; // sensible default
  return ["chief-of-staff", ...team];
}

function step(specialistId: string, type: RunStep["type"], title: string, detail: string, via?: string): RunStep {
  return { id: store.newId(8), specialistId, type, title, detail, status: "done", ts: store.nowIso(), via };
}

export function createRun(prompt: string, workspaceId?: string): Run {
  const team = routeSpecialists(prompt);
  const plan: SubTask[] = team
    .filter((s) => s !== "chief-of-staff")
    .map((id) => ({
      id: store.newId(8),
      specialistId: id,
      objective: demoObjective(byId(id)!, prompt),
      status: "pending" as const,
    }));

  const run: Run = {
    id: store.newId(10),
    prompt,
    status: "planning",
    createdAt: store.nowIso(),
    plan,
    steps: [],
    specialistsUsed: team,
    mode: isLiveMode() ? "live" : "demo",
  };
  store.addRun(run);
  void orchestrate(run.id, workspaceId).catch((err) => {
    store.updateRun(run.id, { status: "failed", result: `Run failed: ${String(err)}` });
  });
  return run;
}

async function orchestrate(runId: string, workspaceId?: string) {
  const run = store.getRun(runId);
  if (!run) return;
  const live = isLiveMode();
  const ws = WORKSPACES.find((w) => w.id === workspaceId);
  let wsCtx = ws ? `\n\nActive workspace: ${ws.name} (${ws.domain}). ${ws.context}` : "";

  const append = (s: RunStep) => {
    const r = store.getRun(runId);
    if (r) store.updateRun(runId, { steps: [...r.steps, s] });
  };

  store.updateRun(runId, { status: "running" });
  const teamNames = run.plan.map((t) => byId(t.specialistId)?.name).filter(Boolean).join(", ");
  append(step("chief-of-staff", "plan", "Broke the request into parallel tracks", `Assigned ${run.plan.length} specialist${run.plan.length === 1 ? "" : "s"}: ${teamNames}.${ws ? ` Context: ${ws.name}.` : ""}`));
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "chief-of-staff", action: "Planned run", target: runId, status: "ok" });
  await sleep(450);

  // Knowledge gathering: query connected knowledge tools (e.g. Notion) up front.
  let knowledge = "";
  if (/notion|doc|playbook|sop|page|pricing|positioning|knowledge|research|brand/i.test(run.prompt)) {
    const note = await runIntegrationAction("notion", run.prompt);
    if (note && note.live) {
      append(step("research-ai", "tool", "Searched Notion (live)", note.summary, "notion"));
      store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "research-ai", action: "Searched Notion (live)", target: runId, status: "ok" });
      knowledge = `\n\nLive Notion findings: ${note.summary}`;
      wsCtx += knowledge;
      await sleep(350);
    }
  }
  void knowledge;

  for (const task of run.plan) {
    const sp = byId(task.specialistId);
    if (!sp) continue;

    append(step("chief-of-staff", "handoff", `Handed off to ${sp.name}`, task.objective));
    await sleep(300);

    let thought = demoThink(sp);
    if (live) {
      try {
        thought = await chat(
          [
            { role: "system", content: `${sp.prompt ?? ""}${wsCtx}\n\nYou are operating inside Nexus OS. Be concise. Never claim to have sent anything — drafts are held for approval.` },
            { role: "user", content: `Task: ${task.objective}\nUser request: ${run.prompt}\nIn 1-2 sentences, say how you'll handle it.` },
          ],
          { maxTokens: 200 }
        );
      } catch {
        /* keep demo */
      }
    }
    append(step(sp.id, "think", `${sp.name} is working`, thought));
    await sleep(420);

    const tool = categoryTool(sp.category);
    // If the mapped tool is actually connected, perform a real call.
    let toolDetail = tool.detail;
    let toolLive = false;
    try {
      const real = await runIntegrationAction(tool.via, run.prompt);
      if (real) {
        toolDetail = real.summary;
        toolLive = real.live;
      }
    } catch {
      /* keep simulated detail */
    }
    append(step(sp.id, "tool", `${sp.name} used ${tool.via}${toolLive ? " (live)" : ""}`, toolDetail, tool.via));
    store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: sp.id, action: `Used ${tool.via}${toolLive ? " (live)" : ""}`, target: runId, status: "ok" });
    await sleep(360);

    let outcome = demoResult(sp);
    if (live) {
      try {
        outcome = await chat(
          [
            { role: "system", content: `${sp.prompt ?? ""}${wsCtx}\n\nProduce your deliverable for the task. Be specific and concise (max 120 words). Drafts are held for approval.` },
            { role: "user", content: `${task.objective}\n\nOriginal request: ${run.prompt}` },
          ],
          { maxTokens: 400 }
        );
      } catch {
        /* keep demo */
      }
    }
    append(step(sp.id, "result", `${sp.name} finished`, outcome));

    // Draft a concrete action for the user to approve (the Apex safety model).
    const da = draftActionFor(sp.category);
    store.addAction({
      id: store.newId(8),
      runId,
      specialistId: sp.id,
      title: `${da.title} — ${sp.name}`,
      detail: outcome,
      channel: da.channel,
      status: "pending",
      createdAt: store.nowIso(),
    });
    await sleep(260);
  }

  let result = demoSynthesis(run.prompt, run.specialistsUsed.map((id) => byId(id)!).filter(Boolean) as Specialist[]);
  if (live) {
    try {
      const transcript = (store.getRun(runId)?.steps ?? []).map((s) => `${s.title}: ${s.detail}`).join("\n");
      result = await chat(
        [
          { role: "system", content: `You are the Chief of Staff of Nexus OS. Synthesize the team's work into ONE concise, action-first answer for a busy founder. Short paragraphs + bullets. Note drafted actions are held for approval.${wsCtx}` },
          { role: "user", content: `Request: ${run.prompt}\n\nTeam work log:\n${transcript}\n\nWrite the final answer.` },
        ],
        { model: "gemini-2.5-pro", maxTokens: 600 }
      );
    } catch {
      /* keep demo */
    }
  }

  append(step("chief-of-staff", "result", "Synthesized the final answer", "Combined every specialist's output into one response."));
  store.updateRun(runId, { status: "completed", completedAt: store.nowIso(), result });

  store.addMemory({
    id: store.newId(8),
    kind: "note",
    content: `Handled "${run.prompt.slice(0, 120)}" with ${run.specialistsUsed.length - 1} specialists${ws ? ` for ${ws.name}` : ""}.`,
    tags: ["run", ...(ws ? [ws.id] : [])],
    createdAt: store.nowIso(),
    source: "run",
  });
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "chief-of-staff", action: "Completed run", target: runId, status: "ok" });
}
