"use client";

import Link from "next/link";
import { Shield, ChevronRight, ArrowRight, Download, Clock, FileText, Lock } from "lucide-react";

interface WelcomeScreenProps {
  onSelectMode: (mode: "simple" | "expert") => void;
}

const VALUE_PROPS = [
  { icon: Clock, text: "Odgovor v minutah" },
  { icon: FileText, text: "Pripravljen dokument" },
  { icon: Lock, text: "Popolnoma zasebno" },
];

const EXAMPLES = [
  {
    text: "Najemodajalec mi že 2 meseca ne vrne varščine",
    category: "stanovanje",
  },
  {
    text: "Delodajalec mi dolguje 3 plače",
    category: "delo",
  },
  {
    text: "Kako začeti zapuščinski postopek?",
    category: "dedovanje",
  },
];

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6">
            Pravna pomoč.
            <br />
            <span className="text-accent">Takoj.</span>
          </h1>

          {/* Subheadline - more contrast */}
          <p className="text-lg md:text-xl text-[#b0b0b0] max-w-md mx-auto mb-10 leading-relaxed">
            Ne le odgovori — <span className="text-white font-medium">pripravljen dokument</span>, ki ga lahko pošljete danes.
          </p>

          {/* Primary CTA - Gold Button */}
          <button
            onClick={() => onSelectMode("simple")}
            className="group inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-[#e6b75a] text-[#0f0f0f] px-10 py-4 rounded-lg text-base font-bold shadow-[0_4px_24px_rgba(212,168,83,0.4)] hover:shadow-[0_8px_32px_rgba(212,168,83,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mb-4"
          >
            Začnite brezplačno
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <div className="flex items-center justify-center gap-2 text-sm text-[#888]">
            <span>ali</span>
            <button
              onClick={() => onSelectMode("expert")}
              className="text-white/90 hover:text-accent underline underline-offset-4 decoration-[#444] hover:decoration-accent transition-colors"
            >
              Strokovno svetovanje
            </button>
          </div>
        </div>
      </section>

      {/* Value Props Strip */}
      <section className="border-y border-[#333] bg-[#141414] py-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {VALUE_PROPS.map((prop, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <prop.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-white/90">
                  {prop.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent text-center mb-8">
            Primer dokumenta
          </h2>

          {/* Document Preview Card */}
          <div className="relative bg-[#161616] rounded-xl border border-[#2a2a2a] shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Document Header */}
            <div className="bg-[#1c1c1c] px-6 py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(212,168,83,0.5)]"></div>
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  Pisno opozorilo
                </span>
              </div>
            </div>

            {/* Document Content */}
            <div className="px-6 py-8 font-mono text-sm leading-relaxed text-[#c0c0c0]">
              <p className="mb-5">Spoštovani,</p>
              <p className="mb-5">
                na podlagi{" "}
                <span className="text-accent font-bold">
                  103. člena Stanovanjskega zakona (SZ-1)
                </span>{" "}
                vas pozivam k vrnitvi varščine v znesku{" "}
                <span className="text-[#888]">[znesek]</span> EUR v
                roku <span className="text-white font-bold">8 dni</span> od prejema
                tega opozorila.
              </p>
              <p className="mb-5">
                V kolikor varščine ne vrnete v navedenem roku, bom primoran/-a
                uveljavljati svoje pravice po sodni poti, kar bo povzročilo
                dodatne stroške.
              </p>
              <p className="text-[#888]">S spoštovanjem,</p>
              <p className="text-[#888]">[Vaše ime]</p>
            </div>

            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#161616] to-transparent pointer-events-none"></div>

            {/* Download indicator */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-accent font-semibold">
              <Download className="w-4 h-4" />
              <span>Prenesite kot PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Simplified */}
      <section className="px-6 py-8 border-y border-[#2a2a2a] bg-[#111]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-8 text-sm">
            <span className="text-white font-medium">Opišite situacijo</span>
            <ChevronRight className="w-4 h-4 text-accent" />
            <span className="text-white font-medium">Prejmite analizo</span>
            <ChevronRight className="w-4 h-4 text-accent" />
            <span className="text-white font-medium">Prenesite dokument</span>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent text-center mb-8">
            Preizkusite z vašim vprašanjem
          </h2>

          <div className="flex flex-col gap-3">
            {EXAMPLES.map((example, i) => (
              <button
                key={i}
                onClick={() => onSelectMode("simple")}
                className="group flex items-center justify-between gap-4 px-6 py-5 rounded-xl bg-[#161616] border border-[#2a2a2a] hover:border-accent hover:bg-[#1a1a1a] transition-all duration-200 text-left"
              >
                <span className="text-[#d0d0d0] group-hover:text-white transition-colors">
                  <span className="text-[#666]">&ldquo;</span>
                  {example.text}
                  <span className="text-[#666]">&rdquo;</span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#555] group-hover:text-accent transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-8 border-t border-[#222]">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-xs text-[#777] text-center">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent" />
                <span className="text-[#999]">Vaši podatki so varni</span>
              </span>
              <span className="text-[#333]">•</span>
              <span>Ne nadomešča posveta z odvetnikom</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Splošni pogoji
              </Link>
              <span className="text-[#333]">•</span>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Zasebnost
              </Link>
              <span className="text-[#333]">•</span>
              <Link
                href="/pricing"
                className="hover:text-white transition-colors"
              >
                Paketi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
