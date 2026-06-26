import { useState, useRef, useEffect } from "react";

const BUSINESSES = [
  {
    id: "riad", name: "Riad & Routes", domain: "riadandroutes.com",
    tagline: "Luxury Concierge · HNW Americans", icon: "🌙",
    accent: "#C9A55A", dim: "rgba(201,165,90,0.12)",
    notionId: "3478c474-cdec-8181-86c6-eeac84ec2d71",
    context: "Riad & Routes is a luxury concierge company offering fully bespoke private journeys for high-net-worth Americans. Morocco-focused with global expansion potential. Highest-margin business. Positioning is exclusive, unhurried, deeply curated. Website: riadandroutes.com. Target: affluent American travelers aged 35–65 seeking authenticity over mass tourism."
  },
  {
    id: "artkech", name: "ArtKech", domain: "artkech.com",
    tagline: "Luxury Design Studio", icon: "◈",
    accent: "#8B9DC3", dim: "rgba(139,157,195,0.12)",
    notionId: "3548c474-cdec-8148-9d6f-ef948cd9ecda",
    context: "ArtKech is a luxury design and publishing studio handling brand identity, design systems, and visual communication for premium clients. Also serves as living proof of ARG-Builder's capabilities in practice. Known for refined, editorial aesthetics. Website: artkech.com. JB personal brand is housed here — cartouche/signet mark, Cormorant Garamond, palette: Void, Antique Brass, Parchment, Verdigris. Tagline: 'Some places require an introduction.'"
  },
  {
    id: "argbuilder", name: "ARG-Builder", domain: "argbuilder.io",
    tagline: "Autonomous AI Intelligence · Enterprise", icon: "⚡",
    accent: "#7B9E87", dim: "rgba(123,158,135,0.12)",
    notionId: "3608c474-cdec-8132-80dc-ea1ee73fe95f",
    context: "ARG-Builder is an autonomous AI intelligence platform creating agent reference guides — a new business category. Primary targets: American mid-sized and enterprise companies, with global reach. Positions as the definitive resource for companies building autonomous AI agents. Website: argbuilder.io. ArtKech is living proof of the system. Currently in active launch phase."
  },
  {
    id: "jb", name: "JB", domain: "Personal Brand",
    tagline: "Personal Brand · Curator", icon: "◇",
    accent: "#C17B5C", dim: "rgba(193,123,92,0.12)",
    notionId: "3548c474-cdec-8148-9d6f-ef948cd9ecda",
    context: "JB is Jamal B.'s personal luxury brand — curated travel philosophy, unhurried and exclusive. Tagline: 'Some places require an introduction.' Cartouche/signet mark in italic Cormorant Garamond. Palette: Void, Antique Brass, Parchment, Verdigris. The personal brand acts as an umbrella for positioning across all three businesses."
  }
];

