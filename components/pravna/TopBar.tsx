"use client";

import { RotateCcw } from "lucide-react";

interface TopBarProps {
  mode: "simple" | "expert";
  onReset: () => void;
  fontLarge: boolean;
  onToggleFont: () => void;
}

export function TopBar({ mode, onReset, fontLarge, onToggleFont }: TopBarProps) {
  return (
    <div className="w-full bg-secondary/50 border-b border-border/40">
      <div className="mx-auto flex h-10 max-w-2xl items-center justify-end px-6 gap-1">
        <button
          onClick={onToggleFont}
          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-lg text-xs font-semibold transition-colors hover:bg-secondary"
          aria-label={fontLarge ? "Normalna velikost pisave" : "Povečaj pisavo"}
          title={fontLarge ? "Normalna pisava" : "Večja pisava"}
        >
          <span className={`transition-all ${fontLarge ? "text-accent" : "text-muted-foreground"}`}>
            {fontLarge ? "A+" : "A"}
          </span>
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 min-h-[36px] rounded-lg px-3 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          aria-label="Ponastavi in začni znova"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">
            {mode === "simple" ? "Preprosto" : "Strokovno"}
          </span>
        </button>
      </div>
    </div>
  );
}
