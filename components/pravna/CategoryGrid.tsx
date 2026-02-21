"use client";

import { ChevronRight } from "lucide-react";

export interface Category {
  id: string;
  icon: string;
  label: string;
  popular?: boolean;
}

const CATEGORIES: Category[] = [
  { id: "stanovanje", icon: "🏠", label: "Stanovanje & Najem", popular: true },
  { id: "delo", icon: "👷", label: "Delovna pravica", popular: true },
  { id: "druzina", icon: "👨‍👩‍👧", label: "Družinsko pravo" },
  { id: "promet", icon: "🚗", label: "Prometne nesreče" },
  { id: "dolgovi", icon: "💰", label: "Dolgovi & Izvršba" },
  { id: "podjetnistvo", icon: "🏢", label: "Podjetništvo" },
  { id: "dedovanje", icon: "📋", label: "Dedovanje" },
  { id: "potrosniki", icon: "🛒", label: "Varstvo potrošnikov" },
];

interface CategoryGridProps {
  onSelectCategory: (category: Category) => void;
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-10 animate-stagger-in">
        <h2 className="font-serif text-2xl text-foreground text-balance mb-2">
          {"Kako vam lahko pomagamo?"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {"Izberite pravno področje in vodili vas bomo skozi postopek."}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="animate-stagger-in group flex items-center gap-4 rounded-xl px-4 py-4 text-left transition-all duration-150 hover:bg-card hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
            style={{ animationDelay: `${(i + 1) * 50}ms` }}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-lg shrink-0"
              role="img"
              aria-hidden="true"
            >
              {cat.icon}
            </span>
            <span className="flex-1 text-sm font-medium text-foreground">
              {cat.label}
            </span>
            {cat.popular && (
              <span className="text-[10px] font-semibold tracking-wide uppercase text-accent bg-accent/10 rounded-full px-2 py-0.5">
                {"Priljubljeno"}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
