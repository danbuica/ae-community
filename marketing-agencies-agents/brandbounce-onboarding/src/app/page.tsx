import Link from "next/link";
import { ArrowRight, Zap, Wand2, BarChart3, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const FEATURES = [
  {
    icon: Wand2,
    title: "AI-Assisted",
    description: "Gemini AI suggests competitors, hashtags, brand voice, and content pillars — tailored to your industry.",
  },
  {
    icon: Palette,
    title: "Brand Identity",
    description: "Upload your logo, pick your colors, and define your personality with visual archetype cards.",
  },
  {
    icon: BarChart3,
    title: "Strategy Ready",
    description: "Walk out with a complete content strategy — platforms, posting schedules, pillars, and KPIs.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-sm">
            <span className="gradient-brand-text">brand</span>
            <span>bounce</span>
          </span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
          <Wand2 className="w-3 h-3" />
          AI-Powered Client Onboarding
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1] mb-6">
          Your brand strategy,{" "}
          <span className="gradient-brand-text">built in 10 minutes</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mb-10 leading-relaxed">
          Answer a few questions about your brand and let Brand Bounce&apos;s AI craft
          a tailored social media strategy — complete with content pillars, hashtags,
          and a posting schedule.
        </p>

        <Link href="/onboarding">
          <Button
            size="lg"
            className="gap-2 gradient-brand text-white border-0 shadow-xl shadow-primary/30 hover:opacity-90 hover:shadow-primary/50 transition-all text-base px-8 h-12"
          >
            Start Onboarding
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground mt-4">
          Takes ~10 minutes · Progress auto-saved · No account required
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl w-full">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5 text-left hover:border-primary/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} Brand Bounce · Built with{" "}
        <span className="gradient-brand-text font-medium">AI</span>
      </footer>
    </div>
  );
}
