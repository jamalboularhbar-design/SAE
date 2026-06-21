import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { Specialist, Workspace } from "@shared/types";

export function Team({ specialists }: { specialists: Specialist[] }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    api.workspaces().then(setWorkspaces).catch(() => {});
  }, []);

  const roster = specialists.filter((s) => s.id !== "chief-of-staff");
  const categories = Array.from(new Set(roster.map((s) => s.category)));

  return (
    <div>
      <SectionTitle
        title="Specialists"
        sub={`Your Hub roster — ${roster.length} specialists across ${categories.length} disciplines, plus the Chief of Staff who orchestrates them.`}
      />

      <h3 className="text-sm font-semibold text-[var(--color-muted)] mb-3">Business workspaces</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {workspaces.map((w) => (
          <Card key={w.id} className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{w.icon}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: w.accent }}>{w.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">{w.domain}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-2">{w.tagline}</p>
          </Card>
        ))}
      </div>

      {categories.map((cat) => {
        const group = roster.filter((s) => s.category === cat);
        return (
          <div key={cat} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base" style={{ color: group[0]?.accent }}>{group[0]?.emoji}</span>
              <h3 className="text-sm font-semibold">{cat}</h3>
              <Badge tone="muted" className="text-[10px]">{group.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.map((s) => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: `${s.accent}22`, border: `1px solid ${s.accent}55` }}>
                      {s.emoji}
                    </div>
                    <p className="font-semibold text-sm leading-tight">{s.name}</p>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">{s.role}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
