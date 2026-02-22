"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface FollowUpChatProps {
  conversationId?: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export function FollowUpChat({ conversationId, messages = [] }: FollowUpChatProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setStreamedAnswer("");
    setAnswer("");

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpQuestion: question,
          conversationId,
          messages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Napaka pri komunikaciji s strežnikom");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullAnswer += chunk;
        setStreamedAnswer(fullAnswer);
      }

      setAnswer(fullAnswer);
      setStreamedAnswer("");
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setAnswer("Prišlo je do napake. Prosimo, poskusite znova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const displayAnswer = streamedAnswer || answer;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {!displayAnswer ? (
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
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {displayAnswer}
            {loading && <span className="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5" />}
          </p>
          {!loading && (
            <button
              onClick={() => { setAnswer(""); setStreamedAnswer(""); setQuestion(""); }}
              className="mt-3 text-xs text-accent font-medium hover:underline"
            >
              {"Novo vprašanje"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
