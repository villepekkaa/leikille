# AGENTS.md

Purpose
- This file guides agentic coding tools working in this repo.
- It summarizes how to run the app and how code is written here.

Repo summary
- React Native app built with Expo.
- TypeScript is strict (`tsconfig.json`).
- Firebase Auth + Firestore are used for backend.

Where to look first
- App entry: `App.tsx`
- Navigation: `src/navigation/AppNavigator.tsx`
- Screens: `src/screens/`
- Reusable UI: `src/components/`
- Theme/tokens: `src/theme/index.ts`
- Firebase setup: `src/config/firebase.ts`
- Services: `src/services/`
- Types: `src/types/index.ts`

Build, run, lint, test
- Install deps: `npm install`
- Start dev server: `npm start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`
- Run web: `npm run web`
- Clear Expo cache: `npm start -- --clear`

Linting and formatting
- No lint or format scripts are configured in `package.json`.
- No ESLint/Prettier config files are present.
- If you add linting, document it here and keep configs in repo root.

Testing
- No test runner is configured in `package.json`.
- There are no Jest/Vitest configs in the repo.
- Single test execution is not available yet.
- If tests are added, include a single-test command here.

Cursor/Copilot rules
- No `.cursorrules` found.
- No `.cursor/rules/` entries found.
- No `.github/copilot-instructions.md` found.

Code style guidelines

Imports
- Group by source: external modules first, then internal imports, then styles.
- Keep React import first when present.
- Use named imports for shared tokens: `colors`, `spacing`, `typography`.
- Avoid deep relative paths; prefer `../` from local feature folders.

Formatting
- Use 2-space indentation.
- Prefer trailing commas for multi-line objects and arrays.
- Use double quotes only when required by JSX; otherwise single quotes.
- Keep lines short enough for mobile screens (about 100 chars max).

TypeScript
- Keep strict typing; no `any` unless there is no alternative.
- Prefer explicit function return types when they clarify behavior.
- Use interfaces for data models in `src/types/index.ts`.
- For React components, keep props typed with interfaces or type aliases.

Naming conventions
- Components: `PascalCase` files and exports (e.g. `PlaydateCard`).
- Hooks: `useX` naming (e.g. `useAuth`).
- Services: `*.service.ts` and export a singleton object (e.g. `authService`).
- Variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Booleans: use `is`/`has`/`should` prefixes.

React patterns
- Use functional components and hooks only.
- Keep screen components in `src/screens/` and UI in `src/components/`.
- Keep styles near the component with `StyleSheet.create`.
- Use theme tokens from `src/theme/index.ts`; avoid hard-coded colors.
- Prefer `View` composition over inline conditionals with complex logic.

Navigation
- Use typed navigation params in `src/types/index.ts`.
- Keep navigator configuration in `src/navigation/AppNavigator.tsx`.
- Use `NativeStackScreenProps` or typed `useNavigation` for screens.

Firebase usage
- All Firebase calls should go through `src/services/`.
- Auth flows in `authService` and `useAuth`.
- Firestore operations in `firestoreService`.
- Keep `src/config/firebase.ts` local and never commit secrets.

Error handling
- Use `try/catch` for async service calls in screens/hooks.
- Prefer user-visible feedback via `Alert.alert` for UI errors.
- Log unexpected errors with `console.error` including context.
- Re-throw errors in hooks only when the caller handles UI feedback.

UI and theme
- Use `colors`, `spacing`, `typography`, `borderRadius`, `shadows` tokens.
- Keep UI copy in Finnish unless new feature requires English.
- Use `StyleSheet` not inline style objects.
- Prefer `ScrollView` + `KeyboardAvoidingView` for forms.

Data and formatting
- Dates should be localized with `toLocaleDateString('fi-FI', ...)`.
- Keep Firestore timestamps consistent (`Timestamp.now()` in service).
- Avoid storing derived fields in Firestore unless needed for queries.

Suggested workflow for changes
- Update types in `src/types/index.ts` first.
- Add/modify service methods, then update screens.
- Update theme tokens if new colors or spacing are needed.
- Keep UI strings consistent with existing copy.

Do not do
- Do not add new dependencies unless required and approved.
- Do not change Firebase configuration defaults without documenting it.
- Do not introduce global styles; use theme tokens instead.

Notes for agents
- This repo currently has no tests or linting; avoid adding them unless asked.
- Follow existing structure and naming to minimize churn.
