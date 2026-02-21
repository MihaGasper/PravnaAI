"use client";

import { X, Download, Copy } from "lucide-react";
import { showToast } from "./Toast";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
}

const DOCUMENT_TEXT = `Ljubljana, [datum]

Spoštovani [ime najemodajalca],

ZADEVA: Zahteva za vračilo varščine po prenehanju najemne pogodbe

Na podlagi najemne pogodbe z dne [datum pogodbe], ki smo jo sklenili za najem stanovanja na naslovu [naslov stanovanja], vam podajam zahtevo za vračilo varščine v višini [znesek] EUR.

Najemna pogodba je prenehala dne [datum izselitve], stanovanje pa sem vam predal v dogovorjenem stanju, kar je razvidno iz primopredajnega zapisnika z dne [datum zapisnika].

Skladno s 103. členom Stanovanjskega zakona (SZ-1) ste dolžni vrniti varščino v roku 30 dni od prenehanja najemnega razmerja, zmanjšano za morebitne upravičene odbitke, ki jih morate pisno utemeljiti.

Ker varščina do danes ni bila vrnjena, vas pozivam, da mi v roku 15 dni od prejema tega pisma nakažete znesek [znesek] EUR na transakcijski račun:

IBAN: SI56 [vaš IBAN]
Sklic: [vaša referenca]

V nasprotnem primeru si pridržujem pravico do sodnega uveljavljanja zahtevka, vključno z zamudnimi obrestmi po Obligacijskem zakoniku (OZ), člen 131.

S spoštovanjem,

[Vaše ime in priimek]
[Vaš naslov]
[Telefonska številka]
[E-poštni naslov]`;

export function DocumentModal({ open, onClose }: DocumentModalProps) {
  if (!open) return null;

  const handleDownload = () => {
    const blob = new Blob([DOCUMENT_TEXT], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pisno-opozorilo-varscina.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Dokument prenešen", "Pisno opozorilo je shranjeno");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DOCUMENT_TEXT);
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
            Pisno opozorilo
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
          <pre className="font-sans text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {DOCUMENT_TEXT}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            {"Prenesi"}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-border transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {"Kopiraj"}
          </button>
        </div>
      </div>
    </div>
  );
}
