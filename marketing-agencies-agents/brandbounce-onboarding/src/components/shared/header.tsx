"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg gradient-brand">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            <span className="gradient-brand-text">brand</span>
            <span className="text-foreground">bounce</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs text-muted-foreground">
            Client Onboarding
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
