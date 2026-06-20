import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { Integration, IntegrationCategory } from "@shared/types";

const CATEGORIES: IntegrationCategory[] = [
  "Communication",
  "Productivity",
  "CRM & Business",
  "Voice & Calls",
  "Developer",
  "Knowledge",
];

export function Integrations() {
  const [items, setItems] = useState<Integration[]>([]);

  useEffect(() => {
    api.integrations().then(setItems).catch(() => {});
  }, []);

  async function toggle(i: Integration) {
    const next = i.status === "connected" ? "available" : "connected";
    const updated = await api.setIntegration(i.id, next);
    setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  }

  return (
    <div>
      <SectionTitle
        title="Gateway"
        sub="Connect once. Every message flows through Nexus — replies go back out through the original channel."
      />
      {CATEGORIES.map((cat) => {
        const group = items.filter((i) => i.category === cat);
        if (group.length === 0) return null;
        return (
          <div key={cat} className="mb-7">
            <h3 className="text-sm font-semibold text-[var(--color-muted)] mb-3">{cat}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.map((i) => (
                <Card key={i.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{i.emoji}</div>
                    {i.status === "connected" ? (
                      <Badge tone="live"><Check className="w-3 h-3" /> connected</Badge>
                    ) : i.status === "beta" ? (
                      <Badge tone="warn">beta</Badge>
                    ) : (
                      <Badge tone="muted">available</Badge>
                    )}
                  </div>
                  <p className="font-semibold text-sm mt-2">{i.name}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">{i.description}</p>
                  <button
                    onClick={() => toggle(i)}
                    className="mt-3 w-full text-xs font-medium rounded-lg py-2 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    {i.status === "connected" ? "Disconnect" : (<><Plus className="w-3 h-3" /> Connect</>)}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
