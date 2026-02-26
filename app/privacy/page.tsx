import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politika zasebnosti | PravnaAI',
  description: 'Politika zasebnosti platforme PravnaAI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold font-serif mb-2">
          Politika zasebnosti
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Zadnja posodobitev: {new Date().toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-sm max-w-none text-foreground">
          {/* Uvod */}
          <section className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Ta politika zasebnosti pojasnjuje, kako [IME PODJETJA] (v nadaljevanju: &quot;mi&quot;, &quot;nas&quot;)
              zbira, uporablja in varuje vaše osebne podatke pri uporabi platforme PravnaAI.
              Vaša zasebnost nam je pomembna in zavezani smo k njeni zaščiti.
            </p>
          </section>

          {/* 1. Upravljavec podatkov */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Upravljavec osebnih podatkov</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec vaših osebnih podatkov je:<br />
              [IME PODJETJA]<br />
              [NASLOV]<br />
              [DAVČNA ŠTEVILKA]<br />
              E-pošta: <a href="mailto:podpora@pravna.ai" className="text-accent hover:underline">podpora@pravna.ai</a>
            </p>
          </section>

          {/* 2. Katere podatke zbiramo */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Katere podatke zbiramo</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Zbiramo naslednje kategorije osebnih podatkov:
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Podatki o računu</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>E-poštni naslov</li>
              <li>Ime (če je na voljo preko Google prijave)</li>
              <li>Profilna slika (če je na voljo preko Google prijave)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Podatki o uporabi</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Zgodovina pogovorov in poizvedb</li>
              <li>Generirani dokumenti</li>
              <li>Naročniški podatki in zgodovina plačil</li>
              <li>Dnevniki uporabe (število poizvedb)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Tehnični podatki</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>IP naslov</li>
              <li>Vrsta brskalnika in naprave</li>
              <li>Podatki o sejah (piškotki)</li>
            </ul>
          </section>

          {/* 3. Namen obdelave */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Namen obdelave podatkov</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Vaše podatke obdelujemo za naslednje namene:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Zagotavljanje storitve</strong> - za delovanje platforme in obdelavo vaših poizvedb</li>
              <li><strong className="text-foreground">Upravljanje računa</strong> - za avtentikacijo in upravljanje vašega uporabniškega računa</li>
              <li><strong className="text-foreground">Obračun</strong> - za obdelavo plačil in vodenje evidence naročnin</li>
              <li><strong className="text-foreground">Komunikacija</strong> - za pošiljanje obvestil o storitvi in odgovarjanje na vaša vprašanja</li>
              <li><strong className="text-foreground">Izboljšave</strong> - za analizo uporabe in izboljšanje kakovosti storitve</li>
              <li><strong className="text-foreground">Varnost</strong> - za odkrivanje in preprečevanje zlorab</li>
            </ul>
          </section>

          {/* 4. Pravna podlaga */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Pravna podlaga za obdelavo</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Vaše podatke obdelujemo na podlagi:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Izvajanje pogodbe</strong> (člen 6(1)(b) GDPR) - obdelava je potrebna za zagotavljanje storitve</li>
              <li><strong className="text-foreground">Zakoniti interes</strong> (člen 6(1)(f) GDPR) - za izboljšanje storitve in varnost</li>
              <li><strong className="text-foreground">Zakonska obveznost</strong> (člen 6(1)(c) GDPR) - za izpolnjevanje davčnih in računovodskih obveznosti</li>
            </ul>
          </section>

          {/* 5. Deljenje podatkov */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Deljenje podatkov s tretjimi osebami</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Vaše podatke delimo z naslednjimi kategorijami prejemnikov:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Supabase</strong> - hramba podatkov in avtentikacija (strežniki v EU)</li>
              <li><strong className="text-foreground">OpenAI</strong> - obdelava poizvedb z AI sistemom (strežniki v ZDA, ustrezne zaščitne ukrepe)</li>
              <li><strong className="text-foreground">Stripe</strong> - obdelava plačil (PCI DSS skladen)</li>
              <li><strong className="text-foreground">Vercel</strong> - gostovanje platforme</li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              S ponudniki storitev imamo sklenjene ustrezne pogodbe o obdelavi podatkov (DPA).
            </p>
          </section>

          {/* 6. Hramba podatkov */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Obdobje hrambe podatkov</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Podatki o računu</strong> - do izbrisa računa</li>
              <li><strong className="text-foreground">Zgodovina pogovorov</strong> - do izbrisa računa ali ročnega izbrisa</li>
              <li><strong className="text-foreground">Podatki o plačilih</strong> - 10 let (zakonska obveznost)</li>
              <li><strong className="text-foreground">Dnevniki</strong> - 30 dni</li>
            </ul>
          </section>

          {/* 7. Vaše pravice */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Vaše pravice</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              V skladu z GDPR imate naslednje pravice:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Pravica dostopa</strong> - zahtevate lahko kopijo svojih podatkov</li>
              <li><strong className="text-foreground">Pravica do popravka</strong> - zahtevate lahko popravek netočnih podatkov</li>
              <li><strong className="text-foreground">Pravica do izbrisa</strong> - zahtevate lahko izbris svojih podatkov</li>
              <li><strong className="text-foreground">Pravica do omejitve obdelave</strong> - zahtevate lahko omejitev obdelave</li>
              <li><strong className="text-foreground">Pravica do prenosljivosti</strong> - zahtevate lahko prenos podatkov v strukturirani obliki</li>
              <li><strong className="text-foreground">Pravica do ugovora</strong> - ugovarjate lahko obdelavi na podlagi zakonitega interesa</li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Za uveljavljanje svojih pravic nas kontaktirajte na{' '}
              <a href="mailto:podpora@pravna.ai" className="text-accent hover:underline">podpora@pravna.ai</a>.
            </p>
          </section>

          {/* 8. Piškotki */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Piškotki</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Platforma uporablja naslednje piškotke:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Ime</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Namen</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Trajanje</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Vrsta</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="p-3 border-b border-border">sb-*-auth-token</td>
                    <td className="p-3 border-b border-border">Avtentikacija uporabnika</td>
                    <td className="p-3 border-b border-border">1 leto</td>
                    <td className="p-3 border-b border-border">Nujni</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">disclaimer_accepted</td>
                    <td className="p-3 border-b border-border">Sprejem opozorila</td>
                    <td className="p-3 border-b border-border">Seja</td>
                    <td className="p-3 border-b border-border">Nujni</td>
                  </tr>
                  <tr>
                    <td className="p-3">_vercel_*</td>
                    <td className="p-3">Anonimna analitika</td>
                    <td className="p-3">1 leto</td>
                    <td className="p-3">Analitični</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Nujni piškotki so potrebni za delovanje platforme in jih ni mogoče onemogočiti.
              Analitični piškotki nam pomagajo razumeti, kako uporabniki uporabljajo platformo,
              in ne vsebujejo osebnih podatkov.
            </p>
          </section>

          {/* 9. Avtomatizirano odločanje in profiliranje */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Avtomatizirano odločanje in AI obdelava</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Platforma uporablja sistem umetne inteligence (AI) za obdelavo vaših poizvedb in
              generiranje pravnih informacij. Pri tem velja:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Obdelava poizvedb</strong> - vaša vprašanja se posredujejo AI sistemu za generiranje odgovorov</li>
              <li><strong className="text-foreground">Brez avtomatiziranega odločanja</strong> - platforma ne sprejema pravno zavezujočih odločitev o vas</li>
              <li><strong className="text-foreground">Brez profiliranja</strong> - ne izvajamo profiliranja za namene avtomatiziranega odločanja</li>
              <li><strong className="text-foreground">Človeški nadzor</strong> - vse informacije so informativne narave in zahtevajo vašo lastno presojo</li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              AI generirani odgovori so namenjeni izključno informiranju in ne predstavljajo pravnega svetovanja.
              Za konkretne pravne zadeve se vedno posvetujte z usposobljenim odvetnikom.
            </p>
          </section>

          {/* 10. Varnost */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Varnost podatkov</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporabljamo ustrezne tehnične in organizacijske ukrepe za zaščito vaših podatkov,
              vključno s šifriranjem podatkov med prenosom (HTTPS), varnim shranjevanjem
              in omejitvijo dostopa do podatkov.
            </p>
          </section>

          {/* 11. Prenos podatkov v tretje države */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Prenos podatkov v tretje države</h2>
            <p className="mb-3 text-muted-foreground leading-relaxed">
              Nekateri naši ponudniki storitev imajo sedež izven Evropskega gospodarskega prostora (EGP):
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">OpenAI (ZDA)</strong> - za obdelavo AI poizvedb. OpenAI deluje v skladu z
                EU-ZDA okvirom za zasebnost podatkov (Data Privacy Framework) in ima vzpostavljene ustrezne zaščitne ukrepe.
              </li>
              <li>
                <strong className="text-foreground">Stripe (ZDA)</strong> - za obdelavo plačil. Stripe je certificiran v skladu
                z EU-ZDA okvirom za zasebnost podatkov.
              </li>
            </ul>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Za vse prenose podatkov v tretje države zagotavljamo ustrezne zaščitne ukrepe v skladu s členom 46 GDPR,
              vključno s standardnimi pogodbenimi klavzulami (SCC) kjer je to potrebno.
            </p>
          </section>

          {/* 12. Varstvo mladoletnih */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Varstvo mladoletnih</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platforma ni namenjena osebam, mlajšim od 15 let. Zavestno ne zbiramo osebnih podatkov
              otrok, mlajših od 15 let. Če ugotovimo, da smo zbrali podatke otroka brez ustreznega
              soglasja staršev ali skrbnikov, bomo te podatke nemudoma izbrisali. Če menite, da
              imamo podatke o otroku, nas prosimo kontaktirajte.
            </p>
          </section>

          {/* 13. Pritožba */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Pritožba</h2>
            <p className="text-muted-foreground leading-relaxed">
              Če menite, da obdelava vaših podatkov krši GDPR, imate pravico vložiti pritožbo
              pri Informacijskem pooblaščencu RS:{' '}
              <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                www.ip-rs.si
              </a>
            </p>
          </section>

          {/* 14. Kontakt */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">14. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              Za vprašanja v zvezi z zasebnostjo nas kontaktirajte na:{' '}
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
