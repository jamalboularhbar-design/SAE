import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { Skill, Specialist } from "@shared/types";

export function Skills({ specialists }: { specialists: Specialist[] }) {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    api.skills().then(setSkills).catch(() => {});
  }, []);

  return (
    <div>
      <SectionTitle title="Skills" sub="Modular expertise the Brain can invoke. Each skill belongs to a specialist." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((s) => {
          const sp = specialists.find((x) => x.id === s.specialist);
          return (
            <Card key={s.id} className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.emoji}</span>
                <p className="font-semibold text-sm">{s.name}</p>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">{s.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone="ok">{sp?.emoji} {sp?.name}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
