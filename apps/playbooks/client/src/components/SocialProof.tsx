import { Star, Users, FileText, TrendingUp, Globe } from "lucide-react";

const METRICS = [
  { label: "Documents Managed", value: "525+", icon: FileText },
  { label: "Team Members Active", value: "50+", icon: Users },
  { label: "Time Saved Weekly", value: "12hrs", icon: TrendingUp },
  { label: "Countries Served", value: "15+", icon: Globe },
];

const TESTIMONIALS = [
  {
    quote: "ARG Builder completely transformed how we onboard new team members. What used to take 2 weeks now takes 3 days.",
    author: "Sarah Chen",
    role: "Operations Director",
    company: "Meridian Travel Group",
    rating: 5,
  },
  {
    quote: "The AI-powered search alone saves our team hours every week. Finding the right SOP is instant now.",
    author: "Marcus Williams",
    role: "Head of Knowledge Management",
    company: "Atlas Creative Studio",
    rating: 5,
  },
  {
    quote: "We evaluated Notion, Confluence, and Guru. ARG Builder won because it's purpose-built for operational guides with enterprise features.",
    author: "Priya Patel",
    role: "CTO",
    company: "Voyager Hospitality",
    rating: 5,
  },
];

const CLIENT_LOGOS = [
  { name: "Meridian Travel", initials: "MT" },
  { name: "Atlas Creative", initials: "AC" },
  { name: "Voyager Hospitality", initials: "VH" },
  { name: "Riad & Routes", initials: "R&R" },
  { name: "Nomad Studios", initials: "NS" },
  { name: "Zenith Operations", initials: "ZO" },
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-background">
      {/* Metrics Bar */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Logos */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
          Trusted by leading teams worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {CLIENT_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{logo.initials}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.author.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
