"use client";

import Link from "next/link";
import { Scale, Check, Shield, ChevronRight, Home, Briefcase, Heart } from "lucide-react";

interface WelcomeScreenProps {
  onSelectMode: (mode: "simple" | "expert") => void;
}

const VALUE_PROPS = [
  "Takojšnji odgovori in dokumenti, 24/7",
  "Odgovori na podlagi slovenske zakonodaje",
  "Citirani zakonski členi in roki",
  "Možnost generiranja pravnih dokumentov",
];

const PROCESS_STEPS = [
  { number: 1, title: "Izberite", desc: "kategorijo" },
  { number: 2, title: "Opišite", desc: "situacijo" },
  { number: 3, title: "Prejmite", desc: "analizo" },
];

const EXAMPLES = [
  { icon: Home, text: "Najemodajalec mi ne vrača varščine" },
  { icon: Briefcase, text: "Delodajalec mi dolguje plačo" },
  { icon: Heart, text: "Potrebujem pomoč pri dedovanju" },
];

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col px-6 py-8">
      {/* Hero sekcija */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
          <Scale className="w-6 h-6 text-accent" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-foreground text-center mb-2 text-balance">
          PravnaAI
        </h1>

        <p className="text-muted-foreground text-center text-sm md:text-base mb-6 max-w-sm leading-relaxed">
          Pravni svetovalec za slovensko pravo
        </p>

        {/* Value Proposition */}
        <div className="flex flex-col gap-2 mb-8 w-full max-w-sm">
          {VALUE_PROPS.map((prop, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-accent shrink-0" />
              <span>{prop}</span>
            </div>
          ))}
        </div>

        {/* CTA Label */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Izberite način svetovanja
        </p>

        {/* CTA Gumbi */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-4">
          <button
            onClick={() => onSelectMode("simple")}
            className="group flex-1 rounded-xl border-2 border-accent/30 bg-accent/5 px-6 py-5 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-base font-semibold text-foreground">Preprosto</p>
              <ChevronRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              V enostavnem jeziku, brez pravnih izrazov
            </p>
          </button>

          <button
            onClick={() => onSelectMode("expert")}
            className="group flex-1 rounded-xl border-2 border-accent/30 bg-accent/5 px-6 py-5 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-base font-semibold text-foreground">Strokovno</p>
              <ChevronRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pravna analiza s citati zakonov
            </p>
          </button>
        </div>

        {/* Pricing Link */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline transition-colors"
        >
          Oglejte si pakete
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Kako deluje */}
      <section className="max-w-lg mx-auto w-full mt-8 pt-8 border-t border-border">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center mb-6">
          Kako deluje
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-semibold flex items-center justify-center mx-auto mb-2">
                {step.number}
              </div>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Primeri uporabe */}
      <section className="max-w-lg mx-auto w-full mt-8 pt-8 border-t border-border">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center mb-4">
          Pogosta vprašanja
        </h2>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((example, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 text-sm text-foreground"
            >
              <example.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{example.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-lg mx-auto w-full mt-8 pt-6 border-t border-border">
        <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground text-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Vaši podatki so varni
            </span>
            <span>•</span>
            <span>Ne nadomešča posveta z odvetnikom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-accent transition-colors">
              Splošni pogoji
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Zasebnost
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
