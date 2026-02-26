"use client";

import { useState, useEffect } from "react";
import { X, Download, Copy, Loader2 } from "lucide-react";
import { showToast } from "./Toast";
import type { Category } from "./CategoryGrid";
import type { IntakeData } from "./GuidedIntake";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  intakeData?: IntakeData;
  aiResponse?: string;
}

// Template for document generation
function generateDocumentPrompt(category: Category, intakeData: IntakeData, aiResponse: string): string {
  return `Na podlagi naslednje pravne analize generiraj uradni dokument (pisno opozorilo, zahtevo, pritožbo, ipd.) ki ga lahko uporabnik pošlje.

KATEGORIJA: ${category.label}
VLOGA UPORABNIKA: ${intakeData.role}
PROBLEM: ${intakeData.problem}
TRAJANJE: ${intakeData.duration}
PODROBNOSTI: ${intakeData.details}

PRAVNA ANALIZA:
${aiResponse}

NAVODILA ZA GENERIRANJE DOKUMENTA:
1. Dokument naj bo formalen in uradnega tona
2. Uporabi ustrezno strukturo (naslov, datum, naslovnik, zadeva, vsebina, zaključek)
3. Vključi relevantne zakonske člene iz analize
4. Dodaj placeholder-je v oglatih oklepajih [datum], [ime], ipd. kjer uporabnik mora vpisati svoje podatke
5. Dokument naj bo v slovenščini
6. Prilagodi vrsto dokumenta glede na situacijo (pisno opozorilo za zamudo, zahteva za vračilo, pritožba, ipd.)

Generiraj samo dokument brez dodatnih pojasnil.`;
}

export function DocumentModal({ open, onClose, category, intakeData, aiResponse }: DocumentModalProps) {
  const [documentText, setDocumentText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !category || !intakeData || !aiResponse) return;
    if (documentText) return; // Already generated

    const generateDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followUpQuestion: generateDocumentPrompt(category, intakeData, aiResponse),
            messages: [{ role: 'assistant', content: aiResponse }],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Napaka pri generiranju dokumenta");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullDocument = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullDocument += chunk;
          setDocumentText(fullDocument);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Napaka pri generiranju dokumenta");
      } finally {
        setLoading(false);
      }
    };

    generateDocument();
  }, [open, category, intakeData, aiResponse, documentText]);

  if (!open) return null;

  const handleDownload = () => {
    const blob = new Blob([documentText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pravni-dokument-${category?.id || 'dokument'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Dokument prenešen", "Dokument je shranjen");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      showToast("Kopirano", "Besedilo je v odložišču");
    } catch {
      showToast("Napaka", "Ni bilo mogoče kopirati");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pisno opozorilo"
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      <div
        className="animate-fade-up relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl bg-card shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">
            Pravni dokument
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Zapri"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Generiram dokument...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setDocumentText("");
                }}
                className="text-sm text-accent hover:underline"
              >
                Poskusi znova
              </button>
            </div>
          )}

          {!loading && !error && documentText && (
            <pre className="font-sans text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {documentText}
            </pre>
          )}

          {!loading && !error && !documentText && !category && (
            <p className="text-sm text-muted-foreground text-center py-12">
              Dokument ni na voljo.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={handleDownload}
            disabled={!documentText || loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {"Prenesi"}
          </button>
          <button
            onClick={handleCopy}
            disabled={!documentText || loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-border transition-colors disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5" />
            {"Kopiraj"}
          </button>
        </div>
      </div>
    </div>
  );
}