const SPECIALISTS = {
  "Marketing & Campaign": { icon: "◈", specialists: [
    { id: "brand", name: "Brand Strategist", desc: "Craft brand narratives and positioning", prompt: "You are an expert Brand Strategist with 15+ years building iconic brands. Deliver specific, actionable brand strategy grounded in real positioning principles. Ask sharp questions before recommending. Be direct and confident." },
    { id: "campaign", name: "Campaign Manager", desc: "Plan high-converting marketing campaigns", prompt: "You are an expert Campaign Manager who has run hundreds of successful campaigns. Help plan strategy, timelines, budgets, channels, and KPIs. Think in campaign arcs and measurable outcomes." },
    { id: "email", name: "Email Marketing Specialist", desc: "Build sequences that nurture and convert", prompt: "You are an Email Marketing Specialist who has built programs generating millions in revenue. Expert in sequences, segmentation, subject lines, and deliverability. Write emails that feel personal and convert." },
    { id: "content", name: "Content Marketing Specialist", desc: "Build content engines that compound over time", prompt: "You are a Content Marketing Specialist who builds long-term organic growth engines. Expert in content strategy, editorial calendars, SEO topics, and distribution. Think in compounding content assets." },
    { id: "paid", name: "Paid Ads Specialist", desc: "Maximize ROI across Google, Meta, and beyond", prompt: "You are a Paid Advertising Specialist expert in Meta, Google Ads, and paid social. You think in ROAS, CAC, LTV. Give specific, data-driven recommendations on targeting, creative, and budgets." },
    { id: "seo", name: "SEO Specialist", desc: "Dominate search rankings with precision", prompt: "You are an SEO Specialist who has ranked sites in competitive niches. Expert in keyword research, on-page, technical SEO, and link building. Be technically precise and focused on what actually moves rankings." },
    { id: "influencer", name: "Influencer Marketing Specialist", desc: "Build authentic partnerships that move product", prompt: "You are an Influencer Marketing Specialist expert across nano to mega influencers. You know the difference between reach and resonance. Help with identification, briefs, contracts, and ROI measurement." },
    { id: "research", name: "Market Research Analyst", desc: "Uncover insights that change the game", prompt: "You are a Market Research Analyst who turns data into strategic insight. Expert in competitive analysis, persona development, market sizing, and survey design. Be sharp and insight-driven." },
  ]},
  "Social Media": { icon: "◉", specialists: [
    { id: "instagram", name: "Instagram Strategist", desc: "Build a high-engagement aesthetic presence", prompt: "You are an Instagram Strategist who has grown accounts to hundreds of thousands of followers. Expert in content pillars, captions, Reels, hashtags, and the algorithm. Focus on what drives saves and follows." },
    { id: "linkedin", name: "LinkedIn Specialist", desc: "Build authority and generate inbound leads", prompt: "You are a LinkedIn Specialist who builds thought leadership and inbound pipelines. Expert in profile optimization, content strategy, post writing, and outreach sequences." },
    { id: "tiktok", name: "TikTok Content Creator", desc: "Engineer viral content and platform growth", prompt: "You are a TikTok strategist who speaks the platform natively. Expert in hooks, scripts, trending audio, and growth tactics. You know what entertains vs. what actually grows accounts." },
    { id: "twitter", name: "Twitter / X Strategist", desc: "Build a powerful voice on X", prompt: "You are a Twitter/X Strategist who has built influential accounts and viral threads. Expert in content strategy, thread writing, and audience growth. You understand X culture deeply." },
    { id: "youtube", name: "YouTube Growth Specialist", desc: "Grow a channel that becomes a platform asset", prompt: "You are a YouTube Growth Specialist who builds channels for long-term compounding growth. Expert in video strategy, titles, thumbnails, SEO, and community. Think in platform assets." },
  ]},
  "Sales & Revenue": { icon: "◆", specialists: [
    { id: "copy", name: "Sales Copywriter", desc: "Write copy that sells without feeling salesy", prompt: "You are a Sales Copywriter who writes persuasive, converting copy. Expert in sales pages, VSLs, offers, and CTAs. Apply persuasion, desire, objection handling, and urgency. Every word earns its place." },
    { id: "leadgen", name: "Lead Generation Specialist", desc: "Build predictable pipelines of qualified leads", prompt: "You are a Lead Generation Specialist who builds scalable, consistent lead systems. Expert in lead magnets, landing pages, outbound prospecting, and qualification frameworks. Think in pipeline health." },
    { id: "revenue", name: "Revenue Optimizer", desc: "Find the revenue hiding in your business", prompt: "You are a Revenue Optimization Specialist who finds leverage points where small changes create outsized revenue. Expert in pricing, upsells, churn reduction, and conversion improvements." },
    { id: "pitch", name: "Pitch & Proposal Coach", desc: "Win more deals with compelling pitches", prompt: "You are a Pitch and Proposal Coach who has helped close millions. Expert in investor pitches, proposals, and sales decks. You understand narrative arc and how to make offers irresistible." },
  ]},
  "Writing": { icon: "◇", specialists: [
    { id: "dr-copy", name: "Direct Response Copywriter", desc: "Write words that move people to action", prompt: "You are a Direct Response Copywriter in the tradition of Ogilvy, Halbert, Sugarman. Write headlines, hooks, body copy, and CTAs that command attention. Be bold, specific, and benefit-driven." },
    { id: "blog", name: "Blog & Content Writer", desc: "Create long-form content that ranks and resonates", prompt: "You are a Blog Writer who creates authoritative, well-researched long-form content. Expert in structure, SEO integration, and brand voice. Every paragraph adds value — no filler." },
    { id: "email-seq", name: "Email Sequence Writer", desc: "Craft sequences that build relationships and revenue", prompt: "You are an Email Sequence Writer who takes subscribers from cold to converted. Expert in welcome, nurture, launch, and re-engagement sequences. Your emails feel personal and worth opening." },
    { id: "ghost", name: "Ghostwriter & Narrative Specialist", desc: "Capture voices and tell stories that stick", prompt: "You are a Ghostwriter who captures authentic voices. Expert in thought leadership content, book outlines, speeches, and personal essays. You turn ideas into compelling, readable prose." },
  ]},
  "Operations & Systems": { icon: "⬡", specialists: [
    { id: "automation", name: "Workflow Automation Specialist", desc: "Automate the repetitive, amplify the important", prompt: "You are a Workflow Automation Specialist who designs time-saving systems. Expert in Zapier, Make, n8n, and AI automations. Always ask about the current manual process before designing automation." },
    { id: "pm", name: "Project Manager", desc: "Keep projects on track, on time, on budget", prompt: "You are a seasoned Project Manager expert in agile and traditional methodologies. Help with planning, scope, timelines, resources, risk, and stakeholder communication. Be pragmatic and delivery-focused." },
    { id: "sop", name: "SOP & Process Documentation Writer", desc: "Turn tribal knowledge into repeatable systems", prompt: "You are an SOP Specialist who documents business processes for delegation and scale. Write clear, unambiguous procedures anyone can follow. Ask clarifying questions for completeness." },
    { id: "ops", name: "Business Process Analyst", desc: "Map, analyze, and optimize your operations", prompt: "You are a Business Process Analyst who redesigns operations for maximum output. Expert in process mapping, bottleneck identification, KPI design, and operational improvement. See businesses as optimizable systems." },
  ]},
  "Strategy & Growth": { icon: "▲", specialists: [
    { id: "strategy", name: "Business Strategy Advisor", desc: "A frank strategic advisor in your corner", prompt: "You are a Business Strategy Advisor who thinks like a top consultant and operates like an entrepreneur. Expert in strategic planning, positioning, market entry, and high-stakes decisions. Ask sharp questions. Never be vague." },
    { id: "growth", name: "Growth Hacker", desc: "Find unconventional paths to rapid growth", prompt: "You are a Growth Hacker who finds creative, data-driven paths to rapid growth. You think across the full funnel. Look for 10x opportunities, not 10% improvements. Part marketer, part product, part analyst." },
    { id: "intel", name: "Competitive Intelligence Analyst", desc: "Know your competition better than they know themselves", prompt: "You are a Competitive Intelligence Analyst who reverse-engineers competitor strategies and identifies market gaps. Be thorough, insightful, and strategic in your analysis." },
  ]},
  "Customer Success": { icon: "◎", specialists: [
    { id: "onboard", name: "Onboarding Specialist", desc: "Design onboarding that creates loyal customers fast", prompt: "You are a Customer Onboarding Specialist who gets customers to value quickly. Expert in onboarding flows, welcome emails, and reducing time-to-first-value. Great onboarding is the foundation of retention." },
    { id: "retention", name: "Retention Specialist", desc: "Keep customers longer and reduce churn", prompt: "You are a Customer Retention Specialist who fights churn with data and empathy. Expert in churn signals, intervention programs, and loyalty initiatives. Treat retention as a product discipline." },
    { id: "support", name: "Support Script Writer", desc: "Write support responses that delight and resolve", prompt: "You are a Customer Support Script Writer who crafts responses that solve problems and strengthen relationships. Write templates, escalation scripts, and FAQ responses. Be empathetic, clear, and on-brand." },
  ]},
  "E-commerce": { icon: "◫", specialists: [
    { id: "listings", name: "Product Listing Optimizer", desc: "Write listings that rank and convert", prompt: "You are a Product Listing Specialist for Amazon, Shopify, and Etsy. Write titles, bullets, and descriptions that rank in search and convert browsers. Balance SEO with human psychology." },
    { id: "cro", name: "Conversion Rate Specialist", desc: "Turn more visitors into paying customers", prompt: "You are a CRO Specialist for e-commerce. Analyze store pages, identify conversion barriers, and write higher-converting copy. Think about every micro-decision in the buying journey." },
    { id: "launch", name: "Store Launch Strategist", desc: "Launch your store with momentum and early sales", prompt: "You are a Store Launch Strategist who helps new stores hit the ground running. Expert in pre-launch strategy, launch marketing, and first-month customer acquisition. Build buzz, then convert it." },
  ]},
  "Daily AI Assistant": { icon: "◌", specialists: [
    { id: "planner", name: "Daily Planner & Prioritization Coach", desc: "Start every day with clarity and intention", prompt: "You are a Daily Planning Coach who helps high-performers make the most of their time. Expert in scheduling, Eisenhower Matrix, MITs, and deep work routines. Be direct, pragmatic, execution-focused." },
    { id: "research-ai", name: "Research Assistant", desc: "Fast, thorough research on any topic", prompt: "You are a Research Assistant who synthesizes information quickly and accurately. Summarize findings, compare options, and provide structured overviews. Structure output clearly and flag uncertainties." },
    { id: "decision", name: "Decision Coach", desc: "Make better decisions with structured thinking", prompt: "You are a Decision Coach who applies structured frameworks — pros/cons, second-order thinking, pre-mortems — to help people choose confidently. Ask great questions before giving advice." },
  ]},
};

