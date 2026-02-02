# Feature: Micro-défis proposés (invitation douce)

> Proposer un micro-défi quotidien contextualisé, jamais imposé, avec micro-blogging, choix clairs et persistance locale.

## Summary

Nous ajoutons sur Home une carte de « micro‑blogging » qui récolte l’humeur (1–5), l’énergie (1–5) et un court texte libre. Ces signaux alimentent une sélection simple de micro‑défis (20–30 items) classés par catégorie et durée. L’app propose **un défi par jour**, formulé comme une invitation douce avec trois actions : **Essayer**, **Autre idée** (limité à 2/jour) et **Pas aujourd’hui** (cache jusqu’au lendemain). L’ensemble reste local (Zustand + persistance) et respecte les règles produit : pas d’injonction, tout est optionnel, pas de culpabilisation.

Après acceptation, un écran « Défi en cours » minimal s’affiche : texte du défi, durée affichée (sans timer actif), boutons **J’ai terminé** et **J’arrête ici**. Si l’utilisateur arrête, un nouveau défi est proposé immédiatement. Si un défi est accepté mais non terminé, il reste actif même si la journée change.

## Requirements

### Must Have
- [ ] Carte Home « micro‑blogging » : humeur 1–5 + énergie 1–5 + texte libre.
- [ ] Librairie statique 20–30 défis avec catégories `movement | rest | reflection | mental`, durée et niveau d’énergie.
- [ ] Sélection contextuelle simple (règles lisibles) basée sur humeur, énergie et inactivité.
- [ ] Un défi par jour, persisté localement.
- [ ] Actions : **Essayer / Autre idée / Pas aujourd’hui** sur la carte de proposition.
- [ ] **Autre idée** limité à **2/jour**, remplace le défi courant; si limite atteinte, verrouillé jusqu’à demain.
- [ ] **Pas aujourd’hui** masque la proposition jusqu’au lendemain.
- [ ] Écran « Défi en cours » avec texte, durée affichée, **J’ai terminé / J’arrête ici**.
- [ ] Si « J’arrête ici » → proposer immédiatement un nouveau défi.
- [ ] Si un défi est accepté et non terminé → il reste actif même si le jour change.

### Should Have
- [ ] Copys doux pour toutes les actions (zéro pression).
- [ ] Indicateurs d’état sur Home (ex: « en cours », « pour demain »).

### Out of Scope
- IA / recommandations avancées.
- Notifications.
- Backend / compte utilisateur.
- Analytics.

## Technical Design

### Architecture
- Ajout d’un store `challengeStore` (Zustand) pour gérer :
  - contexte du jour (humeur, énergie, micro‑blogging)
  - défi proposé du jour
  - rotations « Autre idée »
  - session de défi en cours
- Persistance locale via `@react-native-async-storage/async-storage` + `zustand/middleware` `persist`.
- Sélection de défi : une fonction pure `selectChallenge(context, challenges, exclusions)`.
- Date‑key locale `YYYY-MM-DD` pour la cadence journalière.

### Key Components
- `HomeScreen` :
  - Carte micro‑blogging (inputs 1–5 + texte)
  - Carte « Proposition douce » avec CTA
  - État « défi en cours » si accepté
- `ChallengeCard` (nouveau) : affiche suggestion + actions.
- `ChallengeInProgressScreen` (nouveau) : détail du défi + actions.

### Data Model
```ts
export type ChallengeCategory = "movement" | "rest" | "reflection" | "mental";
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  durationMin: number; // 3–10
  energy: "low" | "medium";
  prompt: string; // ton doux
}

export interface DailyContext {
  dateKey: string; // YYYY-MM-DD
  mood?: EnergyLevel; // 1–5
  energy?: EnergyLevel; // 1–5
  note?: string; // micro-blogging
  lastAcceptedAt?: string; // ISO
}

export interface ChallengeSuggestion {
  dateKey: string;
  challengeId: string;
  rotationsUsed: number; // 0..2
  skippedUntil?: string; // YYYY-MM-DD
}

export interface ChallengeSession {
  challengeId: string;
  acceptedAt: string; // ISO
  completedAt?: string; // ISO
  abandonedAt?: string; // ISO
}
```

## Implementation Plan

### Phase 1: Foundation
1. Ajouter `@react-native-async-storage/async-storage` et configurer `persist` sur le store.
2. Créer `app/data/challenges.ts` avec 20–30 défis (catégorie, durée, énergie, prompt doux).
3. Ajouter types `Challenge`, `DailyContext`, `ChallengeSuggestion`, `ChallengeSession`.
4. Implémenter `selectChallenge` (règles simples):
   - mood <= 2 → `rest | mental`, durée <= 5
   - mood >= 4 → `movement | reflection`
   - énergie <= 2 → privilégier `low`
   - inactivité > 3 jours → défi le plus simple

### Phase 2: Core Feature
1. `challengeStore`:
   - `context`, `suggestion`, `session`, `rotationsUsed`
   - `initForToday()` (reset si nouveau jour, sauf session active)
   - `submitMicroBlog({mood, energy, note})`
   - `acceptChallenge()`
   - `completeChallenge()`
   - `abandonChallenge()` (propose un nouveau défi immédiatement)
   - `rotateChallenge()` (si rotationsUsed < 2)
   - `skipToday()`
2. `HomeScreen`:
   - Carte micro‑blogging si contexte du jour non rempli
   - Carte suggestion (CTA) si pas de session active et pas de skip
   - Carte « En cours » si session active
3. Créer `ChallengeInProgressScreen` (nouvel écran + navigation)
   - Afficher durée (sans timer)
   - Actions terminer / arrêter

### Phase 3: Polish
1. Wording doux et non injonctif sur toutes les actions.
2. États vides (ex: “On se revoit demain”).
3. Ajuster layout pour cohérence visuelle avec Bloom.

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Nouveau jour mais session active | Conserver le défi en cours, ne pas proposer de nouveau défi |
| “Autre idée” au-delà de 2 | Désactiver CTA + message “demain” |
| “Pas aujourd’hui” | Masquer suggestion jusqu’à demain |
| Abandon d’un défi | Nouveau défi immédiat; rotationsUsed reste à 2 pour éviter loop |
| Contexte manquant (mood/energy) | Valeurs par défaut 3 si l’utilisateur ne saisit rien |

## Testing Strategy

- Unit tests:
  - `selectChallenge` (règles mood/energy/inactivité)
  - `initForToday` (reset / maintien session active)
  - `rotateChallenge` (limite 2)
- E2E tests:
  - Parcours “micro‑blogging → suggestion → essai → terminer”
  - “Autre idée” jusqu’à limite
  - “Pas aujourd’hui” masque suggestion
- Manual testing:
  - Changement de date
  - Sessions acceptées non terminées

## Open Questions

- [ ] Wording exact des prompts (micro‑blogging et CTAs).
- [ ] Durées exactes par défi (3/5/10 min).

## Design Decisions Log

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| 1 défi/jour persistant | Réduit la pression et évite le “scroll” des défis | Suggestions multiples par session |
| 3 CTAs (essayer/autre/pas aujourd’hui) | Sécurité psychologique et autonomie | CTA unique |
| Énergie demandée en 1–5 | Simple et empathique | Derivation automatique |
| Abandon → nouveau défi immédiat | Maintien de l’élan sans jugement | Bloquer jusqu’à demain |
