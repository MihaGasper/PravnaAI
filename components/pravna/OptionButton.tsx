"use client";

import { Check } from "lucide-react";

interface OptionButtonProps {
  icon: string;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({
  icon,
  title,
  description,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full min-h-14 flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 select-none touch-manipulation ${
        selected
          ? "border-accent bg-accent/5"
          : "border-border bg-card hover:border-muted-foreground/30 active:bg-secondary/80"
      }`}
    >
      <span className="text-lg shrink-0" role="img" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
          selected
            ? "border-accent bg-accent"
            : "border-border"
        }`}
      >
        {selected && <Check className="w-2.5 h-2.5 text-accent-foreground" />}
      </div>
    </button>
  );
}
