import { Link } from "wouter";
import { Play, Compass } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import ProductProofBar from "./ProductProofBar";
import KnowledgeGraphTeaser from "./KnowledgeGraphTeaser";
import NexusOsDemoTeaser from "./NexusOsDemoTeaser";
import ExamplePromptsPanel from "./ExamplePromptsPanel";

export default function ProductDemoSection() {
  return (
    <section id="demo" className="py-20 px-4 border-y border-border/60 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-medium mb-2">
            Try it now — no signup required
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Interactive product demo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the knowledge graph and Hub Specialist demo — the same jamal-hub-v2 roster that powers{' '}
            {BRAND.nexusOsName} at {BRAND.nexusOsPath}.
          </p>
        </div>

        <ProductProofBar className="mb-8 max-w-3xl mx-auto" compact />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <KnowledgeGraphTeaser />
          <NexusOsDemoTeaser />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExamplePromptsPanel title="Example queries — paste into AI or Nexus OS" />
          </div>
          <div className="flex flex-col justify-center gap-3 p-6 rounded-xl border border-border bg-card/50">
            <p className="text-sm font-semibold text-foreground">Guided exploration</p>
            <p className="text-sm text-muted-foreground">
              New here? Start with the library, follow a dependency in the graph, then ask Nexus OS to execute a playbook.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/toc">
                <Button variant="outline" className="w-full justify-start border-border gap-2">
                  <Compass className="w-4 h-4" /> Browse the library
                </Button>
              </Link>
              <Link href="/graph">
                <Button variant="outline" className="w-full justify-start border-border gap-2">
                  Open knowledge graph
                </Button>
              </Link>
              <Link href="/request-demo">
                <Button className="w-full justify-start bg-teal-500 hover:bg-teal-400 text-black gap-2">
                  <Play className="w-4 h-4" /> Book a 15-min demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
