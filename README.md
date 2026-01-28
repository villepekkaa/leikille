# Leikille

Leikille on React Native -harjoitusprojekti, jossa lapsiperheet voivat sopia keskenään leikkitreffejä. Projekti on rakennettu ammattimaisin periaattein, mutta se on samalla oppimisympäristö: koodia kehitetään iteratiivisesti ja uusia käytäntöjä testataan vaiheittain.

## Teknologiat

- React Native (Expo)
- TypeScript
- Firebase Authentication
- Cloud Firestore
- React Navigation
- StyleSheet + teematokenit
- React Native Maps

## Ominaisuudet

Valmiina
- Rekisteröinti ja kirjautuminen
- Päivän leikkitreffien listaus
- Yksittäisen leikin tarkastelu kartalla
- Leikkiin liittyminen ja osallistujat
- Uuden leikin luonti
- Profiilisivu
- Bottom tab -navigaatio

Suunnitteilla
- Push-notifikaatiot
- Chat-toiminto
- Kuvien lisäys
- Suodatus ja haku
- AsyncStorage Firebase-autentikaatioon

## Projektin rakenne

```
src/
├── components/     # Uudelleenkäytettävät UI-komponentit
├── screens/        # Näkymät
├── hooks/          # Custom hookit
├── services/       # Firebase-palvelut
├── navigation/     # Navigaatiot
├── types/          # TypeScript-tyypit
├── config/         # Konfiguraatiot
└── utils/          # Apufunktiot (tuleva)
```

## Asennus ja käynnistys

1. Asenna riippuvuudet:
   ```bash
   npm install
   ```

2. Konfiguroi Firebase (ohjeet):
   - Vaiheittainen ohje ja vianetsintä: `SETUP.md`.
   - Täytä `src/config/firebase.ts` omilla Firebase-tiedoilla.

3. Käynnistä sovellus:
   ```bash
   npm start
   ```

Pikanäppäimet Expo CLI:ssa:
- `i` = iOS-simulaattori (macOS)
- `a` = Android-emulaattori
- QR-koodi = Expo Go -sovellus

## Komennot

- `npm start` — Expo dev server
- `npm run ios` — iOS-simulaattori
- `npm run android` — Android-emulaattori
- `npm run web` — Web
- `npm start -- --clear` — tyhjennä välimuisti

## Tyylittely

Käytä teematokeneita `src/theme/index.ts` ja `StyleSheet.create` -määrittelyjä. Vältä kovakoodattuja värejä.

Esimerkki:
```tsx
import { colors, spacing } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },
});
```

## Firestore-rakenne (tiivistetty)

`users`-kokoelma sisältää käyttäjien perusprofiilin.
`playdates`-kokoelma sisältää leikkitreffien tiedot, sijainnin ja osallistujat.

Tarkempi malli löytyy koodista: `src/types/index.ts`.

## Kehitystyyli (lyhyesti)

- Pidä koodi selkeänä ja pienissä osissa.
- Palvelukutsut `src/services/`-kansioon.
- Tyypit `src/types/index.ts`.
- UI-tekstit pääosin suomeksi.

## Testaus

Tällä hetkellä testejä ei ole konfiguroitu. Testaus lisätään myöhemmin, kun perusarkkitehtuuri on vakiintunut.

## Lisenssi

MIT
