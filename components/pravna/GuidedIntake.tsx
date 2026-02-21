"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Mic, MicOff } from "lucide-react";
import { OptionButton } from "./OptionButton";
import type { Category } from "./CategoryGrid";

interface GuidedIntakeProps {
  category: Category;
  onBack: () => void;
  onSubmit: (data: IntakeData) => void;
}

export interface IntakeData {
  role: string;
  problem: string;
  duration: string;
  details: string;
}

const STEP_LABELS = ["Vaša vloga", "Problem", "Trajanje", "Podrobnosti"];

const ROLE_OPTIONS: Record<string, Array<{ icon: string; title: string; description: string; value: string }>> = {
  stanovanje: [
    { icon: "🏠", title: "Najemnik", description: "Jaz najemam stanovanje od nekoga", value: "najemnik" },
    { icon: "🔑", title: "Najemodajalec", description: "Jaz oddajam stanovanje nekomu", value: "najemodajalec" },
  ],
  delo: [
    { icon: "👷", title: "Delavec", description: "Sem zaposlen ali iščem zaposlitev", value: "delavec" },
    { icon: "🏢", title: "Delodajalec", description: "Sem delodajalec ali vodja", value: "delodajalec" },
  ],
  druzina: [
    { icon: "👨‍👩‍👧", title: "Zakonec / Partner", description: "Gre za ločitev ali partnerski spor", value: "zakonec" },
    { icon: "👶", title: "Starš", description: "Gre za skrbništvo ali vzdrževalnino", value: "stars" },
  ],
  promet: [
    { icon: "🚗", title: "Voznik", description: "Bil sem udeleženec v nesreči", value: "voznik" },
    { icon: "🚶", title: "Pešec / Kolesar", description: "Bil sem poškodovan kot pešec ali kolesar", value: "pesec" },
  ],
  dolgovi: [
    { icon: "💰", title: "Dolžnik", description: "Imam dolgove ali izvršbe", value: "dolznik" },
    { icon: "📋", title: "Upnik", description: "Nekdo mi dolguje denar", value: "upnik" },
  ],
  podjetnistvo: [
    { icon: "🏢", title: "Ustanovitelj", description: "Ustanavljam novo podjetje", value: "ustanovitelj" },
    { icon: "📊", title: "Lastnik", description: "Imam obstoječe podjetje", value: "lastnik" },
  ],
  dedovanje: [
    { icon: "📋", title: "Dedič", description: "Sem dedič zapuščine", value: "dedic" },
    { icon: "📝", title: "Oporočitelj", description: "Želim napisati oporoko", value: "oporocitelj" },
  ],
  potrosniki: [
    { icon: "🛒", title: "Kupec", description: "Imam težavo z izdelkom ali storitvijo", value: "kupec" },
    { icon: "🏪", title: "Prodajalec", description: "Imam reklamacijo stranke", value: "prodajalec" },
  ],
};

const PROBLEM_OPTIONS: Record<string, Array<{ icon: string; title: string; value: string }>> = {
  stanovanje: [
    { icon: "💶", title: "Najemodajalec ne vrne varščine", value: "varscina" },
    { icon: "📄", title: "Dobili smo odpoved pogodbe", value: "odpoved" },
    { icon: "🔧", title: "Najemodajalec ne popravlja napak", value: "napake" },
    { icon: "💸", title: "Zvišali so najemnino", value: "najemnina" },
  ],
  delo: [
    { icon: "📄", title: "Nezakonita odpoved pogodbe", value: "odpoved" },
    { icon: "💶", title: "Neplačane nadure ali plača", value: "neplacilo" },
    { icon: "😤", title: "Mobing na delovnem mestu", value: "mobing" },
    { icon: "🤕", title: "Poškodba pri delu", value: "poskodba" },
  ],
  druzina: [
    { icon: "💔", title: "Ločitev / razveza", value: "locitev" },
    { icon: "👶", title: "Skrbništvo nad otroki", value: "skrbnistvo" },
    { icon: "💶", title: "Preživnina / vzdrževalnina", value: "prezivnina" },
    { icon: "🏠", title: "Delitev skupnega premoženja", value: "premozenje" },
  ],
  promet: [
    { icon: "🚗", title: "Poškodba vozila", value: "vozilo" },
    { icon: "🤕", title: "Telesna poškodba", value: "poskodba" },
    { icon: "📋", title: "Zavarovalnica zavrača odškodnino", value: "zavarovalnica" },
    { icon: "⚖️", title: "Spor o krivdi", value: "krivda" },
  ],
  dolgovi: [
    { icon: "📋", title: "Izvršba na plačo", value: "izvrsba" },
    { icon: "🏦", title: "Bančni dolg / kredit", value: "kredit" },
    { icon: "💶", title: "Osebni stečaj", value: "stecaj" },
    { icon: "📄", title: "Izterjava dolga", value: "izterjava" },
  ],
  podjetnistvo: [
    { icon: "📋", title: "Ustanovitev d.o.o.", value: "ustanovitev" },
    { icon: "📄", title: "Pogodbe in dogovori", value: "pogodbe" },
    { icon: "💶", title: "Davčna vprašanja", value: "davki" },
    { icon: "⚖️", title: "Spor s partnerjem", value: "spor" },
  ],
  dedovanje: [
    { icon: "📋", title: "Zapuščinski postopek", value: "zapuscina" },
    { icon: "📄", title: "Izpodbijanje oporoke", value: "oporoka" },
    { icon: "💶", title: "Nujni delež", value: "nujni_delez" },
    { icon: "🏠", title: "Dedovanje nepremičnin", value: "nepremicnine" },
  ],
  potrosniki: [
    { icon: "🛒", title: "Reklamacija izdelka", value: "reklamacija" },
    { icon: "📄", title: "Odstop od pogodbe", value: "odstop" },
    { icon: "💶", title: "Neupravičen račun", value: "racun" },
    { icon: "🔧", title: "Slaba storitev", value: "storitev" },
  ],
};

