"use client";

import { Scale } from "lucide-react";

interface WelcomeScreenProps {
  onSelectMode: (mode: "simple" | "expert") => void;
}

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-8">
        <Scale className="w-6 h-6 text-accent" />
      </div>

      <h1 className="font-serif text-3xl md:text-4xl text-foreground text-center mb-2 text-balance">
        {"PravnaAI"}
      </h1>

      <p className="text-muted-foreground text-center text-sm md:text-base mb-16 max-w-sm leading-relaxed">
        {"Pravni svetovalec za slovensko pravo"}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button
          onClick={() => onSelectMode("simple")}
          className="group flex-1 rounded-xl border border-border bg-card px-6 py-5 text-left transition-all duration-200 hover:border-accent/40 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
        >
          <p className="text-sm font-semibold text-foreground mb-1">Preprosto</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {"V enostavnem jeziku, brez pravnih izrazov"}
          </p>
        </button>

        <button
          onClick={() => onSelectMode("expert")}
          className="group flex-1 rounded-xl border border-border bg-card px-6 py-5 text-left transition-all duration-200 hover:border-accent/40 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
        >
          <p className="text-sm font-semibold text-foreground mb-1">Strokovno</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {"Pravna analiza s citati zakonov"}
          </p>
        </button>
      </div>
    </div>
  );
}
