"use client";

import { useState } from "react";
import { X, Bell, Calendar, Loader2 } from "lucide-react";
import { showToast } from "./Toast";

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  conversationId: string | null;
  defaultTitle?: string;
  defaultDays?: number;
}

export function ReminderModal({
  open,
  onClose,
  conversationId,
  defaultTitle = "Pravni rok",
  defaultDays = 30,
}: ReminderModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [daysFromNow, setDaysFromNow] = useState(defaultDays);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate.toISOString(),
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Napaka pri ustvarjanju opomnika");
      }

      showToast("Opomnik nastavljen", `Opomnik za ${dueDate.toLocaleDateString("sl-SI")}`);
      onClose();
    } catch (error) {
      console.error("Reminder error:", error);
      showToast("Napaka", error instanceof Error ? error.message : "Ni bilo mogoče nastaviti opomnika");
    } finally {
      setLoading(false);
    }
  };

  const quickOptions = [
    { label: "7 dni", days: 7 },
    { label: "15 dni", days: 15 },
    { label: "30 dni", days: 30 },
    { label: "60 dni", days: 60 },
    { label: "90 dni", days: 90 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Nastavi opomnik"
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      <div
        className="animate-fade-up relative w-full max-w-md rounded-xl bg-card shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium text-foreground">
              Nastavi opomnik
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Zapri"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label htmlFor="reminder-title" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Naslov opomnika
            </label>
            <input
              id="reminder-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="npr. Rok za vračilo varščine"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="reminder-desc" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Opis (neobvezno)
            </label>
            <textarea
              id="reminder-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dodatne podrobnosti..."
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none"
            />
          </div>

          {/* Quick options */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Čez koliko dni?
            </label>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setDaysFromNow(opt.days)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    daysFromNow === opt.days
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-border"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date display */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Opomnik: <strong>{dueDate.toLocaleDateString("sl-SI", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !title}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Shranjujem...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Nastavi opomnik
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
