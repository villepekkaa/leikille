# 🚀 Asennusohje - Leikille

Tämä ohje kertoo vaihe vaiheelta, miten saat sovelluksen käyntiin.

## Esivalmistelut

### 1. Firebase-projektin luonti

1. Mene osoitteeseen [Firebase Console](https://console.firebase.google.com/)
2. Klikkaa "Add project" tai "Lisää projekti"
3. Anna projektille nimi (esim. "leikille")
4. Jatka ja luo projekti

### 2. Firebase Authentication asetukset

1. Firebase Consolessa, valitse vasemmalta valikosta "Authentication"
2. Klikkaa "Get started"
3. Valitse "Email/Password" sign-in method
4. Aktivoi "Email/Password" (ei tarvitse aktivoida "Email link")
5. Tallenna

### 3. Firestore Database luonti

1. Firebase Consolessa, valitse "Firestore Database"
2. Klikkaa "Create database"
3. Valitse "Start in test mode" (kehitystä varten)
4. Valitse sijainti (esim. `europe-west3`)
5. Luo database

### 4. Firebase konfiguraation hakeminen

1. Firebase Consolessa, klikkaa rattaan kuvaa (⚙️) ja valitse "Project settings"
2. Scrollaa alas "Your apps" -kohtaan
3. Klikkaa web-ikonia `</>`
4. Anna app:lle nimi (esim. "leikille-web")
5. ÄLÄÄ valitse "Also set up Firebase Hosting"
6. Klikkaa "Register app"
7. Kopioi `firebaseConfig`-objekti

## Sovelluksen asennus

### 1. Riippuvuudet

Riippuvuudet on jo asennettu. Jos tarvitset asentaa ne uudelleen:

```bash
npm install
```

### 2. Firebase-konfiguraatio

Avaa tiedosto `src/config/firebase.ts` ja korvaa placeholderit Firebase Consolen tiedoilla:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",                    // Your API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Firestore säännöt (valinnainen)

Testausvaiheessa Firestore toimii "test mode" -säännöillä. Tuotantoa varten määrittele turvallisemmat säännöt Firebase Consolessa kohdassa "Firestore Database" > "Rules":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Käyttäjät voivat lukea ja kirjoittaa vain omaa profiiliaan
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kaikki kirjautuneet käyttäjät voivat lukea leikkitreffit
    match /playdates/{playdateId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.organizerId == request.auth.uid;
    }
  }
}
```

## Sovelluksen käynnistäminen

### iOS (Mac-tietokone vaaditaan)

```bash
npm run ios
```

tai

```bash
npm start
# Paina sitten 'i' näppäintä
```

### Android

Varmista, että sinulla on Android Studio asennettuna ja Android emulator käynnissä.

```bash
npm run android
```

tai

```bash
npm start
# Paina sitten 'a' näppäintä
```

### Expo Go (Fyysinen laite)

1. Asenna Expo Go -sovellus App Storesta tai Google Playsta
2. Käynnistä projekti:
   ```bash
   npm start
   ```
3. Skannaa QR-koodi Expo Go -sovelluksella

## 🧪 Testaaminen

### Luo testikäyttäjä

1. Käynnistä sovellus
2. Klikkaa "Rekisteröidy"
3. Täytä tiedot:
   - Nimi: "Testi Käyttäjä"
   - Sähköposti: "testi@example.com"
   - Salasana: "salasana123"

### Lisää testidata Firestoreen

Voit lisätä testimuotoisen leikkitreffiä Firebase Consolessa:

1. Mene Firestore Database -näkymään
2. Klikkaa "Start collection"
3. Collection ID: `playdates`
4. Lisää dokumentti seuraavilla kentillä:

```json
{
  "title": "Leikkipuistossa",
  "description": "Tavataan leikkipuistossa mukavaa menoa!",
  "organizerId": "<käyttäjän-uid>",
  "organizer": {
    "id": "<käyttäjän-uid>",
    "name": "Testi Käyttäjä",
    "email": "testi@example.com"
  },
  "location": {
    "name": "Keskuspuisto",
    "address": "Mannerheimintie 12, Helsinki",
    "coordinates": {
      "latitude": 60.1699,
      "longitude": 24.9384
    }
  },
  "date": <Timestamp - valitse tämä päivä>,
  "startTime": "14:00",
  "endTime": "16:00",
  "participants": [],
  "ageRange": {
    "min": 2,
    "max": 5
  },
  "createdAt": <Timestamp - automaattinen>,
  "updatedAt": <Timestamp - automaattinen>
}
```

## 🐛 Yleisiä ongelmia

### "Unable to resolve module..."

Ratkaisu:
```bash
npm install
# tai
rm -rf node_modules package-lock.json
npm install
```

### Firebase-virheet

- Tarkista, että `src/config/firebase.ts` on täytetty oikein
- Varmista, että Authentication ja Firestore ovat aktivoitu Firebase Consolessa

### NativeWind ei toimi

Varmista, että `babel.config.js` sisältää:
```javascript
plugins: ['nativewind/babel']
```

Tyhjennä cache ja käynnistä uudelleen:
```bash
npm start -- --clear
```

### Kartta ei näy

React Native Maps vaatii lisäkonfiguraatiota:

**iOS:**
- Maps toimii suoraan

**Android:**
- Tarvitset Google Maps API-avaimen
- Katso ohje: https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md

## 📱 Seuraavat askeleet

Kun perusversio toimii, voit lisätä:

1. **Leikkitreffi-luontinäkymä** - Mahdollisuus luoda uusia leikkejä
2. **Profiilisivu** - Käyttäjätietojen hallinta
3. **Push-notifikaatiot** - Firebase Cloud Messaging
4. **Kuvien upload** - Firebase Storage
5. **Chat** - Viestintä osallistujien välillä

Tarvitsetko apua jonkin ominaisuuden kanssa? Kysy vain! 🚀
