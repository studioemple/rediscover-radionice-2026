/* All page content in one place.
   • WORKSHOPS — shared structure (times, logos) for every language.
   • copy      — workshop title + description per language (Dell: TBA).
   • sessions  — Workshop 1's programme (Rentlio → Worldline → Seyfor → PHOBS).
   • dict      — every UI string in EN / HR / SLO. */

export type Lang = "en" | "hr" | "sl";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hr", label: "HR" },
  { code: "sl", label: "SLO" },
];

export const DEFAULT_LANG: Lang = "hr";

/* ───────── Event facts (TODO: confirm date + venue) ───────── */
export const EVENT_DATE_ISO = "2026-11-13"; // day after Rediscover (12. 11. 2026.)
export const PRIVACY_URL = "https://rediscover.rentl.io/en/privacy-policy";
export const CONTACT_EMAIL = "rediscover@rentl.io";

/** "09:15" → minutes since midnight. */
export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/* ───────── Workshops ─────────
   Four workshops. Workshop 1 (Dvorana Levant) is one joint workshop by Rentlio
   and partners, run as a sequence of sessions; 2–4 are standalone partner
   workshops in Tramontana / Maestral, in parallel with it. */
export type WorkshopId = "rentlio" | "smartness" | "lighthouse" | "dell";
export type SessionId = "rentlio" | "worldline" | "seyfor" | "phobs";

/* Two parallel programmes ("tracks"), each in its own hall(s). */
export type HallId = "levant" | "tramontana" | "maestral";
export type TrackId = "main" | "parallel";

/** Workshop title + description per language. Paragraphs split on "\n". */
export type Copy = Record<Lang, { title: string; body: string }>;

type LogoFields = {
  logo: string;
  /** Logo height class — logos have very different aspect ratios. */
  logoClass: string;
  /** PNG partner logos are white artwork → rendered in ink via CSS filter. */
  logoInk?: boolean;
  /** Logo size inside the small hero-orbit chips. */
  chipLogoClass: string;
};

/** One part of Workshop 1's programme. */
export type Session = LogoFields & {
  id: SessionId;
  name: string;
  /** Shorter label for the tight timetable rows. */
  short?: string;
  start: string;
  end: string;
  /** One line on what this part covers. */
  desc: Record<Lang, string>;
  /** Speakers (confirmed for Rentlio Pro). */
  program?: { key: "intro" | "deepdive"; speaker: string; img: string }[];
};

export type Workshop = LogoFields & {
  id: WorkshopId;
  track: TrackId;
  hall: HallId;
  name: string;
  start: string;
  end: string;
  minutes: number;
  /** Missing → the card shows "title/details coming soon". */
  copy?: Copy;
  /** Joint workshop made of several sessions (Workshop 1). */
  sessions?: Session[];
};