const ALL_SPECS = Object.entries(SPECIALISTS).flatMap(([cat, {specialists}]) =>
  specialists.map(s => ({ ...s, category: cat }))
);

const extractText = (data) =>
  (data?.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();

const renderMd = (t) => t
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.*?)\*/g, "<em>$1</em>")
  .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 6px;border-radius:3px;font-family:monospace;font-size:0.85em">$1</code>')
  .replace(/^#{1,3} (.+)$/gm, "<strong>$1</strong>")
  .replace(/^[•\-] (.+)$/gm, "· $1")
  .replace(/\n\n/g, "<br/><br/>")
  .replace(/\n/g, "<br/>");

export default function App() {
  const [biz, setBiz] = useState(null);
  const [cat, setCat] = useState("Marketing & Campaign");
  const [specialist, setSpecialist] = useState(null);
  const [notionCtx, setNotionCtx] = useState("");
  const [ctxLoading, setCtxLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const msgEnd = useRef(null);
  const inp = useRef(null);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (specialist) setTimeout(() => inp.current?.focus(), 200); }, [specialist]);

  const loadNotionCtx = async (business, spec) => {
    setCtxLoading(true);
    setNotionCtx("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "Search Notion for pages about the given business. Return a concise 3-5 bullet summary of active projects, key priorities, and strategic context. Under 180 words. Be specific.",
          messages: [{ role: "user", content: `Search Notion for pages about: ${business.name}. Summarize the most relevant active context for a ${spec.name} specialist session today.` }],
          mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" }]
        })
      });
      const data = await res.json();
      setNotionCtx(extractText(data));
    } catch { setNotionCtx(""); }
    finally { setCtxLoading(false); }
  };

  const openSpecialist = (spec) => {
    setSpecialist(spec);
    setSaved(null);
    setMessages([{ role: "assistant", content: `Connected to your **${spec.name}** for **${biz.name}**.\n\nI have your workspace context loading. What are we working on today?` }]);
    setInput("");
    loadNotionCtx(biz, spec);
  };

  const buildSystemPrompt = () => {
    const base = specialist?.prompt || "";
    const bizCtx = `\n\n## Active Business: ${biz?.name} (${biz?.domain})\n${biz?.context}`;
    const nCtx = notionCtx ? `\n\n## Live Notion Workspace Context\n${notionCtx}` : "";
    return `${base}${bizCtx}${nCtx}\n\nAlways ground your advice in the specific context and positioning of ${biz?.name}. Be direct, specific, and actionable.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: next.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "Error — please retry." }]);
    } catch { setMessages(p => [...p, { role: "assistant", content: "Connection error — please retry." }]); }
    finally { setLoading(false); }
  };

  const saveToNotion = async () => {
    setSaving(true); setSaved(null);
    try {
      const log = messages.map(m => `**${m.role === "user" ? "You" : specialist.name}**: ${m.content}`).join("\n\n");
      const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "You are a Notion page creator. Create a structured session log page under the given parent page ID. Return a confirmation with the page title.",
          messages: [{ role: "user", content: `Create a Notion page under parent page ID: ${biz.notionId}\n\nTitle: "🤖 AI Session — ${specialist.name} — ${date}"\n\nContent:\n## Session Details\n- Business: ${biz.name}\n- Specialist: ${specialist.name} (${specialist.category})\n- Date: ${date}\n\n## Conversation Log\n${log}\n\n## Action Items\nExtract and list any action items, deliverables, or next steps from this conversation as bullet points.` }],
          mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" }]
        })
      });
      const data = await res.json();
      const txt = extractText(data);
      setSaved({ ok: true, msg: txt.slice(0, 120) || "Session logged to Notion." });
    } catch { setSaved({ ok: false, msg: "Failed to save. Check Notion connection." }); }
    finally { setSaving(false); }
  };

  const displayed = q
    ? ALL_SPECS.filter(s => `${s.name} ${s.category} ${s.desc}`.toLowerCase().includes(q.toLowerCase()))
    : SPECIALISTS[cat]?.specialists || [];

  const accent = biz?.accent || "#C9A55A";
  const dim = biz?.dim || "rgba(201,165,90,0.12)";

  if (!biz) return (
    <div className="jamal-hub">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .jamal-hub,.jamal-hub *{box-sizing:border-box}
        .jamal-hub{margin:0;padding:0;background:#0D0D0D;color:#E8E0D0;font-family:'DM Sans',sans-serif;min-height:100%;height:100%}
        .jamal-hub ::-webkit-scrollbar{width:6px}.jamal-hub ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        .sel{min-height:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;background:radial-gradient(ellipse 80% 60% at 50% 20%,rgba(201,165,90,0.04) 0%,transparent 70%)}
        .sel-head{text-align:center;margin-bottom:52px}
        .sel-tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(232,224,208,0.35);margin-bottom:12px}
        .sel-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,5vw,52px);font-weight:300;line-height:1.1;color:#E8E0D0}
        .sel-title em{font-style:italic;color:#C9A55A}
        .sel-sub{font-size:14px;color:rgba(232,224,208,0.4);margin-top:14px;letter-spacing:0.02em}
        .biz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;max-width:960px;width:100%}
        .biz-card{background:#141414;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:28px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden}
        .biz-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.02),transparent);pointer-events:none}
        .biz-card:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.5)}
        .biz-icon{font-size:24px;margin-bottom:16px;display:block}
        .biz-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin-bottom:4px}
        .biz-domain{font-size:11px;letter-spacing:0.08em;color:rgba(232,224,208,0.35);margin-bottom:10px;text-transform:uppercase}
        .biz-tag{font-size:12.5px;color:rgba(232,224,208,0.5);line-height:1.4}
        .biz-line{height:1px;margin:16px 0;opacity:0.3}
        .biz-cta{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,224,208,0.3);display:flex;align-items:center;gap:6px;transition:color 0.2s}
        .biz-card:hover .biz-cta{color:rgba(232,224,208,0.6)}
      `}</style>
      <div className="sel">
        <div className="sel-head">
          <div className="sel-tag">AI Specialist Hub · Powered by Claude</div>
          <h1 className="sel-title">Select your <em>workspace</em></h1>
          <p className="sel-sub">Specialists across 9 disciplines — context-loaded, Notion-connected</p>
        </div>
        <div className="biz-grid">
          {BUSINESSES.map(b => (
            <div key={b.id} className="biz-card" onClick={() => setBiz(b)}
              style={{ "--acc": b.accent }}>
              <span className="biz-icon">{b.icon}</span>
              <div className="biz-name" style={{ color: b.accent }}>{b.name}</div>
              <div className="biz-domain">{b.domain}</div>
              <div className="biz-tag">{b.tagline}</div>
              <div className="biz-line" style={{ background: b.accent }} />
              <div className="biz-cta">Open Hub <span>→</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="jamal-hub">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .jamal-hub,.jamal-hub *{box-sizing:border-box}
        .jamal-hub{margin:0;padding:0;background:#0D0D0D;color:#E8E0D0;font-family:'DM Sans',sans-serif;min-height:100%;height:100%}
        .jamal-hub ::-webkit-scrollbar{width:6px}.jamal-hub ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
        .hub{display:flex;height:100%;min-height:100%;overflow:hidden}
        .sb{width:17rem;flex-shrink:0;background:#111;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;min-height:0;overflow:hidden}
        .sb-top{padding:20px 18px 16px;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0}
        .sb-back{display:flex;align-items:center;gap:8px;cursor:pointer;color:rgba(232,224,208,0.4);font-size:12px;letter-spacing:0.04em;padding:6px 0;transition:color 0.15s;margin-bottom:14px}
        .sb-back:hover{color:rgba(232,224,208,0.7)}
        .sb-biz{display:flex;align-items:center;gap:10px}
        .sb-biz-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .sb-biz-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;line-height:1.2}
        .sb-biz-domain{font-size:11px;color:rgba(232,224,208,0.35);letter-spacing:0.06em;margin-top:3px}
        .sb-nav{padding:12px 10px 16px;flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:6px}
        .nav-it{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;transition:all 0.15s;border-left:2px solid transparent;border-radius:10px;font-size:14px;line-height:1.3;color:rgba(232,224,208,0.45);letter-spacing:0.01em;flex-shrink:0}
        .nav-it:hover{color:rgba(232,224,208,0.75);background:rgba(255,255,255,0.03)}
        .nav-it.on{color:#E8E0D0;border-left-color:var(--acc);background:rgba(255,255,255,0.05);box-shadow:0 0 0 1px rgba(255,255,255,0.04)}
        .nav-ic{font-size:12px;width:16px;text-align:center;flex-shrink:0;opacity:0.85}
        .nav-n{flex:1;min-width:0}
        .nav-b{margin-left:auto;font-size:10px;color:rgba(232,224,208,0.25);background:rgba(255,255,255,0.04);border-radius:10px;padding:2px 7px;flex-shrink:0}
        .nav-it.on .nav-b{color:var(--acc);background:var(--acc-dim)}
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .tbar{padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);background:#111;display:flex;align-items:center;gap:12px;flex-shrink:0}
        .tbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400}
        .tbar-sub{font-size:11.5px;color:rgba(232,224,208,0.35);margin-top:1px}
        .srch{margin-left:auto;position:relative}
        .srch input{background:#1A1A1A;border:1px solid rgba(255,255,255,0.07);color:#E8E0D0;font-family:'DM Sans',sans-serif;font-size:12.5px;padding:7px 12px 7px 30px;border-radius:6px;width:200px;outline:none;transition:border 0.2s}
        .srch input:focus{border-color:rgba(255,255,255,0.15)}
        .srch input::placeholder{color:rgba(232,224,208,0.2)}
        .srch-ic{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:rgba(232,224,208,0.2);font-size:12px;pointer-events:none}
        .grid-wrap{flex:1;overflow-y:auto;padding:20px 24px}
        .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
        .card{background:#141414;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:18px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden}
        .card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.015),transparent);pointer-events:none}
        .card:hover{border-color:rgba(255,255,255,0.1);background:#1A1A1A;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.4)}
        .card-line{height:2px;border-radius:1px;width:24px;margin-bottom:12px}
        .card-cat-lbl{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,224,208,0.25);margin-bottom:5px}
        .card-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400;margin-bottom:5px;line-height:1.2}
        .card-desc{font-size:12px;color:rgba(232,224,208,0.45);line-height:1.5}
        .card-cta{margin-top:12px;font-size:11px;letter-spacing:0.07em;text-transform:uppercase;color:rgba(232,224,208,0.25);display:flex;align-items:center;gap:5px;transition:color 0.2s}
        .card:hover .card-cta{color:rgba(232,224,208,0.5)}
        .card-arrow{transition:transform 0.2s}
        .card:hover .card-arrow{transform:translateX(3px)}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fi 0.2s}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .panel{width:100%;max-width:740px;height:84vh;max-height:720px;background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.8);animation:su 0.25s ease}
        @keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .phead{padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:12px;flex-shrink:0}
        .pav{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .pmeta{flex:1;min-width:0}
        .pname{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400}
        .prole{font-size:11px;color:rgba(232,224,208,0.4);margin-top:1px;letter-spacing:0.03em}
        .pctx{display:flex;align-items:center;gap:6px;font-size:10.5px;color:rgba(232,224,208,0.3);letter-spacing:0.04em}
        .ctx-dot{width:5px;height:5px;border-radius:50%;animation:pulse 1.5s infinite}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        .pclose{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:rgba(232,224,208,0.4);width:28px;height:28px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all 0.15s;flex-shrink:0}
        .pclose:hover{background:rgba(255,255,255,0.08);color:#E8E0D0}
        .psave{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(232,224,208,0.35);font-family:'DM Sans',sans-serif;font-size:11px;padding:5px 10px;border-radius:5px;cursor:pointer;transition:all 0.15s;letter-spacing:0.04em;display:flex;align-items:center;gap:5px;flex-shrink:0}
        .psave:hover{background:rgba(255,255,255,0.07);color:rgba(232,224,208,0.6)}
        .psave:disabled{opacity:0.4;cursor:not-allowed}
        .msgs{flex:1;overflow-y:auto;padding:18px 20px;display:flex;flex-direction:column;gap:14px}
        .msg{display:flex;gap:8px;animation:mi 0.2s}
        @keyframes mi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .msg.user{flex-direction:row-reverse}
        .mbub{max-width:80%;padding:10px 14px;border-radius:9px;font-size:13.5px;line-height:1.65}
        .msg.asst .mbub{background:#1A1A1A;border:1px solid rgba(255,255,255,0.06);border-radius:2px 9px 9px 9px}
        .msg.user .mbub{background:var(--acc-dim);border:1px solid rgba(255,255,255,0.06);border-radius:9px 2px 9px 9px}
        .mdot{width:6px;height:6px;border-radius:50%;margin-top:13px;flex-shrink:0}
        .typing{display:flex;gap:4px;padding:4px 0}
        .tdot{width:5px;height:5px;border-radius:50%;background:rgba(232,224,208,0.2);animation:b 1.2s infinite}
        .tdot:nth-child(2){animation-delay:0.2s}.tdot:nth-child(3){animation-delay:0.4s}
        @keyframes b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
        .ctx-banner{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:8px 12px;margin:0 20px 0;font-size:11.5px;color:rgba(232,224,208,0.4);display:flex;align-items:center;gap:7px;flex-shrink:0}
        .saved-banner{margin:0 20px;border-radius:6px;padding:8px 12px;font-size:11.5px;flex-shrink:0;animation:mi 0.3s}
        .pinput{padding:14px 20px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;flex-shrink:0;background:#141414}
        .pinput textarea{flex:1;background:#1A1A1A;border:1px solid rgba(255,255,255,0.07);color:#E8E0D0;font-family:'DM Sans',sans-serif;font-size:13.5px;padding:9px 13px;border-radius:7px;outline:none;resize:none;transition:border 0.2s;line-height:1.5;min-height:38px;max-height:100px}
        .pinput textarea:focus{border-color:rgba(255,255,255,0.14)}
        .pinput textarea::placeholder{color:rgba(232,224,208,0.2)}
        .sbtn{width:38px;height:38px;border:none;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all 0.15s;flex-shrink:0;align-self:flex-end}
        .sbtn:hover{transform:scale(1.04)}.sbtn:disabled{opacity:0.3;cursor:not-allowed;transform:none}
      `}</style>

      <div className="hub" style={{ "--acc": accent, "--acc-dim": dim }}>
        <div className="sb">
          <div className="sb-top">
            <div className="sb-back" onClick={() => { setBiz(null); setSpecialist(null); }}>← All Workspaces</div>
            <div className="sb-biz">
              <div className="sb-biz-dot" style={{ background: accent }} />
              <div>
                <div className="sb-biz-name">{biz.name}</div>
                <div className="sb-biz-domain">{biz.domain}</div>
              </div>
            </div>
          </div>
          <nav className="sb-nav">
            {Object.entries(SPECIALISTS).map(([c, { icon, specialists }]) => (
              <div key={c} className={`nav-it ${cat === c && !q ? "on" : ""}`}
                onClick={() => { setCat(c); setQ(""); }}
                style={{ "--acc": accent, "--acc-dim": dim }}>
                <span className="nav-ic">{icon}</span>
                <span className="nav-n">{c}</span>
                <span className="nav-b">{specialists.length}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="main">
          <div className="tbar">
            <div>
              <div className="tbar-title">{q ? "Search Results" : cat}</div>
              <div className="tbar-sub">{(q ? displayed : SPECIALISTS[cat]?.specialists || []).length} specialists · {biz.name}</div>
            </div>
            <div className="srch">
              <span className="srch-ic">⌕</span>
              <input placeholder="Search specialists..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>
          <div className="grid-wrap">
            <div className="cards">
              {displayed.map(s => (
                <div key={s.id} className="card" onClick={() => openSpecialist({ ...s, category: q ? s.category : cat })}>
                  <div className="card-line" style={{ background: accent }} />
                  {q && <div className="card-cat-lbl">{s.category}</div>}
                  <div className="card-name">{s.name}</div>
                  <div className="card-desc">{s.desc}</div>
                  <div className="card-cta">Open Session <span className="card-arrow">→</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {specialist && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setSpecialist(null)}
          style={{ "--acc": accent, "--acc-dim": dim }}>
          <div className="panel">
            <div className="phead">
              <div className="pav" style={{ background: dim, color: accent }}>
                {SPECIALISTS[specialist.category]?.icon || "◈"}
              </div>
              <div className="pmeta">
                <div className="pname">{specialist.name}</div>
                <div className="prole">{specialist.category} · {biz.name}</div>
              </div>
              {ctxLoading ? (
                <div className="pctx">
                  <div className="ctx-dot" style={{ background: accent }} />
                  Loading Notion context…
                </div>
              ) : notionCtx ? (
                <div className="pctx" style={{ color: accent }}>
                  ✓ Notion context loaded
                </div>
              ) : null}
              {messages.length > 3 && (
                <button className="psave" onClick={saveToNotion} disabled={saving}>
                  {saving ? "Saving…" : "⊕ Log to Notion"}
                </button>
              )}
              <button className="pclose" onClick={() => setSpecialist(null)}>✕</button>
            </div>

            {saved && (
              <div className="saved-banner" style={{
                background: saved.ok ? "rgba(123,158,135,0.12)" : "rgba(193,100,80,0.12)",
                border: `1px solid ${saved.ok ? "rgba(123,158,135,0.3)" : "rgba(193,100,80,0.3)"}`,
                color: saved.ok ? "#7BAA8C" : "#C16450"
              }}>
                {saved.ok ? "✓ " : "✗ "}{saved.msg}
              </div>
            )}

            <div className="msgs">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === "user" ? "user" : "asst"}`}>
                  <div className="mdot" style={{ background: m.role === "assistant" ? accent : "rgba(255,255,255,0.12)" }} />
                  <div className="mbub" dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
                </div>
              ))}
              {loading && (
                <div className="msg asst">
                  <div className="mdot" style={{ background: accent }} />
                  <div className="mbub"><div className="typing"><div className="tdot"/><div className="tdot"/><div className="tdot"/></div></div>
                </div>
              )}
              <div ref={msgEnd} />
            </div>

            <div className="pinput">
              <textarea ref={inp} value={input} placeholder={`Ask your ${specialist.name}…`}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1} />
              <button className="sbtn" onClick={send} disabled={loading || !input.trim()}
                style={{ background: accent, color: "#0D0D0D" }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
