import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, Network, Brain, Hexagon, ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const JOURNEY = [
  {
    icon: BookOpen,
    title: 'Library',
    subtitle: '570+ playbooks',
    description: 'Structured, versioned operating docs across every business function.',
    href: '/toc',
    color: 'from-teal-500/20 to-teal-500/5',
    iconColor: 'text-teal-400',
    border: 'border-teal-500/30',
  },
  {
    icon: Network,
    title: 'Graph',
    subtitle: '2,595+ edges',
    description: 'Dependencies and cross-references — know what is load-bearing.',
    href: '/graph',
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  {
    icon: Brain,
    title: 'Intelligence',
    subtitle: '11 AI tools',
    description: 'Semantic search, writing assistant, chat — wired to your library.',
    href: BRAND.aiHubPath,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  {
    icon: Hexagon,
    title: 'Runtime',
    subtitle: BRAND.nexusOsName,
    description: 'Ask once. Execute across Slack, Notion, Gmail with approvals.',
    href: `${BRAND.nexusOsPath}/`,
    external: true,
    color: 'from-indigo-500/20 to-indigo-500/5',
    iconColor: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
] as const;

export default function ProductPlatformJourney() {
  const [active, setActive] = useState(0);

  return (
    <section id="platform-journey" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-medium mb-2">
            The full stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Library → Graph → Intelligence → Runtime
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            One platform — from reference docs to autonomous execution. Click each layer to explore.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative mb-8">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-border -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-[8%] h-0.5 bg-gradient-to-r from-teal-500 via-purple-500 to-indigo-500 -translate-y-1/2"
            initial={{ width: 0 }}
            whileInView={{ width: `${(active / (JOURNEY.length - 1)) * 84}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
          <div className="grid grid-cols-4 gap-4 relative">
            {JOURNEY.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <motion.div
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-background transition-colors ${
                      active === i ? step.border : 'border-border group-hover:border-teal-500/40'
                    }`}
                    animate={active === i ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className={`w-6 h-6 ${step.iconColor}`} />
                  </motion.div>
                  <span className={`text-sm font-semibold ${active === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active step detail */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`rounded-2xl border bg-gradient-to-br p-6 sm:p-8 ${JOURNEY[active].color} ${JOURNEY[active].border}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Step {active + 1} · {JOURNEY[active].subtitle}
              </p>
              <h3 className="text-2xl font-bold mb-2">{JOURNEY[active].title}</h3>
              <p className="text-muted-foreground max-w-xl">{JOURNEY[active].description}</p>
            </div>
            {'external' in JOURNEY[active] && JOURNEY[active].external ? (
              <a href={JOURNEY[active].href}>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-background/80 border border-border font-medium text-sm hover:border-teal-500/40 transition-colors">
                  Try it now <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            ) : (
              <Link href={JOURNEY[active].href}>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-background/80 border border-border font-medium text-sm hover:border-teal-500/40 transition-colors cursor-pointer">
                  Try it now <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Mobile cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {JOURNEY.map((step, i) => {
            const Icon = step.icon;
            const inner = (
              <div
                className={`p-4 rounded-xl border bg-card/50 ${step.border} ${active === i ? 'ring-2 ring-teal-500/30' : ''}`}
                onClick={() => setActive(i)}
              >
                <Icon className={`w-5 h-5 ${step.iconColor} mb-2`} />
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            );
            return <div key={step.title}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
