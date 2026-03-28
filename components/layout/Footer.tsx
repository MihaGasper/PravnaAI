import Link from 'next/link'
import { Scale } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-accent" />
              <span className="font-serif text-sm font-medium text-foreground">
                <span className="text-accent">AI</span>-Odvetnik
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Brezplačna pravna pomoč z umetno inteligenco. Pravni nasveti za
              slovensko pravo — dedovanje, ločitev, delovno pravo, pogodbe in nepremičnine.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium text-foreground mb-3">Pravni nasveti</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/blog" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Vsi nasveti
              </Link>
              <Link href="/blog/brezplacna-pravna-pomoc-v-sloveniji" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Brezplačna pravna pomoč
              </Link>
              <Link href="/blog/koliko-stane-odvetnik-v-sloveniji" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Koliko stane odvetnik
              </Link>
              <Link href="/blog/kako-napisati-oporoko-vodic" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Kako napisati oporoko
              </Link>
              <Link href="/blog/kupoprodajna-pogodba-vse-kar-morate-vedeti" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Kupoprodajna pogodba
              </Link>
              <Link href="/blog/podjemna-pogodba-vodnik" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Podjemna pogodba
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-medium text-foreground mb-3">Povezava</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/pricing" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Cenik
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Zasebnost
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Pogoji uporabe
              </Link>
              <a href="mailto:markobtc@gmail.com" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                markobtc@gmail.com
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 2DSOFT d.o.o. Vse pravice pridržane.
          </p>
          <p className="text-xs text-muted-foreground">
            AI-Odvetnik ne nadomešča posveta z odvetnikom.
          </p>
        </div>
      </div>
    </footer>
  )
}
