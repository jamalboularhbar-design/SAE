import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight, ArrowLeft, Package, CheckCircle2, Sparkles, Download, Layers, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { TEMPLATE_BUNDLES, TEMPLATE_CLUB } from "@shared/templateBundles";
import type { TemplateBundleId } from "@shared/templateBundles";
import SEO from "@/components/SEO";
import VerticalShowcase from "@/components/VerticalShowcase";

function LogoMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 text-white font-bold flex items-center justify-center text-[11px] tracking-tight shrink-0">
      NX
    </div>
  );
}

export default function TemplatesBundlesPage() {
  const [, navigate] = useLocation();
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifiedBundle, setNotifiedBundle] = useState<string | null>(null);

  const { data: checkout } = trpc.templateStore.checkout.useQuery();
  const storeLive = checkout?.live ?? false;

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("You're on the list — we'll email when checkout goes live.");
      setNotifyEmail("");
    },
    onError: () => toast.error("Something went wrong. Try again or email us directly."),
  });

  const handleNotify = (bundleId: string, bundleName: string) => {
    if (!notifyEmail.trim()) {
      toast.error("Enter your email above first");
      return;
    }
    setNotifiedBundle(bundleId);
    submitLead.mutate({
      fullName: "Template waitlist",
      email: notifyEmail.trim(),
      message: `Template bundle waitlist: ${bundleName}`,
      source: "template_waitlist",
      utmSource: "templates",
      utmMedium: "bundle",
      utmCampaign: bundleId,
    });
  };

  const handleBuy = (bundleId: TemplateBundleId, url: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    handleNotify(bundleId, TEMPLATE_BUNDLES.find((b) => b.id === bundleId)?.name ?? bundleId);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <SEO
        title="Templates"
        description={`${BRAND.parentName} Templates — curated operational playbook bundles from $49. Import to Notion or upgrade to ${BRAND.productName} with bundle credit.`}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/product" className="flex items-center gap-3">
            <LogoMark />
            <span className="text-xl font-bold tracking-tight">{BRAND.parentName} Templates</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/product">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-1" /> Product
              </Button>
            </Link>
            <Link href="/start-trial?plan=professional&utm_source=templates&utm_medium=page&utm_campaign=bundle_cta">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
                Try Playbooks Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/20">
            {storeLive ? "Available now" : "Phase 1 — Templates Marketplace"}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Operational playbooks you can{" "}
            <span className="text-teal-400">{storeLive ? "buy today" : "pre-order soon"}</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Curated SOP bundles in Notion, Markdown, and Google Docs. Every purchase includes credit toward{" "}
            {BRAND.productName}.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-14">
          <p className="text-sm text-gray-400 text-center mb-3">
            {storeLive ? "Bundle updates & new releases:" : "Get notified when Gumroad checkout goes live:"}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <Button
              className="bg-teal-500 hover:bg-teal-400 text-black font-semibold shrink-0"
              onClick={() => handleNotify("all", "All template bundles")}
              disabled={submitLead.isPending}
            >
              Notify me
            </Button>
          </div>
        </div>

        {/* Flywheel */}
        <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { step: "1", title: "Templates", desc: "Buy a bundle — instant download", icon: Download },
            { step: "2", title: "Playbooks", desc: "Import + run live with AI tools", icon: Layers },
            { step: "3", title: "Scale", desc: "Add workspaces as you grow brands", icon: Sparkles },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs font-mono text-teal-400">{step}</span>
              <Icon className="w-6 h-6 text-teal-400 mx-auto my-3" />
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bundles grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TEMPLATE_BUNDLES.map((bundle) => {
            const checkoutUrl = checkout?.bundles?.[bundle.id] ?? null;
            const canBuy = Boolean(checkoutUrl);

            return (
              <div
                key={bundle.id}
                className={`relative p-6 rounded-2xl border flex flex-col text-left ${
                  bundle.id === "agency"
                    ? "bg-gradient-to-b from-teal-500/10 to-white/[0.02] border-teal-500/30"
                    : "bg-white/[0.03] border-white/10"
                }`}
              >
                {bundle.badge && (
                  <span className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-teal-500 text-black text-[10px] font-bold uppercase tracking-wide">
                    {bundle.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3 mt-1">
                  <Package className="w-5 h-5 text-teal-400" />
                  <h2 className="text-lg font-bold">{bundle.name}</h2>
                </div>
                <p className="text-3xl font-bold mb-1">
                  ${bundle.price}
                  <span className="text-sm text-gray-400 font-normal"> one-time</span>
                </p>
                <p className="text-xs text-teal-400 font-medium mb-3">{bundle.credit}</p>
                <p className="text-sm text-gray-400 mb-4 flex-1">{bundle.description}</p>
                <ul className="space-y-2 mb-5">
                  {bundle.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-gray-500 mb-3">
                  {bundle.docCount}+ docs · {bundle.formats.join(" · ")}
                </p>
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold"
                  onClick={() => handleBuy(bundle.id, checkoutUrl)}
                  disabled={submitLead.isPending && notifiedBundle === bundle.id}
                >
                  {canBuy ? (
                    <>
                      Buy now <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  ) : notifiedBundle === bundle.id ? (
                    "You're on the list!"
                  ) : (
                    "Notify me at launch"
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <VerticalShowcase variant="dark" compact />
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
          <h2 className="text-2xl font-bold mb-2">{TEMPLATE_CLUB.name}</h2>
          <p className="text-gray-400 mb-4">
            ${TEMPLATE_CLUB.price}/{TEMPLATE_CLUB.interval} — {TEMPLATE_CLUB.description}
          </p>
          {checkout?.templateClub ? (
            <Button
              className="bg-purple-500 hover:bg-purple-400 text-white font-semibold"
              onClick={() => window.open(checkout.templateClub!, "_blank")}
            >
              Join Template Club <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/start-trial?utm_source=templates&utm_medium=club&utm_campaign=template_club">
              <Button variant="outline" className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10">
                Start with Playbooks instead <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-3">Already have templates?</h2>
          <p className="text-gray-400 mb-6">
            Import into {BRAND.productName} and unlock {BRAND.aiHubTitle}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-teal-500 hover:bg-teal-400 text-black font-semibold"
              onClick={() => navigate("/start-trial?plan=professional&utm_source=templates&utm_medium=footer")}
            >
              Start 14-day free trial
            </Button>
            <Link href="/roi">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Calculate ROI
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
