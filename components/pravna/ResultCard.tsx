"use client";

import { useState, useEffect, useRef } from "react";
import { DocumentModal } from "./DocumentModal";
import { ReminderModal } from "./ReminderModal";
import { LawyerModal } from "./LawyerModal";
import { FollowUpChat } from "./FollowUpChat";
import { ArrowLeft, Bell, UserCircle, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";
import type { Category } from "./CategoryGrid";
import type { IntakeData } from "./GuidedIntake";
import { useConversation } from "@/hooks/use-conversation";

interface ResultCardProps {
  onBack: () => void;
  conversationId: string | null;
  category: Category;
  intakeData: IntakeData;
}

const LOADING_STEPS = [
  { text: "Preberem vašo situacijo", delay: 500 },
  { text: "Iščem v bazi slovenskega prava", delay: 1200 },
  { text: "Preverjam sodne precedente", delay: 2000 },
  { text: "Sestavljam priporočila", delay: 2800 },
];

export function ResultCard({ onBack, conversationId, category, intakeData }: ResultCardProps) {
  const [loading, setLoading] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const hasCalledApi = useRef(false);

  const { addMessage } = useConversation();

  // Call API on mount
  useEffect(() => {
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    const callApi = async () => {
      // Show loading animation steps
      LOADING_STEPS.forEach((step, i) => {
        setTimeout(() => {
          setVisibleSteps((prev) => [...prev, i]);
        }, step.delay);
      });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: category.id,
            role: intakeData.role,
            problem: intakeData.problem,
            duration: intakeData.duration,
            details: intakeData.details,
            conversationId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          if (errorData.quotaExceeded) {
            setQuotaExceeded(true);
            setError("Dosegli ste dnevno omejitev poizvedb. Nadgradite svoj paket za več poizvedb.");
            setLoading(false);
            return;
          }

          throw new Error(errorData.error || "Napaka pri analizi");
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        if (reader) {
          // Switch to result view after minimum loading time
          setTimeout(() => {
            setLoading(false);
          }, 3500);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullResponse += chunk;
            setAiResponse(fullResponse);
          }

          // Save user message to database
          if (conversationId) {
            const userMessage = `Kategorija: ${category.label}\nVloga: ${intakeData.role}\nProblem: ${intakeData.problem}\nTrajanje: ${intakeData.duration}\nPodrobnosti: ${intakeData.details}`;
            await addMessage(conversationId, "user", userMessage);
          }
        }
      } catch (err) {
        console.error("API error:", err);
        setError(err instanceof Error ? err.message : "Prišlo je do napake");
        setLoading(false);
      }
    };

    callApi();
  }, [category, intakeData, conversationId, addMessage]);

  const handleReminder = () => {
    setShowReminderModal(true);
  };

  const handleLawyer = () => {
    setShowLawyerModal(true);
  };

  const handleRetry = () => {
    hasCalledApi.current = false;
    setError(null);
    setQuotaExceeded(false);
    setLoading(true);
    setVisibleSteps([]);
    setAiResponse("");
    // Trigger re-render to call API again
    window.location.reload();
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

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="font-serif text-xl text-foreground mb-2">
            {quotaExceeded ? "Omejitev dosežena" : "Napaka pri analizi"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazaj
            </button>
            {quotaExceeded ? (
              <a
                href="/pricing"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Nadgradi paket
              </a>
            ) : (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                <RefreshCw className="w-4 h-4" />
                Poskusi znova
              </button>
            )}
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
            {category.label} • Na podlagi slovenskega prava
          </p>
        </div>
      </div>

      {/* Result Sections */}
      <div className="flex flex-col gap-10">
        {/* AI Response */}
        <section>
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {"Pravna analiza"}
          </h3>
          <div className="text-sm text-foreground leading-relaxed bg-card border border-border rounded-xl p-4 whitespace-pre-wrap">
            {aiResponse || "Nalagam odgovor..."}
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
        <FollowUpChat
          conversationId={conversationId}
          aiResponse={aiResponse}
        />

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground leading-relaxed text-center px-4 pb-4">
          {"PravnaAI nudi splošne pravne informacije in ne nadomešča posveta z odvetnikom. Za individualno pravno svetovanje se obrnite na odvetnika."}
        </p>
      </div>

      <DocumentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        category={category}
        intakeData={intakeData}
        aiResponse={aiResponse}
      />

      <ReminderModal
        open={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        conversationId={conversationId}
        defaultTitle={`Rok - ${category.label}`}
      />

      <LawyerModal
        open={showLawyerModal}
        onClose={() => setShowLawyerModal(false)}
        category={category}
      />
    </div>
  );
}
