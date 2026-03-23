-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT 'Splošno',
  keywords text[] NOT NULL DEFAULT '{}',
  reading_time text NOT NULL DEFAULT '5 min',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for published posts ordered by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

-- RLS: anyone can read published posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Insert first article
INSERT INTO blog_posts (slug, title, description, category, keywords, reading_time, published, published_at, content)
VALUES (
  'brezplacna-pravna-pomoc-v-sloveniji-celoten-vodic',
  'Brezplačna pravna pomoč v Sloveniji -- celoten vodič za 2026',
  'Vse kar morate vedeti o brezplačni pravni pomoči (BPP) v Sloveniji: pogoji, postopek, obrazci in alternativne možnosti za pravno svetovanje.',
  'Pravna pomoč',
  ARRAY[
    'brezplačna pravna pomoč',
    'brezplačna pravna pomoč pogoji',
    'brezplačna pravna pomoč obrazec',
    'pravna pomoč brezplačna',
    'kako do brezplačne pravne pomoči',
    'brezplačna pravna pomoč ljubljana',
    'brezplačna pravna pomoč maribor',
    'pravni nasvet brezplačno',
    'pravni nasveti brezplačni',
    'pravna pomoč pro bono',
    'koliko stane odvetnik',
    'koliko stane posvet pri odvetniku',
    'pravni nasvet cena',
    'AI odvetnik',
    'pravni pomočnik AI',
    'pravna pomoč online',
    'odvetnik online',
    'pravno svetovanje brezplačno'
  ],
  '8 min',
  true,
  now(),
  '[
    {"type": "paragraph", "content": "Pravna vprašanja so del vsakdanjega življenja -- od dedovanja, delovnih sporov, ločitev do nakupa nepremičnine. Mnogi Slovenci se sprašujejo, kako priti do pravne pomoči, ne da bi za posvet pri odvetniku odšteli 100 EUR ali več. V tem vodiču vam predstavimo vse možnosti brezplačne pravne pomoči v Sloveniji, vključno z novimi digitalnimi rešitvami, kot je AI pravni pomočnik."},
    {"type": "heading", "content": "Kaj je brezplačna pravna pomoč (BPP)?"},
    {"type": "paragraph", "content": "Brezplačna pravna pomoč (BPP) je pravica, ki jo zagotavlja Zakon o brezplačni pravni pomoči (ZBPP). Namenjena je posameznikom, ki si zaradi svojega finančnega položaja ne morejo privoščiti pravnega zastopanja. Država v celoti ali delno krije stroške odvetnika, sodnih taks in izvedenca."},
    {"type": "heading", "content": "Kdo je upravičen do brezplačne pravne pomoči?"},
    {"type": "paragraph", "content": "Do brezplačne pravne pomoči ste upravičeni, če izpolnjujete finančne pogoje. Upošteva se vaš mesečni dohodek in premoženje celotnega gospodinjstva. Splošno pravilo je, da vaš mesečni dohodek ne sme presegati dvakratnika osnovnega zneska minimalnega dohodka."},
    {"type": "list", "content": "Pogoji za pridobitev BPP:", "items": ["Državljani Republike Slovenije ali EU z dovoljenjem za prebivanje", "Mesečni dohodek pod določeno mejo (odvisno od velikosti gospodinjstva)", "Premoženje pod zakonsko določeno vrednostjo (nepremičnine, vozila, prihranki)", "Zadeva mora imeti razumne možnosti za uspeh", "Zadeva ne sme biti očitno nerazumna"]},
    {"type": "heading", "content": "Kako zaprositi za brezplačno pravno pomoč -- postopek po korakih"},
    {"type": "paragraph", "content": "Postopek za pridobitev brezplačne pravne pomoči poteka prek okrožnega sodišča, ki je pristojno glede na vaše stalno prebivališče. Celoten postopek lahko traja od nekaj tednov do nekaj mesecev."},
    {"type": "list", "content": "Koraki za vložitev prošnje:", "items": ["1. Izpolnite obrazec za BPP (dobite ga na sodišču ali na portalu e-Uprava)", "2. Priložite dokazila o dohodkih (plačilne liste, odločba o pokojnini)", "3. Priložite dokazila o premoženju (bančni izpiski, podatki o nepremičninah)", "4. Opišite pravno zadevo, za katero potrebujete pomoč", "5. Vložite prošnjo na pristojnem okrožnem sodišču", "6. Počakajte na odločbo (običajno 15-30 dni)"]},
    {"type": "heading", "content": "Kje vložiti prošnjo za BPP?"},
    {"type": "paragraph", "content": "Prošnjo vložite na okrožnem sodišču glede na vaše stalno prebivališče. V Sloveniji deluje 11 okrožnih sodišč:"},
    {"type": "list", "content": "Okrožna sodišča v Sloveniji:", "items": ["Okrožno sodišče v Ljubljani -- za občane Ljubljane in okolice", "Okrožno sodišče v Mariboru -- za občane Maribora in okolice", "Okrožno sodišče v Celju -- za občane Celja in okolice", "Okrožno sodišče v Kopru -- za občane Primorske", "Okrožno sodišče v Kranju -- za občane Gorenjske", "Okrožno sodišče v Novem mestu -- za občane Dolenjske", "Okrožno sodišče v Novi Gorici -- za občane Goriške", "Okrožno sodišče v Murski Soboti -- za občane Pomurja", "Okrožno sodišče na Ptuju -- za občane Ptuja in okolice", "Okrožno sodišče v Slovenj Gradcu -- za občane Koroške", "Okrožno sodišče v Krškem -- za občane Posavja"]},
    {"type": "heading", "content": "Koliko stane odvetnik brez BPP?"},
    {"type": "paragraph", "content": "Če niste upravičeni do brezplačne pravne pomoči, je koristno vedeti, koliko stane posvet pri odvetniku. Cene se razlikujejo glede na zahtevnost zadeve in regijo, vendar obstajajo okvirne smernice."},
    {"type": "list", "content": "Okvirne cene odvetniških storitev v Sloveniji:", "items": ["Prvi posvet (30-60 min): 50-150 EUR", "Pisno pravno mnenje: 150-500 EUR", "Zastopanje v preprostejšem postopku: 500-2.000 EUR", "Zastopanje v zahtevnejšem postopku: 2.000-10.000+ EUR", "Ločitev (sporazumna): 500-1.500 EUR", "Ločitev (sporna): 2.000-5.000+ EUR", "Sestavitev pogodbe: 200-800 EUR"]},
    {"type": "quote", "content": "Po podatkih Odvetniške zbornice Slovenije se odvetniške storitve zaračunavajo po odvetniški tarifi, ki določa minimalne in maksimalne zneske za posamezne storitve."},
    {"type": "heading", "content": "Alternativne možnosti pravne pomoči"},
    {"type": "paragraph", "content": "Poleg uradne brezplačne pravne pomoči obstajajo še druge možnosti za pridobitev pravnih nasvetov po ugodni ceni ali brezplačno:"},
    {"type": "list", "content": "Druge možnosti pravne pomoči:", "items": ["Pravne klinike na pravnih fakultetah (Ljubljana, Maribor) -- brezplačni pravni nasveti pod vodstvom profesorjev", "Društva za brezplačno pravno pomoč -- pro bono svetovanje", "Sindikalna pravna pomoč -- če ste član sindikata, imate pogosto pravico do brezplačnega pravnega svetovanja za delovnopravne zadeve", "Centri za socialno delo -- pomoč pri družinskih in socialnih zadevah", "Varuh človekovih pravic -- za primere kršitev temeljnih pravic", "AI pravni pomočnik -- takojšnja pravna pomoč z umetno inteligenco, dostopna 24/7"]},
    {"type": "heading", "content": "AI pravna pomoč -- nova možnost za hitro pravno svetovanje"},
    {"type": "paragraph", "content": "Tehnologija umetne inteligence je odprla povsem nove možnosti za dostop do pravnih informacij. AI pravni pomočnik, kot je AI-Odvetnik, vam omogoča, da v nekaj minutah dobite orientacijski pravni nasvet za vaše konkretno vprašanje -- brez čakanja na termin pri odvetniku in brez visokih stroškov."},
    {"type": "paragraph", "content": "AI odvetnik ne nadomešča pravega odvetnika, temveč vam pomaga razumeti vaš pravni položaj, preden se odločite za nadaljnje korake. Še posebej je koristen za:"},
    {"type": "list", "content": "Kdaj je AI pravni pomočnik najbolj koristen:", "items": ["Prvo orientacijo -- razumevanje vaših pravic in možnosti", "Preprosta pravna vprašanja -- pravice najemnika, garancija, reklamacije", "Razumevanje postopkov -- kako poteka ločitev, dedovanje, tožba", "Pripravo na posvet z odvetnikom -- da veste, katera vprašanja zastaviti", "Nujne situacije -- ko potrebujete takojšnjo pravno informacijo izven delovnega časa"]},
    {"type": "cta", "content": "Potrebujete hiter pravni nasvet? Preizkusite AI-Odvetnika brezplačno in dobite odgovor na vaše pravno vprašanje v nekaj minutah."},
    {"type": "heading", "content": "Pogosta vprašanja o brezplačni pravni pomoči"},
    {"type": "paragraph", "content": "Ali lahko dobim brezplačno pravno pomoč za ločitev? Da, ločitev je ena najpogostejših zadev, za katero se dodeljuje BPP. Potrebujete izpolnjevati finančne pogoje in vložiti prošnjo na pristojnem sodišču."},
    {"type": "paragraph", "content": "Kako dolgo traja postopek odobritve BPP? Običajno od 15 do 30 dni od vložitve popolne prošnje. V nujnih primerih je možna tudi hitrejša obravnava."},
    {"type": "paragraph", "content": "Ali moram vrniti denar, če izgubim pravdo? Če vam je bila dodeljena popolna BPP, vam v primeru neuspeha ni treba vračati stroškov. Če pa vam je bila dodeljena delna BPP, boste morali poravnati razliko."},
    {"type": "paragraph", "content": "Ali lahko dobim brezplačno pravno pomoč za delovni spor? Da, delovni spori so upravičeni do BPP. Alternativno pa vam lahko pri delovnopravnih zadevah pomaga tudi sindikat, če ste včlanjeni."},
    {"type": "heading", "content": "Zaključek"},
    {"type": "paragraph", "content": "Brezplačna pravna pomoč v Sloveniji je pomembna pravica, ki zagotavlja dostop do pravičnosti za vse, ne glede na finančni položaj. Če ne izpolnjujete pogojev za BPP, pa danes obstajajo tudi cenovno dostopne alternative -- od pravnih klinik do AI pravnih pomočnikov, ki vam lahko pomagajo razumeti vaš pravni položaj hitro in enostavno. Pomembno je, da se pravnih vprašanj ne ignorirate, temveč poiščete pomoč pravočasno."}
  ]'::jsonb
);