export const WORKSHOPS: Workshop[] = [
  {
    id: "rentlio",
    track: "main",
    hall: "levant",
    name: "Rentlio / Worldline / Seyfor / PHOBS",
    logo: "/rentlio-logo.svg",
    logoClass: "h-7 lg:h-8",
    chipLogoClass: "h-3 sm:h-4",
    start: "09:30",
    end: "12:30",
    minutes: 180,
    copy: {
      hr: {
        title: "Rentlio Pro Deep Dive: Od hotelskih operacija do povezanog poslovanja",
        body: "Upoznajte Rentlio Pro kroz pregled ključnih funkcionalnosti, konkretne primjere korištenja i mogućnosti povezivanja s drugim sustavima. Radionica započinje predstavljanjem Rentlio Pro platforme i detaljnim prikazom funkcionalnosti za upravljanje svakodnevnim hotelskim operacijama. Nakon toga slijedi predstavljanje Rentlio Pay rješenja u suradnji s Worldlineom, uz fokus na automatizaciju naplate i upravljanje plaćanjima.\nU nastavku će Seyfor Hrvatska prikazati cijeli proces računovodstvene integracije, uključujući obradu podataka u Minimaxu nakon njihova prijenosa iz Rentlija. Završni dio radionice posvećen je PHOBS rješenjima za hotelsku distribuciju i online prodaju te mogućnostima njihova povezivanja s Rentlio Pro platformom. Radionica je namijenjena hotelijerima koji žele detaljnije upoznati Rentlio Pro i saznati kako povezivanjem hotelskih operacija, plaćanja, računovodstva i distribucije mogu unaprijediti svoje poslovanje.",
      },
      en: {
        title: "Rentlio Pro Deep Dive: From Hotel Operations to Connected Business Processes",
        body: "Explore Rentlio Pro through an overview of its key features, practical use cases, and integration options with other systems. The workshop begins with an introduction to Rentlio Pro, followed by a detailed look at the features designed to manage daily hotel operations.\nNext, Rentlio and Worldline will present Rentlio Pay, focusing on payment automation and payment management. Seyfor Hrvatska will then demonstrate the complete accounting integration process, including how data is processed in Minimax after being transferred from Rentlio. The final part of the workshop will focus on PHOBS solutions for hotel distribution and online sales, including integration options with Rentlio Pro. This workshop is designed for hoteliers who want to explore Rentlio Pro in greater detail and learn how connecting hotel operations, payments, accounting, and distribution can improve their business performance.",
      },
      sl: {
        title: "Rentlio Pro Deep Dive: Od hotelskih operacij do povezanega poslovanja",
        body: "Spoznajte Rentlio Pro skozi pregled ključnih funkcionalnosti, praktičnih primerov uporabe in možnosti povezovanja z drugimi sistemi. Delavnica se začne s predstavitvijo platforme Rentlio Pro in podrobnim pregledom funkcionalnosti za upravljanje vsakodnevnih hotelskih operacij.\nSledi predstavitev rešitve Rentlio Pay v sodelovanju s podjetjem Worldline, s poudarkom na avtomatizaciji obračunavanja in upravljanju plačil. V nadaljevanju bo Seyfor Hrvatska predstavil celoten postopek računovodske integracije, vključno z obdelavo podatkov v programu Minimax po njihovem prenosu iz Rentlia. Zaključni del delavnice bo namenjen rešitvam PHOBS za hotelsko distribucijo in spletno prodajo ter možnostim njihove povezave s platformo Rentlio Pro. Delavnica je namenjena hotelirjem, ki želijo podrobneje spoznati Rentlio Pro in izvedeti, kako lahko s povezovanjem hotelskih operacij, plačil, računovodstva in distribucije izboljšajo svoje poslovanje.",
      },
    },
    // TODO confirm: split of the partner slots after the break (assumed 3 × 35 min).
    sessions: [
      {
        id: "rentlio",
        name: "Rentlio Pro",
        logo: "/rentlio-logo.svg",
        logoClass: "h-5",
        chipLogoClass: "h-3 sm:h-4",
        start: "09:30",
        end: "10:30",
        desc: {
          hr: "Predstavljanje platforme i detaljan prikaz funkcionalnosti",
          en: "Platform introduction and product deep dive",
          sl: "Predstavitev platforme in podroben prikaz funkcionalnosti",
        },
        program: [
          { key: "intro", speaker: "Marko Mišulić", img: "/speakers/marko-misulic.jpg" },
          { key: "deepdive", speaker: "Pankracije Barać", img: "/speakers/pankracije-barac.jpg" },
        ],
      },
      {
        id: "worldline",
        name: "Worldline · Rentlio Pay",
        short: "Worldline",
        logo: "/partners/worldline.png",
        logoClass: "h-3 md:h-[15px]",
        logoInk: true,
        chipLogoClass: "h-2.5 sm:h-3.5",
        start: "10:45",
        end: "11:20",
        desc: {
          hr: "Rentlio Pay: automatizacija naplate i upravljanje plaćanjima",
          en: "Rentlio Pay: payment automation and payment management",
          sl: "Rentlio Pay: avtomatizacija obračunavanja in upravljanje plačil",
        },
      },
      {
        id: "seyfor",
        name: "Seyfor Hrvatska",
        short: "Seyfor",
        logo: "/partners/seyfor.png",
        logoClass: "h-5 md:h-6",
        logoInk: true,
        chipLogoClass: "h-4 sm:h-5",
        start: "11:20",
        end: "11:55",
        desc: {
          hr: "Računovodstvena integracija s Minimaxom",
          en: "Accounting integration with Minimax",
          sl: "Računovodska integracija z Minimaxom",
        },
      },
      {
        id: "phobs",
        name: "PHOBS",
        logo: "/partners/phobs.svg",
        logoClass: "h-[15px] md:h-[18px]",
        logoInk: true,
        chipLogoClass: "h-3 sm:h-4",
        start: "11:55",
        end: "12:30",
        desc: {
          hr: "Hotelska distribucija i online prodaja",
          en: "Hotel distribution and online sales",
          sl: "Hotelska distribucija in spletna prodaja",
        },
      },
    ],
  },
  // ─── Parallel track (Tramontana / Maestral), runs alongside Dvorana Levant. ───
  {
    id: "smartness",
    track: "parallel",
    hall: "tramontana",
    name: "Smartness",
    logo: "/partners/smartness.svg",
    logoClass: "h-6 lg:h-7",
    chipLogoClass: "h-3 sm:h-4",
    start: "09:45",
    end: "10:30",
    minutes: 45,
    copy: {
      hr: {
        title: "Treba li mi to zaista? Kako odabrati pravu tehnologiju za svoj hotel",
        body: "Koji su vam tehnološki alati zaista potrebni u hotelu i kako procijeniti hoće li donijeti konkretne rezultate?\nOva radionica pomoći će vam bolje razumjeti hotelsku tehnologiju, polazeći od ciljeva koje želite postići: manje ručnog rada, više gostiju koji se vraćaju ili veći prihodi. Kroz svakodnevne hotelske procese pokazat ćemo koji alati podržavaju pojedine ciljeve i što je potrebno za njihovu učinkovitu primjenu.\nBez obzira na to koristite li još uvijek Excel tablice ili već imate nekoliko povezanih sustava, saznat ćete gdje postoji prostor za poboljšanje poslovanja i kako odabrati rješenja koja najbolje odgovaraju potrebama vašeg hotela.",
      },
      en: {
        title: "Do I really need this? Choosing the right tech for your hotel",
        body: "Which hotel tools do you actually need, and how can you tell whether they will make a difference?\nThis workshop makes sense of hotel technology by starting with what you want to achieve: less manual work, more returning guests or better revenue performance. We’ll break these goals down into everyday processes, explain which tools support them and show what needs to be in place for them to work.\nWhether you still rely on spreadsheets or already use several systems, you’ll learn where to look for improvements and how to evaluate your options.",
      },
      sl: {
        title: "Ali to res potrebujem? Kako izbrati pravo tehnologijo za svoj hotel",
        body: "Katera tehnološka orodja vaš hotel zares potrebuje in kako oceniti, ali bodo prinesla konkretne rezultate?\nTa delavnica vam bo pomagala bolje razumeti hotelsko tehnologijo, pri čemer bomo izhajali iz ciljev, ki jih želite doseči: manj ročnega dela, več gostov, ki se vračajo, ali višji prihodki. Na primerih vsakodnevnih hotelskih procesov bomo pokazali, katera orodja podpirajo posamezne cilje in kaj je potrebno za njihovo učinkovito uporabo.\nNe glede na to, ali še vedno uporabljate Excelove preglednice ali že imate več povezanih sistemov, boste izvedeli, kje so priložnosti za izboljšanje poslovanja in kako izbrati rešitve, ki najbolje ustrezajo potrebam vašega hotela.",
      },
    },
  },
  {
    id: "lighthouse",
    track: "parallel",
    hall: "maestral",
    name: "Lighthouse",
    logo: "/partners/lighthouse.svg",
    logoClass: "h-6 lg:h-7",
    logoInk: true,
    chipLogoClass: "h-3 sm:h-4",
    start: "10:45",
    end: "11:30",
    minutes: 45,
    copy: {
      hr: {
        title: "Pametnije upravljanje cijenama za hrvatske hotele",
        body: "Saznajte kako prijeći s ručnog ažuriranja cijena na automatizirano upravljanje temeljeno na podacima. Radionica donosi uvid u cijene konkurencije u stvarnom vremenu, predviđanja potražnje i podatke o tržištu kratkoročnog najma, uz demonstraciju alata Pricing Manager i njegove integracije s Rentlijem Pro. Otkrijte kako se odobrene cijene automatski prenose u PMS i prodajne kanale, bez potrebe za ručnim unosom. Radionica će obuhvatiti i sve važniju ulogu umjetne inteligencije u pretraživanju hotela te pokazati kako Connect AI pomaže hotelima povećati vidljivost i ostvariti više direktnih rezervacija.",
      },
      en: {
        title: "Smarter Pricing for Croatian Hotels",
        body: "Learn how to move from manual rate updates to automated, data-driven pricing. The workshop covers real-time competitor rates, forward-looking demand and short-term rental insights, followed by a live demo of Pricing Manager and its integration with Rentlio, where approved prices go live in your PMS and channels without re-typing. The workshop also covers the next discovery channel: AI travel search. Discover how Connect AI helps hotels get found and drives direct bookings.",
      },
      sl: {
        title: "Pametnejše oblikovanje cen za hrvaške hotele",
        body: "Spoznajte, kako preiti z ročnega posodabljanja cen na avtomatizirano oblikovanje na podlagi podatkov. Delavnica bo predstavila konkurenčne cene v realnem času, napovedi povpraševanja in podatke o trgu kratkoročnih nastanitev, sledil pa bo prikaz rešitve Pricing Manager v živo in njene integracije z Rentliom. Spoznajte, kako se potrjene cene samodejno prenesejo v PMS in prodajne kanale, brez ročnega vnašanja. Delavnica bo predstavila tudi iskanje potovanj z umetno inteligenco kot nov način odkrivanja hotelov ter pokazala, kako Connect AI pomaga hotelom povečati vidnost in pridobiti več neposrednih rezervacij.",
      },
    },
  },
  {
    id: "dell",
    track: "parallel",
    hall: "tramontana",
    name: "Dell & ComTel",
    logo: "/partners/dell-comtel.png",
    logoClass: "h-9 lg:h-11",
    logoInk: true,
    chipLogoClass: "h-4 sm:h-5",
    start: "11:35",
    end: "12:20",
    minutes: 45,
    // Details still to come — placeholder copy until Dell sends theirs.
    copy: {
      hr: { title: "DELL radionica – više detalja uskoro", body: "Detalji radionice bit će uskoro objavljeni." },
      en: { title: "DELL workshop – more details coming soon", body: "Workshop details will be announced soon." },
      sl: { title: "Delavnica DELL – več podrobnosti kmalu", body: "Podrobnosti delavnice bodo objavljene kmalu." },
    },
  },
];

