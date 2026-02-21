"use client";

interface LegalBasisBlockProps {
  article: string;
  description: string;
}

export function LegalBasisBlock({ article, description }: LegalBasisBlockProps) {
  return (
    <div className="rounded-lg border-l-2 border-l-accent bg-secondary/50 px-4 py-3">
      <p className="text-sm font-medium text-foreground">{article}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
