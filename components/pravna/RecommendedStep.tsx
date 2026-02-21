"use client";

interface RecommendedStepProps {
  number: number;
  title: string;
  description: string;
}

export function RecommendedStep({ number, title, description }: RecommendedStepProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-semibold">{number}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
