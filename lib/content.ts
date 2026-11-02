/* All page content in one place.
   • WORKSHOPS — shared structure (times, logos) for every language.
   • copy      — workshop title + description per language (Dell: TBA).
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

/* ───────── Workshops ───────── */
export type WorkshopId = "rentlio" | "worldline" | "seyfor" | "phobs" | "smartness" | "lighthouse" | "dell";

/* Two parallel programmes ("tracks"), each in its own hall(s). */
export type HallId = "levant" | "tramontana" | "maestral";
export type TrackId = "main" | "parallel";
/** All halls are in Hotel Iadera. */
export const VENUE_SHORT = "Iadera";

/** Workshop title + description per language. Paragraphs split on "\n". */
export type Copy = Record<Lang, { title: string; body: string }>;

export type Workshop = {
  id: WorkshopId;
  track: TrackId;
  hall: HallId;
  name: string;
  /** Shorter label for the tight timetable blocks. */
  short?: string;
  logo: string;
  /** Logo height class — logos have very different aspect ratios. */
  logoClass: string;
  /** PNG partner logos are white artwork → rendered in ink via CSS filter. */
  logoInk?: boolean;
  /** Joint workshop with Rentlio → the card shows both logos. */
  withRentlio?: boolean;
  /** Logo size inside the small hero-orbit chips and the form options. */
  chipLogoClass: string;
  start: string;
  end: string;
  minutes: number;
  /** Missing → the card shows "workshop details coming soon". */
  copy?: Copy;
  /** Optional agenda inside the workshop (confirmed for Rentlio Pro). */
  program?: { key: "intro" | "deepdive"; speaker: string; img: string }[];
};

