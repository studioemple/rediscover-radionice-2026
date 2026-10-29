/* All page content in one place.
   • WORKSHOPS — shared structure (times, logos) for every language.
   • LOREM_*   — placeholder workshop titles/descriptions until partners
                 deliver their copy. Replace per workshop in `WORKSHOPS`.
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
export type WorkshopId = "rentlio" | "worldline" | "seyfor" | "phobs";

const LOREM_TITLE = "Lorem ipsum dolor sit amet, consectetur adipiscing";
const LOREM_BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.";

export type Workshop = {
  id: WorkshopId;
  name: string;
  logo: string;
  /** Logo height class — logos have very different aspect ratios. */
  logoClass: string;
  /** PNG partner logos are white artwork → rendered in ink via CSS filter. */
  logoInk?: boolean;
  start: string;
  end: string;
  minutes: number;
  title: string;
  body: string;
  /** Optional agenda inside the workshop (confirmed for Rentlio Pro). */
  program?: { key: "intro" | "deepdive"; speaker: string; img: string }[];
};

export const WORKSHOPS: Workshop[] = [
  {
    id: "rentlio",
    name: "Rentlio Pro",
    logo: "/rentlio-logo.svg",
    logoClass: "h-7 lg:h-8",
    start: "09:15",
    end: "10:30",
    minutes: 75,
    title: LOREM_TITLE,
    body: LOREM_BODY,
    program: [
      { key: "intro", speaker: "Marko Mišulić", img: "/speakers/marko-misulic.jpg" },
      { key: "deepdive", speaker: "Pankracije Barać", img: "/speakers/pankracije-barac.jpg" },
    ],
  },
  {
    id: "worldline",
    name: "Worldline · Rentlio Pay",
    logo: "/partners/worldline.png",
    logoClass: "h-[18px] lg:h-5",
    logoInk: true,
    start: "10:45",
    end: "11:15",
    minutes: 30,
    title: LOREM_TITLE,
    body: LOREM_BODY,
  },
  {
    id: "seyfor",
    name: "Seyfor",
    logo: "/partners/seyfor.png",
    logoClass: "h-8 lg:h-9",
    logoInk: true,
    start: "11:15",
    end: "11:45",
    minutes: 30,
    title: LOREM_TITLE,
    body: LOREM_BODY,
  },
  {
    id: "phobs",
    name: "PHOBS",
    logo: "/partners/phobs.svg",
    logoClass: "h-[22px] lg:h-6",
    logoInk: true,
    start: "11:45",
    end: "12:15",
    minutes: 30,
    title: LOREM_TITLE,
    body: LOREM_BODY,
  },
];

/** Coffee break sits between these two workshops. */
export const BREAK = { after: "rentlio" as WorkshopId, start: "10:30", end: "10:45" };

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
    orbitTop: string;
    orbitBottom: string;
  };
  schedule: {
    eyebrow: string;
    title: string;
    body: string;
    coffee: string;
    minutes: string;
    register: string;
    programLabel: string;
    program: { intro: string; deepdive: string };
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
    venue: "Hotel Iadera, Petrčane",
    seats: "Ograničen broj mjesta",
    cta: "Prijavite se",
    scheduleLink: "Pogledajte raspored",
    orbitTop: "4 radionice",
    orbitBottom: "jedno jutro",
  },
  schedule: {
    eyebrow: "Raspored",
    title: "Što možete očekivati od radionica?",
    body: "Četiri radionice, jedna za drugom. Odaberite one koje vas zanimaju ili ostanite do kraja.",
    coffee: "Pauza za kavu",
    minutes: "min",
    register: "Prijavite se",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
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
    venue: "Hotel Iadera, Petrčane",
    seats: "Limited seats",
    cta: "Register",
    scheduleLink: "See the schedule",
    orbitTop: "4 workshops",
    orbitBottom: "one morning",
  },
  schedule: {
    eyebrow: "Schedule",
    title: "What to expect from the workshops?",
    body: "Four workshops, back to back. Pick the ones that interest you or stay for the whole morning.",
    coffee: "Coffee break",
    minutes: "min",
    register: "Register",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
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
    venue: "Hotel Iadera, Petrčane",
    seats: "Omejeno število mest",
    cta: "Prijavite se",
    scheduleLink: "Oglejte si urnik",
    orbitTop: "4 delavnice",
    orbitBottom: "eno dopoldne",
  },
  schedule: {
    eyebrow: "Urnik",
    title: "Kaj lahko pričakujete od delavnic?",
    body: "Štiri delavnice, ena za drugo. Izberite tiste, ki vas zanimajo, ali ostanite do konca.",
    coffee: "Odmor za kavo",
    minutes: "min",
    register: "Prijavite se",
    programLabel: "Program",
    program: { intro: "High level intro", deepdive: "Product deep dive" },
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
