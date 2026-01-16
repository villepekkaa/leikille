# Leikille - Leikkitreffisovellus

React Native -sovellus, jossa lapsiperheet voivat sopia keskenään leikkitreffejä.

## 🚀 Teknologiat

- **React Native** (Expo)
- **TypeScript**
- **Firebase Authentication** - Käyttäjien kirjautuminen
- **Cloud Firestore** - NoSQL-tietokanta leikkitreffeille
- **React Navigation** - Navigaatio
- **NativeWind** (Tailwind CSS) - Tyylittely
- **React Native Maps** - Karttanäkymät

## 📁 Projektin rakenne

```
src/
├── components/     # Uudelleenkäytettävät UI-komponentit
│   ├── Button.tsx
│   ├── Input.tsx
│   └── PlaydateCard.tsx
├── screens/        # Näkymät
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   └── PlaydateDetailScreen.tsx
├── hooks/          # Custom React hookit
│   └── useAuth.ts
├── services/       # Firebase-palvelut
│   ├── auth.service.ts
│   └── firestore.service.ts
├── navigation/     # React Navigation setup
│   └── AppNavigator.tsx
├── types/          # TypeScript tyypit
│   └── index.ts
├── config/         # Konfiguraatiotiedostot
│   └── firebase.ts
└── utils/          # Apufunktiot (tuleva)
```

## ⚙️ Asennus

1. **Kloonaa repositorio**
   ```bash
   git clone <repository-url>
   cd leikille
   ```

2. **Asenna riippuvuudet**
   ```bash
   npm install
   ```

3. **Konfiguroi Firebase**
   
   - Luo projekti [Firebase Console](https://console.firebase.google.com/):ssa
   - Aktivoi Authentication (Email/Password)
   - Luo Firestore-tietokanta
   - Kopioi Firebase-konfiguraatio tiedostoon `src/config/firebase.ts`:
   
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Käynnistä sovellus**
   ```bash
   npm start
   ```
   
   Valitse sitten:
   - `i` - iOS simulator
   - `a` - Android emulator
   - Skannaa QR-koodi Expo Go -sovelluksella (iOS/Android)

## 🎨 Tailwind CSS (NativeWind)

Sovellus käyttää NativeWindiä, joka tuo Tailwindin React Nativeen. Värit on määritelty keskitetysti `tailwind.config.js`-tiedostossa:

- **Primary** - Punaiset sävyt (toimintopainikkeet)
- **Secondary** - Vihreät sävyt (onnistumisviestit)
- **Accent** - Siniset sävyt (korosterus)

Käyttö komponenteissa:
```tsx
<View className="bg-primary-600 p-4 rounded-lg">
  <Text className="text-white font-bold">Tervetuloa!</Text>
</View>
```

## 📱 Ominaisuudet

### Valmiina
- ✅ Käyttäjien rekisteröinti ja kirjautuminen
- ✅ Päivän leikkitreffien listaus
- ✅ Yksittäisen leikkin tarkastelu kartalla
- ✅ Leikkiin liittyminen
- ✅ Osallistujien näyttö

### Tulossa
- 🔄 Uuden leikkin luominen
- 🔄 Profiilisivu
- 🔄 Push-notifikaatiot
- 🔄 Chat-toiminto
- 🔄 Kuvien lisäys
- 🔄 Suodatus ja haku

## 🗄️ Firestore-rakenne

### Users-kokoelma
```typescript
{
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  children: Child[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Playdates-kokoelma
```typescript
{
  id: string;
  title: string;
  description: string;
  organizerId: string;
  location: {
    name: string;
    address: string;
    coordinates: { latitude: number; longitude: number; }
  };
  date: Timestamp;
  startTime: string;
  endTime: string;
  participants: Participant[];
  maxParticipants?: number;
  ageRange: { min: number; max: number; };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🤝 Kehitys

Sovellus on rakennettu modulaarisesti, joten uusien ominaisuuksien lisääminen on helppoa:

1. Luo uusi komponentti `src/components/`-kansioon
2. Luo uusi näkymä `src/screens/`-kansioon
3. Lisää navigaatio `src/navigation/AppNavigator.tsx`-tiedostoon
4. Luo tarvittavat servicet `src/services/`-kansioon

## 📝 Lisenssi

MIT
