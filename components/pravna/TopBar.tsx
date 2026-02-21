"use client";

import { Scale, RotateCcw } from "lucide-react";

interface TopBarProps {
  mode: "simple" | "expert";
  onReset: () => void;
  fontLarge: boolean;
  onToggleFont: () => void;
}

export function TopBar({ mode, onReset, fontLarge, onToggleFont }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-lg border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="font-serif text-base font-medium text-foreground">PravnaAI</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFont}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-xs font-semibold transition-colors hover:bg-secondary"
            aria-label={fontLarge ? "Normalna velikost pisave" : "Povečaj pisavo"}
            title={fontLarge ? "Normalna pisava" : "Večja pisava"}
          >
            <span className={`transition-all ${fontLarge ? "text-accent" : "text-muted-foreground"}`}>
              {fontLarge ? "A+" : "A"}
            </span>
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg px-3 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            aria-label="Ponastavi in začni znova"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {mode === "simple" ? "Preprosto" : "Strokovno"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
