# Asennusohje - Leikille

Tämä on tiivis, käytännönläheinen ohje projektin käynnistämiseen. Tarkoitus on pitää setup selkeänä myös harjoittelijalle.

## Vaatimukset

- Node.js LTS
- Expo Go -sovellus tai emulaattori
- Firebase-tili

## Firebase-projekti (nopea polku)

1. Luo projekti Firebase Consolessa.
2. Ota käyttöön Authentication (Email/Password).
3. Luo Firestore-tietokanta (kehityksessä test mode on ok).
4. Lisää Web App ja kopioi `firebaseConfig`.

## Projektin konfigurointi

1. Asenna riippuvuudet:
   ```bash
   npm install
   ```

2. Täytä Firebase-konfiguraatio:
   - Avaa `src/config/firebase.ts` ja lisää omat arvot.

Esimerkkipohja:
```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Käynnistäminen

```bash
npm start
```

Expo CLI -pikanäppäimet:
- `i` = iOS-simulaattori (macOS)
- `a` = Android-emulaattori
- QR-koodi = Expo Go

Voit myös ajaa suoraan:
- `npm run ios`
- `npm run android`
- `npm run web`

## Firestore-säännöt (suositus)

Kehityksessä voit aloittaa test mode -säännöillä. Kun siirryt kohti tuotantoa, rajoita oikeudet esimerkiksi näin:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /playdates/{playdateId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.organizerId == request.auth.uid;
    }
  }
}
```

## Testidata (valinnainen)

Voit lisätä yhden testileikin Firestoreen käsin. Malli löytyy tyypeistä: `src/types/index.ts`.

## Vianetsintä

- Asenna riippuvuudet uudelleen:
  ```bash
  npm install
  ```
- Tyhjennä Expo-cache:
  ```bash
  npm start -- --clear
  ```
- Android-kartta ei näy: tarvitset Google Maps API-avaimen.
  Ohje: https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md

## Muistutus

- Älä koskaan commitoi `src/config/firebase.ts` -tiedostoon oikeita avaimia julkiseen repoan.