/** Coffee break for all halls. Workshop 1 shows it inside its programme; in
    the parallel card list it sits after these workshops. */
export const BREAK = { after: ["smartness"] as WorkshopId[], start: "10:30", end: "10:45" };

/** Every logo for the hero orbit, in time order (Workshop 1 → its sessions). */
export const ORBIT_ITEMS = WORKSHOPS.flatMap((w) =>
  (w.sessions ?? [w]).map((x) => ({
    key: w.sessions ? `${w.id}-${x.id}` : w.id,
    workshop: w.id,
    name: x.name,
    logo: x.logo,
    logoInk: x.logoInk,
    chipLogoClass: x.chipLogoClass,
    start: x.start,
  })),
).sort((a, b) => toMin(a.start) - toMin(b.start));

export const TRACKS: { id: TrackId; halls: HallId[] }[] = [
  { id: "main", halls: ["levant"] },
  { id: "parallel", halls: ["tramontana", "maestral"] },
];

/** Earliest start / latest end across all workshops. */
export const DAY_START = WORKSHOPS.reduce((a, w) => (toMin(w.start) < toMin(a) ? w.start : a), WORKSHOPS[0].start);
export const DAY_END = WORKSHOPS.reduce((a, w) => (toMin(w.end) > toMin(a) ? w.end : a), WORKSHOPS[0].end);
/** Do two workshops overlap in time? */
export const overlaps = (a: Workshop, b: Workshop) =>
  toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

