import { Link } from "wouter";
import { Network, Hexagon, Play, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import ProductProofBar from "./ProductProofBar";

export default function ProductDemoSection() {
  return (
    <section id="demo" className="py-20 px-4 border-y border-border/60 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-medium mb-2">
            See it in action
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Interactive product demo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the knowledge graph and Nexus OS console — the same surfaces we use in founding-client demos.
          </p>
        </div>

        <ProductProofBar className="mb-8 max-w-3xl mx-auto" compact />

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/graph">
            <div className="group rounded-xl border border-border bg-card p-6 sm:p-8 hover:border-cyan-500/40 transition-colors h-full cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Knowledge graph</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Zoom into nodes, follow dependencies, find load-bearing SOPs before someone leaves.
              </p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Open /graph <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <a href={`${BRAND.nexusOsPath}/`}>
            <div className="group rounded-xl border border-border bg-card p-6 sm:p-8 hover:border-indigo-500/40 transition-colors h-full cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <Hexagon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{BRAND.nexusOsName}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ask once — multi-agent execution with approvals. Slack, Notion, and Gmail in one runtime.
              </p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Open {BRAND.nexusOsPath} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/request-demo">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold gap-2">
              <Play className="w-4 h-4" />
              Book a 15-min demo
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-border">
              Sign in to workspace
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
