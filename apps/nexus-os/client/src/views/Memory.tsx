import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { MemoryItem } from "@shared/types";

const KINDS: MemoryItem["kind"][] = ["preference", "fact", "relationship", "decision", "note"];

export function Memory() {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [kind, setKind] = useState<MemoryItem["kind"]>("preference");
  const [content, setContent] = useState("");

  const load = () => api.memory().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add() {
    if (!content.trim()) return;
    await api.addMemory(kind, content.trim());
    setContent("");
    load();
  }

  return (
    <div>
      <SectionTitle title="Memory" sub="Compounding context — the longer you use Nexus, the better it understands you and your businesses." />

      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as MemoryItem["kind"])}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          >
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Teach Nexus something it should remember…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button onClick={add} className="inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg px-4 py-2 bg-gradient-to-br from-indigo-500 to-teal-400 text-[#07090f]">
            <Plus className="w-4 h-4" /> Remember
          </button>
        </div>
      </Card>

      <div className="space-y-2.5">
        {items.map((m) => (
          <Card key={m.id} className="p-3.5 flex items-start gap-3">
            <Badge tone="ok" className="shrink-0 mt-0.5">{m.kind}</Badge>
            <p className="text-sm flex-1">{m.content}</p>
            <span className="text-[10px] text-[var(--color-muted)] shrink-0">{new Date(m.createdAt).toLocaleDateString()}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
