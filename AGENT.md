# AGENT.md

## Vision produit

Bloom est un rituel quotidien doux qui aide les personnes sensibles à avancer dans leur vie sans pression, grâce à de petits pas concrets.

## Ce n’est PAS

- une app de productivité
- une app de performance
- une app de coaching agressif

## C’est

- un compagnon discret
- un espace sûr
- un rythme doux



Project name: Bloom

Bloom is a gentle daily ritual app for sensitive people.
The goal is to help users feel a little better each day in less than 10 minutes.

This is NOT a productivity app.
No pressure, no performance, no aggressive gamification.

Tone: calm, kind, reassuring.
UX: minimal, slow, warm.


Goal:
Set up a clean Expo (React Native) project for a mobile app called Bloom.

Requirements:
- iOS + Android
- Clean architecture
- Simple navigation
- Easy to extend later


Tech stack:
- Expo (managed workflow)
- TypeScript
- React Navigation
- Zustand (or similar) for state
- Tailwind (NativeWind) for styling
- No backend integration yet (local state only)

Expected structure:

/app
  /screens
    HomeScreen.tsx
    RitualScreen.tsx
    JournalScreen.tsx
  /components
    Button.tsx
    Card.tsx
    MoodSelector.tsx
  /store
    ritualStore.ts
  /theme
    colors.ts
    spacing.ts
  /types


Design constraints:
- Soft colors
- No sharp contrasts
- No aggressive animations
- Minimal UI
- Everything should feel calm and slow

Avoid:
- flashy gradients
- gamified UI
- dense dashboards


Product rules:
- Never shame the user
- Never show failure states
- Silence is allowed
- Everything is optional
- Progress is implicit, not competitive


Deliverables:
- Expo project initialized
- Navigation set up
- 3 placeholder screens
- Reusable UI components
- Clean README explaining the structure

Do NOT:
- Add authentication
- Add analytics
- Add AI features
- Add notifications
- Over-engineer
