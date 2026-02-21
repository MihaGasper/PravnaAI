"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export function FollowUpChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setTimeout(() => {
      setAnswer(
        `Na podlagi vašega vprašanja: "${question}" — predlagam, da najprej preverite, ali imate vse dokumente (najemno pogodbo, primopredajni zapisnik, dokazila o plačilu varščine). V primeru sodnega postopka boste te dokumente potrebovali kot dokazno gradivo. Za pravno svetovanje priporočam posvet z odvetnikom za stanovanjsko pravo.`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {!answer ? (
        <>
          <p className="text-sm font-medium text-foreground mb-3">
            {"Imate dodatno vprašanje?"}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Vprašajte karkoli o vašem primeru..."
              className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30 shrink-0"
              aria-label="Pošlji vprašanje"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="animate-fade-up">
          <p className="text-xs text-muted-foreground mb-2">
            {question}
          </p>
          <p className="text-sm text-foreground leading-relaxed">{answer}</p>
          <button
            onClick={() => { setAnswer(""); setQuestion(""); }}
            className="mt-3 text-xs text-accent font-medium hover:underline"
          >
            {"Novo vprašanje"}
          </button>
        </div>
      )}
    </div>
  );
}