/* ───────── UI strings ───────── */
export type Dict = {
  meta: { title: string; description: string };
  header: { cta: string };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    date: string;
    venue: string;
    seats: string;
    cta: string;
    orbitTop: (n: number) => string;
  };
  schedule: {
    eyebrow: string;
    title: string;
    body: string;
    coffee: string;
    minutes: string;
    until: string;
    register: string;
    programLabel: string;
    program: { intro: string; deepdive: string };
    halls: Record<HallId, string>;
    tracks: Record<TrackId, { title: string; subtitle: string }>;
    parallelBadge: string;
    soonTitle: string;
    soonBody: string;
    /** Appended to the hall on each card, e.g. "Dvorana Levant, hotel Iadera". */
    venueSuffix: string;
  };
  form: {
    eyebrow: string;
    title: string;
    body: string;
    name: string;
    namePh: string;
    company: string;
    companyPh: string;
    email: string;
    emailPh: string;
    pick: string;
    pickHint: string;
    selectAll: string;
    clearAll: string;
    privacyPre: string;
    privacyLink: string;
    submit: string;
    errName: string;
    errCompany: string;
    errEmail: string;
    errPick: string;
    errPrivacy: string;
    clash: string;
    successTitle: string;
    successBody: string;
    again: string;
  };
  footer: { website: string; websiteUrl: string; rights: string; privacy: string };
};

