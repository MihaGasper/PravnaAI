import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Splošni pogoji uporabe | PravnaAI',
  description: 'Splošni pogoji uporabe platforme PravnaAI',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold font-serif mb-2">
          Splošni pogoji uporabe
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Zadnja posodobitev: {new Date().toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-sm max-w-none text-foreground">
          {/* 1. Splošne določbe */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Splošne določbe</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Ti splošni pogoji urejajo uporabo spletne platforme PravnaAI (v nadaljevanju: &quot;platforma&quot;),
              ki jo upravlja [IME PODJETJA], [NASLOV], [DAVČNA ŠTEVILKA] (v nadaljevanju: &quot;ponudnik&quot;).
            </p>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Z uporabo platforme uporabnik potrjuje, da je prebral, razumel in sprejel te splošne pogoje.
              Če se s pogoji ne strinjate, platforme ne smete uporabljati.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ponudnik si pridržuje pravico do spremembe teh pogojev. O bistvenih spremembah bodo uporabniki
              obveščeni po elektronski pošti ali z obvestilom na platformi.
            </p>
          </section>

          {/* 2. Definicije */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definicije</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Platforma</strong> - spletna aplikacija PravnaAI, dostopna na naslovu pravna-ai.vercel.app</li>
              <li><strong className="text-foreground">Uporabnik</strong> - fizična ali pravna oseba, ki uporablja platformo</li>
              <li><strong className="text-foreground">Naročnik</strong> - uporabnik, ki ima aktivno plačljivo naročnino</li>
              <li><strong className="text-foreground">AI sistem</strong> - sistem umetne inteligence, ki generira pravne informacije</li>
              <li><strong className="text-foreground">Poizvedba</strong> - posamezno vprašanje ali zahteva, poslana AI sistemu</li>
            </ul>
          </section>

          {/* 3. Opis storitve */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Opis storitve</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              PravnaAI je platforma, ki z uporabo umetne inteligence ponuja splošne pravne informacije
              na podlagi slovenske zakonodaje. Platforma omogoča:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-3">
              <li>Pridobivanje splošnih pravnih informacij</li>
              <li>Generiranje osnutkov pravnih dokumentov</li>
              <li>Informacije o relevantnih zakonskih členih in rokih</li>
              <li>Shranjevanje zgodovine pogovorov</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
              <p className="text-amber-800 text-sm font-medium">
                POMEMBNO: Platforma NE nudi pravnega svetovanja in NE nadomešča posveta z odvetnikom.
                Vse informacije so splošne narave in niso prilagojene konkretnemu primeru uporabnika.
              </p>
            </div>
          </section>

          {/* 4. Registracija in uporabniški račun */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Registracija in uporabniški račun</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Za uporabo platforme je potrebna registracija z veljavnim elektronskim naslovom ali
              prijava preko Google računa.
            </p>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Uporabnik je odgovoren za:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Točnost podatkov ob registraciji</li>
              <li>Varovanje svojih prijavnih podatkov</li>
              <li>Vse aktivnosti, ki se izvajajo pod njegovim računom</li>
            </ul>
          </section>

          {/* 5. Naročniški paketi */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Naročniški paketi in plačilo</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Platforma ponuja brezplačni in plačljive naročniške pakete z različnim številom
              dnevnih poizvedb. Cene in lastnosti paketov so objavljene na strani s cenami.
            </p>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Plačljive naročnine se obračunavajo mesečno vnaprej. Plačilo se izvede preko
              varnega plačilnega sistema Stripe.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Naročnik lahko kadarkoli prekliče naročnino. Preklicana naročnina ostane aktivna
              do konca obračunskega obdobja.
            </p>
          </section>

          {/* 6. Omejitev odgovornosti */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Omejitev odgovornosti</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm font-medium mb-2">
                IZJAVA O OMEJITVI ODGOVORNOSTI
              </p>
              <p className="text-red-700 text-sm">
                Platforma se ponuja &quot;takšna, kot je&quot; (as is), brez kakršnihkoli izrecnih ali
                implicitnih jamstev glede točnosti, popolnosti ali uporabnosti informacij.
              </p>
            </div>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Ponudnik ne odgovarja za:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Vsebino odgovorov, ki jih generira AI sistem</li>
              <li>Odločitve, sprejete na podlagi informacij s platforme</li>
              <li>Kakršnokoli neposredno ali posredno škodo</li>
              <li>Izgubo podatkov ali prekinitev storitve</li>
              <li>Ravnanja tretjih oseb</li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Uporabnik uporablja platformo na lastno odgovornost. Za konkretne pravne zadeve
              se vedno posvetujte z usposobljenim odvetnikom.
            </p>
          </section>

          {/* 7. Pravice intelektualne lastnine */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Pravice intelektualne lastnine</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Vsa vsebina platforme, vključno z besedili, grafiko, logotipi, ikonami in programsko
              opremo, je last ponudnika ali njegovih licencodajalcev in je zaščitena z avtorskimi
              pravicami.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Uporabniku je podeljena omejena, neizključna in neprenosljiva pravica do uporabe
              platforme za osebne namene. Kakršnokoli kopiranje, distribuiranje ali spreminjanje
              vsebine brez pisnega dovoljenja je prepovedano.
            </p>
          </section>

          {/* 8. Varstvo osebnih podatkov */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Varstvo osebnih podatkov</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Ponudnik obdeluje osebne podatke v skladu z Uredbo (EU) 2016/679 (GDPR) in
              veljavno slovensko zakonodajo. Podrobnosti o obdelavi osebnih podatkov so
              navedene v <a href="/privacy" className="text-accent hover:underline">Politiki zasebnosti</a>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Z uporabo platforme uporabnik soglaša z obdelavo svojih podatkov v skladu s
              politiko zasebnosti.
            </p>
          </section>

          {/* 9. Pravica do odstopa */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Pravica do odstopa od pogodbe</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Potrošnik ima pravico, da v 14 dneh od sklenitve naročnine brez navedbe razloga
              odstopi od pogodbe. Za uveljavitev pravice do odstopa morate ponudnika obvestiti
              z nedvoumno izjavo (npr. po elektronski pošti).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              V primeru odstopa vam ponudnik povrne vsa prejeta plačila najpozneje v 14 dneh
              od prejema obvestila o odstopu.
            </p>
          </section>

          {/* 10. Prepovedana ravnanja */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Prepovedana ravnanja</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Pri uporabi platforme je prepovedano:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Zloraba platforme za nezakonite namene</li>
              <li>Poskusi nepooblaščenega dostopa do sistema</li>
              <li>Avtomatizirano zajemanje podatkov (scraping)</li>
              <li>Deljenje prijavnih podatkov s tretjimi osebami</li>
              <li>Vnos lažnih ali zavajajočih informacij</li>
              <li>Motenje delovanja platforme</li>
            </ul>
          </section>

          {/* 11. Reševanje sporov */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Reševanje sporov</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Za reševanje sporov si bosta stranki prizadevali za sporazumno rešitev. Če
              sporazumna rešitev ni mogoča, je za reševanje sporov pristojno sodišče v Ljubljani.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Za potrošniške spore je na voljo tudi platforma za spletno reševanje sporov
              (ODR platforma): <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://ec.europa.eu/odr</a>
            </p>
          </section>

          {/* 12. Končne določbe */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Končne določbe</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Za razmerja med ponudnikom in uporabnikom se uporablja pravo Republike Slovenije.
            </p>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Če se katera od določb teh pogojev izkaže za neveljavno, to ne vpliva na
              veljavnost ostalih določb.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Za vprašanja v zvezi s temi pogoji nas kontaktirajte na: {' '}
              <a href="mailto:podpora@pravna.ai" className="text-accent hover:underline">
                podpora@pravna.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
