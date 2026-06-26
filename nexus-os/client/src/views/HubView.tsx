import { getHubComponent } from "@/hub/loader";
import { SectionTitle, Card } from "@/components/ui";

export function HubView() {
  const Hub = getHubComponent();

  if (!Hub) {
    return (
      <div>
        <SectionTitle title="Hub Specialist" sub="jamal-hub-v2 — your AI Specialist Hub." />
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">
            Hub component not found. Drop <span className="font-mono text-[var(--color-text)]">jamal-hub-v2.jsx</span> into{" "}
            <span className="font-mono">client/src/hub/</span> and it will render here. Its roster already powers the Brain&apos;s specialists.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="-m-6 h-[calc(100%+3rem)]">
      <Hub />
    </div>
  );
}