export const WORKSHOPS: Workshop[] = [
  {
    id: "rentlio",
    track: "main",
    hall: "levant",
    name: "Rentlio Pro",
    logo: "/rentlio-logo.svg",
    logoClass: "h-7 lg:h-8",
    chipLogoClass: "h-3 sm:h-4",
    start: "09:15",
    end: "10:30",
    minutes: 75,
    copy: {
      hr: {
        title: "Rentlio Pro Deep Dive: Jednostavnije upravljanje hotelskim poslovanjem",
        body: "Upoznajte Rentlio Pro, moderni cloud PMS za efikasno upravljanje svakodnevnim hotelskim operacijama. Radionica donosi konkretne primjere korištenja sustava te detaljniji pregled svih ključnih funkcionalnosti, a namijenjena je vlasnicima i menadžerima hotela te voditeljima hotelskih odjela. Nakon radionice slijede zajedničke radionice s integracijskim partnerima.",
      },
      en: {
        title: "Rentlio Pro Deep Dive: Hotel Operations Simplified",
        body: "Discover Rentlio Pro, a modern cloud-based PMS designed to streamline everyday hotel operations. This workshop will showcase practical use cases and provide an in-depth look at the system's key features. It is designed for hotel owners, general managers, and department heads. The session will be followed by joint workshops with Rentlio's integration partners.",
      },
      sl: {
        title: "Rentlio Pro Deep Dive: Enostavnejše upravljanje hotelskega poslovanja",
        body: "Spoznajte Rentlio Pro, sodoben PMS v oblaku, zasnovan za učinkovito upravljanje vsakodnevnih hotelskih operacij. Na delavnici bodo predstavljeni praktični primeri uporabe sistema in podrobnejši pregled vseh ključnih funkcionalnosti. Namenjena je lastnikom in direktorjem hotelov ter vodjem hotelskih oddelkov. Delavnici bodo sledile skupne delavnice z Rentlijevimi integracijskimi partnerji.",
      },
    },
    program: [
      { key: "intro", speaker: "Marko Mišulić", img: "/speakers/marko-misulic.jpg" },
      { key: "deepdive", speaker: "Pankracije Barać", img: "/speakers/pankracije-barac.jpg" },
    ],
  },
  {
    id: "worldline",
    track: "main",
    hall: "levant",
    name: "Worldline × Rentlio",
    short: "Worldline",
    logo: "/partners/worldline.png",
    logoClass: "h-[18px] lg:h-5",
    logoInk: true,
    withRentlio: true,
    chipLogoClass: "h-2.5 sm:h-3.5",
    start: "10:45",
    end: "11:15",
    minutes: 30,
    copy: {
      hr: {
        title: "Rentlio Pay: Automatizirana naplata rezervacija i potpuna kontrola naplate",
        body: "Nastavak radionice Rentlio Pro Deep Dive na kojem će predstavnici kompanije Worldline i Rentlio zajedno predstaviti Rentlio Pay – proizvod koji u potpunosti automatizira naplatu rezervacija i pruža funkcionalnosti koje uklanjaju potrebu za ručnim radom i štede zaposlenicima vrijeme.",
      },
      en: {
        title: "Rentlio Pay: Automated Reservation Payments and Full Control Over Payment Management",
        body: "Building on the Rentlio Pro Deep Dive session, representatives from Worldline and Rentlio will introduce Rentlio Pay, a solution that fully automates reservation payments and offers features designed to eliminate manual tasks and save hotel staff valuable time.",
      },
      sl: {
        title: "Rentlio Pay: Avtomatizirana plačila rezervacij in popoln nadzor nad plačili",
        body: "Na nadaljevanju delavnice Rentlio Pro Deep Dive bodo predstavniki podjetij Worldline in Rentlio skupaj predstavili Rentlio Pay – rešitev, ki v celoti avtomatizira plačila rezervacij ter ponuja funkcionalnosti, ki odpravljajo potrebo po ročnem delu in hotelskemu osebju prihranijo dragocen čas.",
      },
    },
  },
  {
    id: "seyfor",
    track: "main",
    hall: "levant",
    name: "Seyfor × Rentlio",
    short: "Seyfor",
    logo: "/partners/seyfor.png",
    logoClass: "h-8 lg:h-9",
    logoInk: true,
    withRentlio: true,
    chipLogoClass: "h-4 sm:h-5",
    start: "11:15",
    end: "11:45",
    minutes: 30,
    copy: {
      hr: {
        title: "Povezani sustavi, jednostavnije računovodstvo: Rentlio Pro i Minimax",
        body: "Radionica donosi uvid u cijeli proces računovodstvene integracije, uključujući obradu podataka u alatu Minimax nakon njihova prijenosa iz Rentlio Pro PMS-a. Cilj radionice je pokazati da integracija s računovodstvenim sustavom ne mora biti složena te sudionicima približiti njezino funkcioniranje i konkretne koristi za poslovanje.",
      },
      en: {
        title: "Connected Systems, Simpler Accounting: Rentlio Pro and Minimax",
        body: "This workshop will walk participants through the entire accounting integration process, including how data is processed in Minimax after being transferred from Rentlio Pro PMS. The goal is to demonstrate that integrating with an accounting system doesn't have to be complicated, while providing a clear understanding of how the integration works and the practical benefits it brings to hotel operations.",
      },
      sl: {
        title: "Povezani sistemi, enostavnejše računovodstvo: Rentlio Pro in Minimax",
        body: "Delavnica ponuja vpogled v celoten proces računovodske integracije, vključno z obdelavo podatkov v programu Minimax po njihovem prenosu iz sistema Rentlio Pro PMS. Cilj delavnice je pokazati, da povezovanje z računovodskim sistemom ni nujno zapleteno, ter udeležencem predstaviti, kako integracija deluje in kakšne konkretne koristi prinaša njihovemu poslovanju.",
      },
    },
  },
  {
    id: "phobs",
    track: "main",
    hall: "levant",
    name: "PHOBS × Rentlio",
    short: "PHOBS",
    logo: "/partners/phobs.svg",
    logoClass: "h-[22px] lg:h-6",
    logoInk: true,
    withRentlio: true,
    chipLogoClass: "h-3 sm:h-4",
    start: "11:45",
    end: "12:15",
    minutes: 30,
    copy: {
      hr: {
        title: "Kako funkcionira hotelska distribucija u praksi",
        body: "U fokusu radionice bit će PHOBS rješenja za hotelsku distribuciju i online prodaju te mogućnosti njihove integracije s Rentlio Pro PMS-om. Saznajte kako optimizirati online prodaju, iskoristiti prodajne kanale i stvoriti prilike za povećanje hotelskih prihoda.",
      },
      en: {
        title: "How Hotel Distribution Works in Practice",
        body: "This workshop will focus on PHOBS solutions for hotel distribution and online sales, as well as their integration capabilities with Rentlio Pro PMS. Discover how to optimize online sales, make the most of your distribution channels, and create new opportunities to increase hotel revenue.",
      },
      sl: {
        title: "Kako deluje hotelska distribucija v praksi",
        body: "Delavnica bo osredotočena na rešitve PHOBS za hotelsko distribucijo in spletno prodajo ter možnosti njihove integracije s sistemom Rentlio Pro PMS. Spoznajte, kako optimizirati spletno prodajo, bolje izkoristiti prodajne kanale in ustvariti nove priložnosti za povečanje prihodkov vašega hotela.",
      },
    },
  },
  // ─── Parallel track (Tramontana / Maestral), runs alongside Dvorana Levant.
  //     Halls alternate so the next workshop can set up during the 5-min gap. ───
  {
    id: "smartness",
    track: "parallel",
    hall: "tramontana",
    name: "Smartness",
    logo: "/partners/smartness.svg",
    logoClass: "h-6 lg:h-7",
    chipLogoClass: "h-3 sm:h-4",
    start: "10:00",
    end: "10:45",
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
    start: "10:50",
    end: "11:35",
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
    start: "11:40",
    end: "12:25",
    minutes: 45,
    // copy: details coming soon
  },
];