const hr: Dict = {
  meta: {
    title: "Rediscover 2026 radionice | Rentlio",
    description:
      "Dan nakon Rediscovera održavaju se radionice i prezentacije naših partnera. Prijavite se na vrijeme, broj mjesta je ograničen.",
  },
  header: { cta: "Prijavite se" },
  hero: {
    eyebrow: "Radionice",
    title: "Otvorene su prijave za radionice Rentlija i ovogodišnjih partnera",
    body: "Dan nakon Rediscovera održat će se radionice Rentlija i naših partnera. Radionice donose konkretna rješenja, demonstracije uživo i odgovore na sva vaša pitanja.",
    date: "13. 11. 2026.",
    venue: "Hotel Iadera",
    seats: "Ograničen broj mjesta",
    cta: "Prijavite se",
    orbitTop: (n) => `${n} ${n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? "radionice" : "radionica"}`,
  },
  schedule: {
    eyebrow: "Raspored",
    title: "Prijavite se i saznajte sve o Rentliju Pro i rješenjima naših partnera",
    body: "Rentlio Pro radionica namijenjena je hotelijerima koji još nisu korisnici Rentlija, a žele čuti više o prednostima korištenja sustava kao i mogućnostima integracija s rješenjima koja pružaju kompanije Worldline, Seyfor i PHOBS. Paralelno će se odvijati i radionice odabranih partnera poput Smartnessa, Lighthousea i Dell Technologies.",
    coffee: "Pauza za kavu",
    minutes: "min",
    until: "do",
    register: "Prijavite se",
    programLabel: "Program radionice",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Dvorana Levant", tramontana: "Dvorana Tramontana", maestral: "Dvorana Maestral" },
    tracks: {
      main: { title: "Dvorana Levant", subtitle: "Rentlio Pro i rješenja partnera" },
      parallel: { title: "Dvorane Tramontana i Maestral", subtitle: "Radionice partnera" },
    },
    parallelBadge: "Usporedno",
    soonTitle: "Naziv radionice stiže uskoro",
    soonBody: "Detalji radionice bit će uskoro objavljeni.",
    venueSuffix: "hotel Iadera",
  },
  form: {
    eyebrow: "Prijava",
    title: "Prijavite se na radionice",
    body: "Broj mjesta na radionicama je ograničen, stoga vas pozivamo da svoje mjesto osigurate što prije.",
    name: "Ime i prezime",
    namePh: "Ivan Horvat",
    company: "Hotel / tvrtka",
    companyPh: "Hotel Uvala",
    email: "Poslovni e-mail",
    emailPh: "ivan.horvat@hoteluvala.com",
    pick: "Odaberite radionice",
    pickHint: "Moguće je odabrati više radionica",
    selectAll: "Odaberi sve",
    clearAll: "Poništi odabir",
    privacyPre: "Prihvaćam",
    privacyLink: "politiku privatnosti",
    submit: "Prijavite se",
    errName: "Upišite ime i prezime",
    errCompany: "Upišite naziv hotela ili tvrtke",
    errEmail: "Upišite ispravnu e-mail adresu",
    errPick: "Odaberite barem jednu radionicu",
    errPrivacy: "Potrebno je prihvatiti politiku privatnosti",
    clash: "Ove se radionice održavaju u isto vrijeme:",
    successTitle: "Hvala na prijavi!",
    successBody: "Potvrdu i sve detalje poslat ćemo vam na e-mail.",
    again: "Nova prijava",
  },
  footer: {
    website: "www.rentl.io",
    websiteUrl: "https://rentl.io",
    rights: "Sva prava pridržana.",
    privacy: "Pravila privatnosti",
  },
};

