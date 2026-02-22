export const SYSTEM_PROMPT = `Si PravnaAI, strokovni pravni svetovalec za slovensko pravo. Tvoja naloga je pomagati uporabnikom razumeti njihove pravice in možnosti glede na slovensko zakonodajo.

NAVODILA:
1. Vedno odgovarjaj v slovenščini
2. Citiraj relevantne člene zakonov (npr. Stanovanjski zakon, Obligacijski zakonik, Zakon o delovnih razmerjih)
3. Bodi jedrnat in praktičen - uporabniku daj konkretne nasvete
4. Opozori na pomembne roke (zastaralni roki, roki za pritožbe itd.)
5. Ko je primerno, priporoči naslednje korake
6. Jasno poudari, da tvoj nasvet NE nadomešča posveta z odvetnikom

OMEJITVE:
- Ne svetuj v zadevah, ki bi zahtevale zastopanje pred sodiščem
- Ne ustvarjaj lažnih pravnih dokumentov
- Vedno omeni možnost posvetovanja z odvetnikom za kompleksnejše primere

FORMAT ODGOVORA:
- Uporabi kratke odstavke
- Uporabi alineje za sezname
- Izpostavi ključne zakonske člene
- Dodaj opozorila za pomembne roke`

export const CATEGORY_CONTEXTS: Record<string, string> = {
  stanovanje: `Uporabnik ima vprašanje s področja stanovanjskega prava. Relevantna zakonodaja vključuje:
- Stanovanjski zakon (SZ-1)
- Obligacijski zakonik (OZ) - poglavje o najemnih pogodbah
- Zakon o izvršbi in zavarovanju (ZIZ)`,

  delo: `Uporabnik ima vprašanje s področja delovnega prava. Relevantna zakonodaja vključuje:
- Zakon o delovnih razmerjih (ZDR-1)
- Zakon o varnosti in zdravju pri delu (ZVZD-1)
- Zakon o inšpekciji dela (ZID-1)`,

  druzina: `Uporabnik ima vprašanje s področja družinskega prava. Relevantna zakonodaja vključuje:
- Družinski zakonik (DZ)
- Zakon o zakonski zvezi in družinskih razmerjih (ZZZDR)
- Zakon o izvršbi in zavarovanju (ZIZ)`,

  promet: `Uporabnik ima vprašanje s področja prometnega prava. Relevantna zakonodaja vključuje:
- Zakon o pravilih cestnega prometa (ZPrCP)
- Obligacijski zakonik (OZ) - odškodninska odgovornost
- Zakon o obveznih zavarovanjih v prometu (ZOZP)`,

  dolgovi: `Uporabnik ima vprašanje s področja dolgov in izvršb. Relevantna zakonodaja vključuje:
- Zakon o izvršbi in zavarovanju (ZIZ)
- Zakon o finančnem poslovanju, postopkih zaradi insolventnosti in prisilnem prenehanju (ZFPPIPP)
- Obligacijski zakonik (OZ)`,

  podjetnistvo: `Uporabnik ima vprašanje s področja gospodarskega prava. Relevantna zakonodaja vključuje:
- Zakon o gospodarskih družbah (ZGD-1)
- Obligacijski zakonik (OZ)
- Zakon o davku od dohodkov pravnih oseb (ZDDPO-2)`,

  dedovanje: `Uporabnik ima vprašanje s področja dednega prava. Relevantna zakonodaja vključuje:
- Zakon o dedovanju (ZD)
- Zakon o notariatu (ZN)
- Zakon o davku na dediščine in darila (ZDDD)`,

  potrosniki: `Uporabnik ima vprašanje s področja varstva potrošnikov. Relevantna zakonodaja vključuje:
- Zakon o varstvu potrošnikov (ZVPot-1)
- Obligacijski zakonik (OZ)
- Zakon o izvensodnem reševanju potrošniških sporov (ZIsRPS)`,
}

export function buildUserPrompt(data: {
  category: string
  role: string
  problem: string
  duration: string
  details: string
}): string {
  const categoryContext = CATEGORY_CONTEXTS[data.category] || ''

  return `${categoryContext}

PODATKI O PRIMERU:
- Vloga uporabnika: ${data.role}
- Vrsta problema: ${data.problem}
- Trajanje situacije: ${data.duration}
- Opis situacije: ${data.details}

Na podlagi teh podatkov pripravi:
1. Kratek povzetek situacije
2. Relevantne zakonske podlage s konkretnimi členi
3. Ključne roke in zastaralne roke
4. Priporočene korake za rešitev
5. Opozorilo o potrebi posveta z odvetnikom za kompleksnejše vidike`
}

export function buildFollowUpPrompt(
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  newQuestion: string
): string {
  const context = conversationHistory
    .map(m => `${m.role === 'user' ? 'Uporabnik' : 'PravnaAI'}: ${m.content}`)
    .join('\n\n')

  return `DOSEDANJI POGOVOR:
${context}

NOVO VPRAŠANJE UPORABNIKA:
${newQuestion}

Odgovori na novo vprašanje v kontekstu dosedanjega pogovora. Če je relevantno, se sklicuj na že omenjene zakonske podlage.`
}
