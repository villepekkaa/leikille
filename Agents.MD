Project: Leikille (React Native / Expo)

Purpose
- Mobile app for arranging playdates between families.

Tech Stack
- React Native (Expo)
- TypeScript
- Firebase Authentication
- Cloud Firestore
- React Navigation
- React Native Maps

Repo Layout
- App.tsx, index.ts: app entry
- src/components: reusable UI
- src/screens: screens
- src/navigation: navigation setup
- src/services: Firebase services
- src/config: configuration (firebase)
- src/hooks: custom hooks
- src/types: TypeScript types
- src/theme: theme configuration

Key Scripts (package.json)
- npm start: start Expo
- npm run ios: Expo iOS
- npm run android: Expo Android
- npm run web: Expo web

Setup Notes
- Install deps: npm install
- Configure Firebase in src/config/firebase.ts
- Firestore/Auth must be enabled in Firebase console

Style Notes
- Styling uses React Native StyleSheet
- Color tokens documented in README.md

Data Model (Firestore)
- users: profile data
- playdates: playdate data

References
- README.md
- SETUP.md