const en: Dict = {
  meta: {
    title: "Rediscover 2026 Workshops | Rentlio",
    description:
      "The day after Rediscover, our partners host hands-on workshops and presentations. Register early, seats are limited.",
  },
  header: { cta: "Register" },
  hero: {
    eyebrow: "Workshops",
    title: "Registration is open for workshops by Rentlio and this year's partners",
    body: "The day after Rediscover, Rentlio and our partners host a morning of workshops. Expect practical solutions, live demos and answers to all your questions.",
    date: "November 13, 2026",
    venue: "Hotel Iadera",
    seats: "Limited seats",
    cta: "Register",
    orbitTop: (n) => `${n} workshop${n === 1 ? "" : "s"}`,
  },
  schedule: {
    eyebrow: "Schedule",
    title: "Register and discover everything about Rentlio Pro and our partners' solutions",
    body: "The Rentlio Pro workshop is designed for hoteliers who don't use Rentlio yet but want to learn more about the benefits of the system and its integrations with solutions from Worldline, Seyfor and PHOBS. Running in parallel are workshops by selected partners such as Smartness, Lighthouse and Dell Technologies.",
    coffee: "Coffee break",
    minutes: "min",
    until: "until",
    register: "Register",
    programLabel: "Workshop programme",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Levant Hall", tramontana: "Tramontana Hall", maestral: "Maestral Hall" },
    tracks: {
      main: { title: "Levant Hall", subtitle: "Rentlio Pro and partner solutions" },
      parallel: { title: "Tramontana & Maestral Halls", subtitle: "Partner workshops" },
    },
    parallelBadge: "Parallel",
    soonTitle: "Workshop title coming soon",
    soonBody: "Workshop details will be announced soon.",
    venueSuffix: "Hotel Iadera",
  },
  form: {
    eyebrow: "Registration",
    title: "Register for the workshops",
    body: "Seats at the workshops are limited, so we invite you to secure your place as soon as possible.",
    name: "Full name",
    namePh: "John Smith",
    company: "Hotel / company",
    companyPh: "Hotel Arena",
    email: "Business email",
    emailPh: "john.smith@hotelarena.com",
    pick: "Choose workshops",
    pickHint: "You can choose more than one",
    selectAll: "Select all",
    clearAll: "Clear selection",
    privacyPre: "I accept the",
    privacyLink: "privacy policy",
    submit: "Register",
    errName: "Please enter your full name",
    errCompany: "Please enter your hotel or company",
    errEmail: "Please enter a valid email address",
    errPick: "Choose at least one workshop",
    errPrivacy: "Please accept the privacy policy",
    clash: "These workshops take place at the same time:",
    successTitle: "Thank you for registering!",
    successBody: "We'll send the confirmation and all details to your email.",
    again: "New registration",
  },
  footer: {
    website: "www.rentl.io",
    websiteUrl: "https://rentl.io/en",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
  },
};