const DURATION_OPTIONS = [
  { icon: "⏱", title: "Manj kot mesec dni", value: "less_month" },
  { icon: "📅", title: "1-6 mesecev", value: "1_6_months" },
  { icon: "📆", title: "Več kot 6 mesecev", value: "more_6_months" },
];

export function GuidedIntake({ category, onBack, onSubmit }: GuidedIntakeProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [problem, setProblem] = useState("");
  const [duration, setDuration] = useState("");
  const [details, setDetails] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const roles = ROLE_OPTIONS[category.id] || ROLE_OPTIONS.stanovanje;
  const problems = PROBLEM_OPTIONS[category.id] || PROBLEM_OPTIONS.stanovanje;

  const handleRoleSelect = useCallback((value: string) => {
    setRole(value);
  }, []);

  const handleProblemSelect = useCallback((value: string) => {
    setProblem(value);
  }, []);

  const handleDurationSelect = useCallback((value: string) => {
    setDuration(value);
  }, []);

  useEffect(() => {
    if (step === 1 && problem) {
      const t = setTimeout(() => setStep(2), 300);
      return () => clearTimeout(t);
    }
    if (step === 2 && duration) {
      const t = setTimeout(() => setStep(3), 300);
      return () => clearTimeout(t);
    }
  }, [step, problem, duration]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = () => {
    onSubmit({ role, problem, duration, details });
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "sl-SI";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setDetails((prev) => (prev ? prev + " " + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const canProceed = () => {
    if (step === 0) return !!role;
    if (step === 1) return !!problem;
    if (step === 2) return !!duration;
    return true;
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-[0.96] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
          aria-label="Nazaj"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-sm font-medium text-foreground">
            {category.label}
          </h2>
          <p className="text-xs text-muted-foreground">
            {"Korak"} {step + 1} {"od"} 4 &middot; {STEP_LABELS[step]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div key={step} className="animate-fade-up">
        {step === 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium text-foreground mb-2">
              {"Kakšna je vaša vloga?"}
            </p>
            {roles.map((opt) => (
              <OptionButton
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                selected={role === opt.value}
                onClick={() => handleRoleSelect(opt.value)}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium text-foreground mb-2">
              {"Kaj je vaš problem?"}
            </p>
            {problems.map((opt) => (
              <OptionButton
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                selected={problem === opt.value}
                onClick={() => handleProblemSelect(opt.value)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium text-foreground mb-2">
              {"Kako dolgo traja ta situacija?"}
            </p>
            {DURATION_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                selected={duration === opt.value}
                onClick={() => handleDurationSelect(opt.value)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground mb-1">
              {"Opišite svojo situacijo:"}
            </p>
            <div className="relative">
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Npr.: Izselil sem se pred dvema mesecema, najemodajalec pa mi noče vrniti varščine..."
                className="w-full min-h-[140px] rounded-xl border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/50 resize-y focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={toggleVoice}
                className={`absolute bottom-3 right-3 w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-[0.94] touch-manipulation ${
                  isListening
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-secondary text-muted-foreground hover:text-foreground active:bg-border"
                }`}
                aria-label={isListening ? "Ustavi snemanje" : "Glasovni vnos"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full min-h-14 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all active:scale-[0.98] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50 touch-manipulation"
            >
              {"Analiziraj moj primer"}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 min-h-12 text-sm font-medium text-primary-foreground transition-all active:scale-[0.97] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-manipulation"
          >
            {"Naprej"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
