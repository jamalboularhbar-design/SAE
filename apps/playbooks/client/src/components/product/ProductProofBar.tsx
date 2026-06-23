import { PLATFORM_STATS } from "@shared/platformStats";
import { BRAND } from "@/lib/brand";

type ProductProofBarProps = {
  className?: string;
  compact?: boolean;
};

export default function ProductProofBar({ className = "", compact }: ProductProofBarProps) {
  const items = [
    { value: `${PLATFORM_STATS.documents}+`, label: "playbooks" },
    { value: PLATFORM_STATS.graphEdges.toLocaleString(), label: "graph edges" },
    { value: String(PLATFORM_STATS.aiTools), label: "AI tools" },
    { value: String(PLATFORM_STATS.businessFunctions), label: "functions" },
  ];

  return (
    <div
      className={`rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-3 sm:px-6 sm:py-4 ${className}`}
      role="region"
      aria-label="Platform metrics"
    >
      <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 ${compact ? "text-sm" : ""}`}>
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="hidden sm:inline text-border">·</span>}
            <span className="font-semibold text-teal-700 dark:text-teal-300 tabular-nums">{item.value}</span>
            <span className="text-muted-foreground text-xs sm:text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      {!compact && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          {PLATFORM_STATS.liveProofLabel} · {BRAND.nexusOsName} at {BRAND.nexusOsPath}
        </p>
      )}
    </div>
  );
}
