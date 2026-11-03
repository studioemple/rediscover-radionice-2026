# Rediscover 2026 — Radionice partnera

Stranica za prijavu na radionice partnera, dan nakon Rediscovera (EN / HR / SLO).
Isti stil i tehnologija kao Rediscover 2026 landing page.

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produkcijski build
```

Next.js 15 · React 19 · Tailwind 3 · GSAP. Nema env varijabli.

## Gdje se što mijenja

- **`lib/content.ts`** — sav sadržaj na jednom mjestu:
  - `WORKSHOPS` — termini, dvorane, logotipi te naslovi i opisi radionica (`copy`, EN / HR / SLO).
    Radionica 1 (Dvorana Levant) je jedna zajednička radionica: njezini dijelovi
    (Rentlio Pro → Worldline → Seyfor → PHOBS) su u `sessions`.
    Radionica bez `copy` prikazuje „Naziv radionice stiže uskoro” (placeholder).
  - `dictionaries` — svi tekstovi sučelja za EN / HR / SLO.
  - `DEFAULT_LANG` — zadani jezik (trenutno HR).
- **Za potvrditi:** datum (13. 11. 2026.) i lokacija (Hotel Iadera) — postavljeni
  prema prošlogodišnjoj stranici.

## Forma — TODO

Forma trenutno nigdje ne šalje podatke (samo validacija + poruka zahvale).
Spajanje na ticketing / CRM: `components/RegisterForm.tsx` → `onSubmit`, označeno s
`TODO (developer)`. Podaci: `{ name, company, email, workshops, lang }`.

## Struktura

- `components/Hero.tsx` — zaglavlje, hero, animirana orbita s logotipima partnera
- `components/Workshops.tsx` — raspored (sticky na desktopu, prati scroll) + kartice radionica
- `components/RegisterForm.tsx` — forma za prijavu
- `components/RentlioBackground.tsx` — pozadinske linije i Rentlio krugovi (isti kao landing page)
