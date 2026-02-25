"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { useConversation } from "@/hooks/use-conversation";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FollowUpChatProps {
  conversationId: string | null;
  aiResponse: string; // The initial AI response from ResultCard
}

export function FollowUpChat({ conversationId, aiResponse }: FollowUpChatProps) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const { addMessage } = useConversation();

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

    const userQuestion = question;
    setQuestion("");
    setLoading(true);
    setStreamedAnswer("");

    // Add user question to history
    const newHistory: Message[] = [...chatHistory, { role: 'user', content: userQuestion }];
    setChatHistory(newHistory);

    // Save user message to database
    if (conversationId) {
      await addMessage(conversationId, "user", userQuestion);
    }

    abortControllerRef.current = new AbortController();

    try {
      // Build conversation history for API
      const messagesForApi: Message[] = [
        { role: 'assistant', content: aiResponse }, // Initial analysis
        ...chatHistory,
        { role: 'user', content: userQuestion }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpQuestion: userQuestion,
          conversationId,
          messages: messagesForApi,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.quotaExceeded) {
          setChatHistory([...newHistory, {
            role: 'assistant',
            content: 'Dosegli ste dnevno omejitev poizvedb. Nadgradite svoj paket za več poizvedb.'
          }]);
          setLoading(false);
          return;
        }
        throw new Error(errorData.error || "Napaka pri komunikaciji s strežnikom");
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

      // Add assistant response to history
      setChatHistory([...newHistory, { role: 'assistant', content: fullAnswer }]);
      setStreamedAnswer("");

    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setChatHistory([...newHistory, {
          role: 'assistant',
          content: 'Prišlo je do napake. Prosimo, poskusite znova.'
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const lastAssistantMessage = chatHistory.filter(m => m.role === 'assistant').pop();
  const displayAnswer = streamedAnswer || lastAssistantMessage?.content;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {chatHistory.length === 0 ? (
        // Initial state - no follow-up questions yet
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
        // Chat history view
        <div className="flex flex-col gap-4">
          {/* Show chat history */}
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : ''}>
              {msg.role === 'user' ? (
                <p className="inline-block text-xs bg-secondary text-foreground rounded-lg px-3 py-2 max-w-[80%]">
                  {msg.content}
                </p>
              ) : (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
            </div>
          ))}

          {/* Streaming answer */}
          {loading && streamedAnswer && (
            <div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {streamedAnswer}
                <span className="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5" />
              </p>
            </div>
          )}

          {/* Loading indicator without content */}
          {loading && !streamedAnswer && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Razmišljam...</span>
            </div>
          )}

          {/* Input for next question */}
          {!loading && (
            <form onSubmit={handleSubmit} className="flex gap-2 mt-2 pt-3 border-t border-border">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Nadaljujte pogovor..."
                className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30 shrink-0"
                aria-label="Pošlji vprašanje"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
