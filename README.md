# Bloom

A gentle daily ritual app for sensitive people. Calm, minimal, and easy to extend.

## Stack

- Expo (managed)
- React Native + TypeScript
- React Navigation (native stack)
- Zustand (local state)
- NativeWind (Tailwind)

## Structure

- `App.tsx`: navigation root
- `app/screens`: screen components
- `app/components`: reusable UI
- `app/store`: Zustand stores
- `app/theme`: colors and spacing tokens
- `app/types`: shared types

## Styling

NativeWind is enabled via:
- `babel.config.js` (plugin)
- `metro.config.js` (withNativeWind)
- `global.css` (Tailwind directives)

## Running

- `npm run start`
- `npm run ios`
- `npm run android`

## Design Notes

- Soft colors, low contrast, minimal UI
- No gamification, no pressure states
- Everything optional and calm by default
