"use client";

interface DeadlineBadgeProps {
  text: string;
  variant?: "critical" | "important";
}

export function DeadlineBadge({ text, variant = "important" }: DeadlineBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
        variant === "critical"
          ? "bg-destructive/8 text-destructive"
          : "bg-accent/8 text-accent"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === "critical" ? "bg-destructive" : "bg-accent"
      }`} />
      {text}
    </span>
  );
}
