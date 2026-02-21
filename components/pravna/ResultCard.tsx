"use client";

import { useState, useEffect } from "react";
import { LegalBasisBlock } from "./LegalBasisBlock";
import { DeadlineBadge } from "./DeadlineBadge";
import { RecommendedStep } from "./RecommendedStep";
import { DocumentModal } from "./DocumentModal";
import { FollowUpChat } from "./FollowUpChat";
import { showToast } from "./Toast";
import { ArrowLeft, Bell, UserCircle, FileText, Check } from "lucide-react";

interface ResultCardProps {
  onBack: () => void;
}

const LOADING_STEPS = [
  { text: "Preberem vašo situacijo", delay: 500 },
  { text: "Iščem v bazi slovenskega prava", delay: 1200 },
  { text: "Preverjam sodne precedente", delay: 2000 },
  { text: "Sestavljam priporočila", delay: 2800 },
];

export function ResultCard({ onBack }: ResultCardProps) {
  const [loading, setLoading] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    LOADING_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, step.delay);
    });

    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleReminder = () => {
    showToast("Opomnik nastavljen", "Opomnik za rok 30 dni");
  };

  const handleLawyer = () => {
    showToast("Iskanje odvetnika", "Prikazujemo odvetnike v vaši bližini");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <div className="flex flex-col items-center">
          <div className="flex gap-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot-1" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot-2" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot-3" />
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            {"Analiziram vaš primer"}
          </p>

          <div className="w-full max-w-xs flex flex-col gap-3">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 text-sm transition-all ${
                  visibleSteps.includes(i)
                    ? "animate-step-fade-in text-foreground"
                    : "opacity-0"
                }`}
              >
                <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                {step.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-[0.96] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
          aria-label="Nazaj"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h2 className="font-serif text-xl text-foreground">
            {"Analiza primera"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {"Na podlagi slovenskega prava"}
          </p>
        </div>
      </div>

      {/* Result Sections */}
      <div className="flex flex-col gap-10">
        {/* Situation */}
        <section>
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {"Vaša situacija"}
          </h3>
          <p className="text-sm text-foreground leading-relaxed bg-card border border-border rounded-xl p-4">
            {"Izselili ste se in najemodajalec vam že 2 meseca ne vrne varščine. Kljub ustnim obljubam in pisnim zahtevam varščina ni bila vrnjena. To predstavlja kršitev vaših pravic po Stanovanjskem zakonu."}
          </p>
        </section>

        {/* Legal Basis */}
        <section>
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {"Pravna podlaga"}
          </h3>
          <div className="flex flex-col gap-2.5">
            <LegalBasisBlock
              article="103. člen Stanovanjskega zakona (SZ-1)"
              description="Najemodajalec mora vrniti varščino najemniku v roku 30 dni po prenehanju najemne pogodbe, zmanjšano za morebitne upravičene odbitke, ki jih mora pisno utemeljiti."
            />
            <LegalBasisBlock
              article="131. člen Obligacijskega zakonika (OZ)"
              description="Za zamudo pri vračilu varščine lahko zahtevate zakonske zamudne obresti od dneva, ko je bila varščina dolgovana, do dneva plačila."
            />
          </div>
        </section>

        {/* Deadlines */}
        <section>
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {"Roki & Zastaranje"}
          </h3>
          <div className="flex flex-wrap gap-2">
            <DeadlineBadge text="30 dni za vračilo varščine" variant="critical" />
            <DeadlineBadge text="3 leta zastaranje" variant="important" />
          </div>
        </section>

        {/* Recommended Steps */}
        <section>
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">
            {"Priporočeni koraki"}
          </h3>
          <div className="flex flex-col divide-y divide-border">
            <RecommendedStep
              number={1}
              title="Pisno opozorilo"
              description="Pošljite priporočeno pismo najemodajalcu z zahtevo za vračilo varščine v roku 15 dni."
            />
            <RecommendedStep
              number={2}
              title="Stanovanjska inšpekcija"
              description="Če najemodajalec ne odreagira, podajte prijavo na stanovanjsko inšpekcijo."
            />
            <RecommendedStep
              number={3}
              title="Izvensodna mediacija"
              description="Predlagajte mediacijo pri centru za mediacijo — hitrejše in cenejše od sodnega postopka."
            />
            <RecommendedStep
              number={4}
              title="Sodišče za spore malih vrednosti"
              description="Če znesek ne presega 2.000 EUR, vložite tožbo brez odvetnika."
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] touch-manipulation"
          >
            <FileText className="w-4 h-4" />
            {"Generiraj pisno opozorilo"}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReminder}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] touch-manipulation"
            >
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              {"Opomnik"}
            </button>
            <button
              onClick={handleLawyer}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] touch-manipulation"
            >
              <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
              {"Odvetnik"}
            </button>
          </div>
        </div>

        {/* Follow-up */}
        <FollowUpChat />

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground leading-relaxed text-center px-4 pb-4">
          {"PravnaAI nudi splošne pravne informacije in ne nadomešča posveta z odvetnikom. Za individualno pravno svetovanje se obrnite na odvetnika."}
        </p>
      </div>

      <DocumentModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