/** Coffee break in Dvorana Levant, right after Rentlio Pro. */
export const BREAK = { after: "rentlio" as WorkshopId, start: "10:30", end: "10:45" };

export const TRACKS: { id: TrackId; halls: HallId[] }[] = [
  { id: "main", halls: ["levant"] },
  { id: "parallel", halls: ["tramontana", "maestral"] },
];

/** "09:15" → minutes since midnight. */
export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
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
    scheduleLink: string;
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
    soon: string;
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
    eyebrow: "Radionice partnera",
    title: "Otvorene su prijave za radionice i prezentacije partnera",
    body: "Dan nakon Rediscovera održat će se radionice naših partnera. Konkretna rješenja, demonstracije uživo i vrijeme za vaša pitanja.",
    date: "13. 11. 2026.",
    venue: "Hotel Iadera",
    seats: "Ograničen broj mjesta",
    cta: "Prijavite se",
    scheduleLink: "Pogledajte raspored",
    orbitTop: (n) => `${n} ${n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? "radionice" : "radionica"}`,
  },
  schedule: {
    eyebrow: "Raspored",
    title: "Što možete očekivati od radionica?",
    body: "Program se odvija u dvije usporedne linije: Rentlio Pro i rješenja partnera u dvorani Levant te radionice partnera u dvoranama Tramontana i Maestral. Odaberite one koje vas zanimaju.",
    coffee: "Pauza za kavu",
    minutes: "min",
    until: "do",
    register: "Prijavite se",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Dvorana Levant", tramontana: "Dvorana Tramontana", maestral: "Dvorana Maestral" },
    tracks: {
      main: { title: "Dvorana Levant", subtitle: "Rentlio Pro i rješenja partnera" },
      parallel: { title: "Dvorane Tramontana i Maestral", subtitle: "Radionice partnera, usporedno s dvoranom Levant" },
    },
    parallelBadge: "Usporedno",
    soon: "Detalji radionice uskoro",
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
    eyebrow: "Partner workshops",
    title: "Registration is open for partner workshops and presentations",
    body: "The day after Rediscover, our partners host a morning of workshops. Practical solutions, live demos and time for your questions.",
    date: "November 13, 2026",
    venue: "Hotel Iadera",
    seats: "Limited seats",
    cta: "Register",
    scheduleLink: "See the schedule",
    orbitTop: (n) => `${n} workshop${n === 1 ? "" : "s"}`,
  },
  schedule: {
    eyebrow: "Schedule",
    title: "What to expect from the workshops?",
    body: "The programme runs in two parallel tracks: Rentlio Pro and partner solutions in Levant Hall, and partner workshops in Tramontana and Maestral Halls. Pick the ones that interest you.",
    coffee: "Coffee break",
    minutes: "min",
    until: "until",
    register: "Register",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Levant Hall", tramontana: "Tramontana Hall", maestral: "Maestral Hall" },
    tracks: {
      main: { title: "Levant Hall", subtitle: "Rentlio Pro and partner solutions" },
      parallel: { title: "Tramontana & Maestral Halls", subtitle: "Partner workshops, in parallel with Levant Hall" },
    },
    parallelBadge: "Parallel",
    soon: "Workshop details coming soon",
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
    eyebrow: "Delavnice partnerjev",
    title: "Prijave na delavnice in predstavitve partnerjev so odprte",
    body: "Dan po Rediscoveru bodo potekale delavnice naših partnerjev. Konkretne rešitve, predstavitve v živo in čas za vaša vprašanja.",
    date: "13. 11. 2026",
    venue: "Hotel Iadera",
    seats: "Omejeno število mest",
    cta: "Prijavite se",
    scheduleLink: "Oglejte si urnik",
    orbitTop: (n) => `${n} ${n === 1 ? "delavnica" : n === 2 ? "delavnici" : n <= 4 ? "delavnice" : "delavnic"}`,
  },
  schedule: {
    eyebrow: "Urnik",
    title: "Kaj lahko pričakujete od delavnic?",
    body: "Program poteka v dveh vzporednih sklopih: Rentlio Pro in rešitve partnerjev v dvorani Levant ter delavnice partnerjev v dvoranah Tramontana in Maestral. Izberite tiste, ki vas zanimajo.",
    coffee: "Odmor za kavo",
    minutes: "min",
    until: "do",
    register: "Prijavite se",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
    halls: { levant: "Dvorana Levant", tramontana: "Dvorana Tramontana", maestral: "Dvorana Maestral" },
    tracks: {
      main: { title: "Dvorana Levant", subtitle: "Rentlio Pro in rešitve partnerjev" },
      parallel: { title: "Dvorani Tramontana in Maestral", subtitle: "Delavnice partnerjev, vzporedno z dvorano Levant" },
    },
    parallelBadge: "Vzporedno",
    soon: "Podrobnosti delavnice kmalu",
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