const sl: Dict = {
  meta: {
    title: "Rediscover 2026 delavnice | Rentlio",
    description:
      "Dan po Rediscoveru naši partnerji pripravljajo delavnice in predstavitve. Prijavite se pravočasno, število mest je omejeno.",
  },
  header: { cta: "Prijavite se" },
  hero: {
    eyebrow: "Delavnice",
    title: "Prijave na delavnice Rentlia in letošnjih partnerjev so odprte",
    body: "Dan po Rediscoveru bodo potekale delavnice Rentlia in naših partnerjev. Delavnice prinašajo konkretne rešitve, predstavitve v živo in odgovore na vsa vaša vprašanja.",
    date: "13. 11. 2026",
    venue: "Hotel Iadera",
    seats: "Omejeno število mest",
    cta: "Prijavite se",
    orbitTop: (n) => `${n} ${n === 1 ? "delavnica" : n === 2 ? "delavnici" : n <= 4 ? "delavnice" : "delavnic"}`,
  },
  schedule: {
    eyebrow: "Urnik",
    title: "Prijavite se in spoznajte vse o Rentlio Pro in rešitvah naših partnerjev",
    body: "Delavnica Rentlio Pro je namenjena hotelirjem, ki še niso uporabniki Rentlia, a želijo izvedeti več o prednostih uporabe sistema ter o možnostih integracij z rešitvami podjetij Worldline, Seyfor in PHOBS. Vzporedno bodo potekale tudi delavnice izbranih partnerjev, kot so Smartness, Lighthouse in Dell Technologies.",
    coffee: "Odmor za kavo",
    minutes: "min",
    until: "do",
    register: "Prijavite se",
    programLabel: "Program delavnice",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Dvorana Levant", tramontana: "Dvorana Tramontana", maestral: "Dvorana Maestral" },
    tracks: {
      main: { title: "Dvorana Levant", subtitle: "Rentlio Pro in rešitve partnerjev" },
      parallel: { title: "Dvorani Tramontana in Maestral", subtitle: "Delavnice partnerjev" },
    },
    parallelBadge: "Vzporedno",
    soonTitle: "Naziv delavnice bo kmalu objavljen",
    soonBody: "Podrobnosti delavnice bodo objavljene kmalu.",
    venueSuffix: "hotel Iadera",
  },
  form: {
    eyebrow: "Prijava",
    title: "Prijavite se na delavnice",
    body: "Število mest na delavnicah je omejeno, zato vas vabimo, da si mesto zagotovite čim prej.",
    name: "Ime in priimek",
    namePh: "Matej Novak",
    company: "Hotel / podjetje",
    companyPh: "Hotel Vista",
    email: "Poslovni e-naslov",
    emailPh: "matej.novak@hotelvista.com",
    pick: "Izberite delavnice",
    pickHint: "Izberete lahko več delavnic",
    selectAll: "Izberi vse",
    clearAll: "Počisti izbor",
    privacyPre: "Sprejemam",
    privacyLink: "politiko zasebnosti",
    submit: "Prijavite se",
    errName: "Vpišite ime in priimek",
    errCompany: "Vpišite ime hotela ali podjetja",
    errEmail: "Vpišite veljaven e-naslov",
    errPick: "Izberite vsaj eno delavnico",
    errPrivacy: "Sprejeti morate politiko zasebnosti",
    clash: "Te delavnice potekajo ob istem času:",
    successTitle: "Hvala za prijavo!",
    successBody: "Potrdilo in vse podrobnosti vam bomo poslali po e-pošti.",
    again: "Nova prijava",
  },
  footer: {
    website: "www.rentl.io",
    websiteUrl: "https://rentl.io/si",
    rights: "Vse pravice pridržane.",
    privacy: "Politika zasebnosti",
  },
};

export const dictionaries: Record<Lang, Dict> = { en, hr, sl };
