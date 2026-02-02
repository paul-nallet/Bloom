# PRD — Bloom (v1 solide et réaliste)

## Vision produit

Bloom est un rituel quotidien doux qui aide les personnes sensibles à avancer dans leur vie sans pression, grâce à de petits pas concrets.

Ce n’est PAS :

- une app de productivité
- une app de performance
- une app de coaching agressif

C’est :

- un compagnon discret
- un espace sûr
- un rythme doux

## North Star

Amener l’utilisateur à se sentir un peu mieux chaque jour, en moins de 10 minutes.

Tout ce qui dépasse ça = suspect.

## Utilisateur cible

- personnes sensibles et introspectives
- fatiguées du hustle et des injonctions
- aiment carnets, cafés, rituels
- cherchent de la constance, pas de la performance
- utilisent l’app seule, dans le calme

## Tone et UX

- Tone: calme, bienveillant, rassurant
- UX: minimal, lent, chaleureux

## Objectif du projet

Set up a clean Expo (React Native) project for a mobile app called Bloom.

## Requirements

- iOS + Android
- Clean architecture
- Simple navigation
- Easy to extend later

## Tech stack

- Expo (managed workflow)
- TypeScript
- React Navigation
- Zustand (or similar) for state
- Tailwind (NativeWind) for styling
- No backend integration yet (local state only)

## Expected structure

- `/app/screens/HomeScreen.tsx`
- `/app/screens/RitualScreen.tsx`
- `/app/screens/JournalScreen.tsx`
- `/app/components/Button.tsx`
- `/app/components/Card.tsx`
- `/app/components/MoodSelector.tsx`
- `/app/store/ritualStore.ts`
- `/app/theme/colors.ts`
- `/app/theme/spacing.ts`
- `/app/types`

## Design constraints

- Soft colors
- No sharp contrasts
- No aggressive animations
- Minimal UI
- Everything should feel calm and slow

## Avoid

- flashy gradients
- gamified UI
- dense dashboards

## Product rules

- Never shame the user
- Never show failure states
- Silence is allowed
- Everything is optional
- Progress is implicit, not competitive

## Deliverables

- Expo project initialized
- Navigation set up
- 3 placeholder screens
- Reusable UI components
- Clean README explaining the structure

## Do NOT

- Add authentication
- Add analytics
- Add AI features
- Add notifications
- Over-engineer
