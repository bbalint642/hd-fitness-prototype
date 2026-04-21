# HD Fit

Next.js 16 + React 19 + Firebase (Auth + Firestore) alapú fitness coaching platform.

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **Auth & DB:** Firebase Authentication (email/password) + Cloud Firestore
- **Animations:** Motion (Framer Motion utód)
- **Forms:** React Hook Form + Zod
- **Package manager:** pnpm

## Projektstruktúra

```
app/                    Next.js App Router oldalak (login, dashboard/coach, dashboard/client)
components/             React komponensek (UI, auth, training, success-carousel, stb.)
lib/
  auth/                 Auth absztrakció (AuthClient interfész + FirebaseAuthClient)
  db/                   UserDataClient absztrakció (mock + Firestore impl.)
  firebase/             Firebase app/auth/firestore singleton init
  training/             Edzésterv domain logika
hooks/                  Egyedi React hookok
public/                 Statikus assetek
styles/                 Globális CSS
```

## Indítás lokálisan

### 1. Függőségek telepítése

```bash
pnpm install
```

### 2. Environment változók

Másold át a `.env.example`-t `.env.local`-ba és töltsd ki a Firebase Console-ból vett értékekkel:

```bash
cp .env.example .env.local
```

Szükséges változók (mind `NEXT_PUBLIC_*` prefixszel, mert a Firebase Web SDK a kliensben fut):

| Változó | Honnan | Kötelező |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings → Web app | ✓ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` | ✓ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✓ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` | opcionális |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console | opcionális |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Web app ID | ✓ |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics Measurement ID | opcionális |

> **Biztonsági megjegyzés:** a Firebase web API key publikus — bundle-be kerül, ez szándékos. A tényleges védelmet a **Firestore Security Rules** és a **Firebase Auth** adja, NEM az API key titokban tartása. Admin SDK service-account JSON-t viszont SOHA ne commitolj.

### 3. Firebase beállítás

A projektben az authentikáció Firebase Authentication-ra épül, a user profil adatok (role, displayName) pedig a Firestore `users/{uid}` dokumentumból jönnek.

Firebase Console-ban:

1. **Authentication** → Sign-in method → **Email/Password** engedélyezése
2. **Firestore Database** létrehozása
3. Minden felhasználóhoz hozz létre egy dokumentumot a `users` kollekcióban `{uid}` ID-val, az alábbi mezőkkel:
   ```json
   {
     "role": "coach" | "client",
     "displayName": "Felhasználó neve",
     "username": "opcionális megjelenített név"
   }
   ```
4. Állíts be Firestore Security Rules-t, hogy csak a saját user-dokumentumát olvashassa/írhassa.

### 4. Dev szerver

```bash
pnpm dev
```

Nyisd meg: [http://localhost:3000](http://localhost:3000)

## Build

```bash
pnpm build
pnpm start
```

## Deploy

Vercel-re ajánlott. A Firebase env változókat a Vercel Project Settings → Environment Variables alatt add meg — ugyanazokat, amik a `.env.local`-ban vannak. A `.env.local` fájlt NE töltsd fel a repo-ba (a `.gitignore` ezt kezeli).

## Biztonság

- Minden érzékeny érték (`API key`, `auth domain`, `project ID`, stb.) a `.env.local` fájlban van, ami gitignore-olt.
- A `.env.example` template kerül be a repo-ba, valódi értékek nélkül.
- A forráskódban nincs bedrótozott credential, jelszó, email vagy API kulcs.
- Admin SDK service-account JSON fájlokat a `.gitignore` szintén kizárja (`serviceAccount*.json`, `*-firebase-adminsdk-*.json`).
