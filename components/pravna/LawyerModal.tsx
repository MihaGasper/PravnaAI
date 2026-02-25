"use client";

import { X, UserCircle, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import type { Category } from "./CategoryGrid";

interface LawyerModalProps {
  open: boolean;
  onClose: () => void;
  category: Category;
}

// Static list of lawyers by category (can be expanded or connected to API later)
const LAWYERS_BY_CATEGORY: Record<string, Array<{
  name: string;
  specialization: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
}>> = {
  stanovanje: [
    {
      name: "Odvetniška pisarna Novak",
      specialization: "Stanovanjsko in nepremičninsko pravo",
      location: "Ljubljana",
      phone: "+386 1 234 5678",
      email: "info@odvetnik-novak.si",
      website: "https://www.odv-zbornica.si",
    },
    {
      name: "Odvetnik Janez Kovač",
      specialization: "Najemna razmerja, varščine",
      location: "Maribor",
      phone: "+386 2 345 6789",
      email: "janez.kovac@odvetnik.si",
    },
  ],
  delo: [
    {
      name: "Odvetniška pisarna Horvat",
      specialization: "Delovno pravo, odpovedi",
      location: "Ljubljana",
      phone: "+386 1 456 7890",
      email: "info@horvat-odvetniki.si",
      website: "https://www.odv-zbornica.si",
    },
    {
      name: "Odvetnica Ana Zupan",
      specialization: "Delavske pravice, mobbing",
      location: "Celje",
      phone: "+386 3 567 8901",
      email: "ana.zupan@odvetnica.si",
    },
  ],
  druzina: [
    {
      name: "Odvetniška pisarna Kranjc",
      specialization: "Družinsko pravo, ločitve",
      location: "Ljubljana",
      phone: "+386 1 678 9012",
      email: "info@kranjc-odvetniki.si",
    },
  ],
  promet: [
    {
      name: "Odvetnik Peter Vidmar",
      specialization: "Prometne nesreče, odškodnine",
      location: "Ljubljana",
      phone: "+386 1 789 0123",
      email: "peter.vidmar@odvetnik.si",
    },
  ],
  dolgovi: [
    {
      name: "Odvetniška pisarna Dolžnik",
      specialization: "Izvršbe, stečaji, dolgovi",
      location: "Ljubljana",
      phone: "+386 1 890 1234",
      email: "info@dolznik-odvetniki.si",
    },
  ],
  podjetnistvo: [
    {
      name: "Odvetniška pisarna Podjetje",
      specialization: "Gospodarsko pravo, pogodbe",
      location: "Ljubljana",
      phone: "+386 1 901 2345",
      email: "info@podjetje-odvetniki.si",
    },
  ],
  dedovanje: [
    {
      name: "Notar Marko Turk",
      specialization: "Dedovanje, oporoke",
      location: "Ljubljana",
      phone: "+386 1 012 3456",
      email: "marko.turk@notar.si",
    },
  ],
  potrosniki: [
    {
      name: "Zveza potrošnikov Slovenije",
      specialization: "Varstvo potrošnikov",
      location: "Ljubljana",
      phone: "+386 1 123 4567",
      email: "info@zps.si",
      website: "https://www.zps.si",
    },
  ],
};

// Default lawyers if category not found
const DEFAULT_LAWYERS = [
  {
    name: "Odvetniška zbornica Slovenije",
    specialization: "Iskanje odvetnika",
    location: "Ljubljana",
    phone: "+386 1 251 04 40",
    email: "info@odv-zbornica.si",
    website: "https://www.odv-zbornica.si/iscemo-odvetnika/",
  },
];

export function LawyerModal({ open, onClose, category }: LawyerModalProps) {
  if (!open) return null;

  const lawyers = LAWYERS_BY_CATEGORY[category.id] || DEFAULT_LAWYERS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Poišči odvetnika"
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      <div
        className="animate-fade-up relative w-full max-w-md max-h-[85vh] flex flex-col rounded-xl bg-card shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium text-foreground">
              Poišči odvetnika
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
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-muted-foreground mb-4">
            Priporočeni odvetniki za področje <strong>{category.label}</strong>:
          </p>

          <div className="flex flex-col gap-3">
            {lawyers.map((lawyer, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-background hover:bg-secondary/50 transition-colors"
              >
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {lawyer.name}
                </h4>
                <p className="text-xs text-accent mb-3">
                  {lawyer.specialization}
                </p>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {lawyer.location}
                  </div>
                  <a
                    href={`tel:${lawyer.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {lawyer.phone}
                  </a>
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    {lawyer.email}
                  </a>
                  {lawyer.website && (
                    <a
                      href={lawyer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-accent hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Spletna stran
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
            To je informativni seznam. Za aktualne podatke o odvetnikih obiščite
            <a
              href="https://www.odv-zbornica.si/iscemo-odvetnika/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline ml-1"
            >
              Odvetniško zbornico Slovenije
            </a>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border">
          <a
            href="https://www.odv-zbornica.si/iscemo-odvetnika/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" />
            Išči odvetnika na OZS
          </a>
        </div>
      </div>
    </div>
  );
}
