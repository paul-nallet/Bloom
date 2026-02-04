import type { Challenge, DailyContext } from "../types/challenge";
import type { ExperimentPreferences } from "../types/experiment";
import type { GoalId } from "../types/goal";
import { getGoalById } from "./goals";
import { daysSince } from "../utils/date";

export const CHALLENGES: Challenge[] = [
  {
    id: "breath-3",
    title: "Respirer doucement",
    category: "rest",
    durationMin: 3,
    energy: "low",
    prompt: "Si tu veux, on peut respirer calmement pendant 3 minutes.",
  },
  {
    id: "water-1",
    title: "Boire un verre d’eau",
    category: "rest",
    durationMin: 3,
    energy: "low",
    prompt: "Boire un verre d’eau, en prenant le temps de sentir chaque gorgée.",
  },
  {
    id: "window-2",
    title: "Regarder dehors",
    category: "rest",
    durationMin: 3,
    energy: "low",
    prompt: "Regarder dehors 2 minutes, sans objectif, juste pour te poser.",
  },
  {
    id: "stretch-3",
    title: "Étirer les épaules",
    category: "movement",
    durationMin: 3,
    energy: "low",
    prompt: "Quelques étirements doux des épaules et du cou.",
  },
  {
    id: "walk-5",
    title: "Marcher un peu",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Si tu peux, marcher 5 minutes, même dans la pièce.",
  },
  {
    id: "steps-3",
    title: "Pas lents",
    category: "movement",
    durationMin: 3,
    energy: "low",
    prompt: "Faire quelques pas lents, en sentant ton corps bouger.",
  },
  {
    id: "body-scan-4",
    title: "Scanner le corps",
    category: "mental",
    durationMin: 5,
    energy: "low",
    prompt: "Un petit scan du corps, de la tête aux pieds, en douceur.",
  },
  {
    id: "note-1",
    title: "Écrire une phrase",
    category: "reflection",
    durationMin: 3,
    energy: "low",
    prompt: "Écrire une phrase pour toi, comme un petit mot doux.",
  },
  {
    id: "gratitude-1",
    title: "Nommer une gratitude",
    category: "reflection",
    durationMin: 3,
    energy: "low",
    prompt: "Noter une seule chose qui t’a fait du bien récemment.",
  },
  {
    id: "soft-music",
    title: "Écouter un morceau calme",
    category: "rest",
    durationMin: 5,
    energy: "low",
    prompt: "Écouter un morceau calme, juste pour respirer un peu.",
  },
  {
    id: "tea-5",
    title: "Boisson chaude",
    category: "rest",
    durationMin: 5,
    energy: "low",
    prompt: "Préparer une boisson chaude et la savourer doucement.",
  },
  {
    id: "mindful-3",
    title: "Être là",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Pendant 3 minutes, juste sentir le moment présent.",
  },
  {
    id: "slow-stretch",
    title: "Étirer le dos",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Quelques étirements lents du dos, sans forcer.",
  },
  {
    id: "fresh-air",
    title: "Respirer l’air",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Ouvrir une fenêtre ou sortir 2 minutes pour respirer l’air.",
  },
  {
    id: "tiny-tidy",
    title: "Ranger un petit coin",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Ranger un tout petit coin, juste pour alléger l’espace.",
  },
  {
    id: "kind-phrase",
    title: "Phrase douce",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Se dire une phrase douce, comme on le ferait à un ami.",
  },
  {
    id: "gratitude-3",
    title: "Trois choses",
    category: "reflection",
    durationMin: 5,
    energy: "medium",
    prompt: "Noter trois petites choses positives d’aujourd’hui.",
  },
  {
    id: "mini-journal",
    title: "Mini‑journal",
    category: "reflection",
    durationMin: 5,
    energy: "medium",
    prompt: "Écrire quelques lignes libres, sans attente.",
  },
  {
    id: "slow-breath-5",
    title: "Respiration 5 min",
    category: "rest",
    durationMin: 5,
    energy: "low",
    prompt: "Respirer lentement 5 minutes, si ça te fait du bien.",
  },
  {
    id: "walk-10",
    title: "Marcher 10 min",
    category: "movement",
    durationMin: 10,
    energy: "medium",
    prompt: "Si tu as l’élan, marcher 10 minutes tranquillement.",
  },
  {
    id: "hands-2",
    title: "Sentir ses mains",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Fermer les yeux et sentir tes mains quelques instants.",
  },
  {
    id: "posture-3",
    title: "Changer de posture",
    category: "movement",
    durationMin: 3,
    energy: "low",
    prompt: "Changer de posture et trouver une position plus confortable.",
  },
  {
    id: "reflection-1",
    title: "Une pensée vraie",
    category: "reflection",
    durationMin: 3,
    energy: "low",
    prompt: "Noter une pensée vraie de ce moment, sans la juger.",
  },
  {
    id: "light-smile",
    title: "Sourire léger",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Un léger sourire, juste pour relâcher un peu.",
  },
  {
    id: "slow-shoulders",
    title: "Épaules relâchées",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Faire rouler les épaules lentement pour relâcher la tension.",
  },
  {
    id: "creative-scribble",
    title: "Gribouillage libre",
    category: "reflection",
    durationMin: 5,
    energy: "low",
    prompt: "Gribouiller des formes sans but, juste pour laisser venir.",
  },
  {
    id: "creative-idea",
    title: "Une idée folle",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Noter une idée absurde sans la juger.",
  },
  {
    id: "creative-object",
    title: "Trois usages",
    category: "reflection",
    durationMin: 5,
    energy: "medium",
    prompt: "Choisir un objet et imaginer 3 usages inattendus.",
  },
  {
    id: "calm-breath",
    title: "Respiration 4‑6",
    category: "rest",
    durationMin: 3,
    energy: "low",
    prompt: "Inspire 4, expire 6, quelques cycles tranquilles.",
  },
  {
    id: "calm-jaw",
    title: "Détendre la mâchoire",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Relâcher la mâchoire, sentir les épaules se poser.",
  },
  {
    id: "calm-light",
    title: "Lumière douce",
    category: "rest",
    durationMin: 5,
    energy: "low",
    prompt: "S’asseoir près d’une lumière douce, juste respirer.",
  },
  {
    id: "gentle-hands",
    title: "Secouer les mains",
    category: "movement",
    durationMin: 3,
    energy: "low",
    prompt: "Secouer doucement les mains pour relancer l’énergie.",
  },
  {
    id: "gentle-walk",
    title: "Marche consciente",
    category: "movement",
    durationMin: 7,
    energy: "medium",
    prompt: "Marcher lentement, en sentant chaque pas.",
  },
  {
    id: "gentle-stretch",
    title: "Étirements fluides",
    category: "movement",
    durationMin: 5,
    energy: "medium",
    prompt: "Étirements lents, sans forcer.",
  },
  {
    id: "clarity-3",
    title: "Trois priorités",
    category: "reflection",
    durationMin: 5,
    energy: "low",
    prompt: "Noter 3 choses importantes pour aujourd’hui.",
  },
  {
    id: "clarity-dump",
    title: "Vider la tête",
    category: "reflection",
    durationMin: 5,
    energy: "low",
    prompt: "Écrire tout ce qui tourne dans la tête, sans trier.",
  },
  {
    id: "clarity-true",
    title: "Ce qui compte",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Nommer une chose qui compte vraiment là, maintenant.",
  },
  {
    id: "connect-message",
    title: "Message doux",
    category: "reflection",
    durationMin: 3,
    energy: "low",
    prompt: "Envoyer un petit message bienveillant à quelqu’un.",
  },
  {
    id: "connect-memory",
    title: "Souvenir partagé",
    category: "mental",
    durationMin: 5,
    energy: "low",
    prompt: "Se remémorer un moment partagé qui fait du bien.",
  },
  {
    id: "connect-gratitude",
    title: "Merci silencieux",
    category: "mental",
    durationMin: 3,
    energy: "low",
    prompt: "Penser à quelqu’un et lui dire merci intérieurement.",
  },
];

const pickRandom = (items: Challenge[]) => {
  if (!items.length) {
    return null;
  }
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

export const getChallengeById = (id?: string) =>
  CHALLENGES.find((challenge) => challenge.id === id);

export const selectChallenge = (
  context: DailyContext,
  excludeIds: string[] = [],
  goalId?: GoalId,
  preferences?: ExperimentPreferences
) => {
  const mood = context.mood ?? 3;
  const energy = context.energy ?? 3;
  const inactiveDays = daysSince(context.lastAcceptedAt);

  const baseCandidates = CHALLENGES.filter(
    (challenge) => !excludeIds.includes(challenge.id)
  );
  let candidates = baseCandidates;
  const goal = goalId ? getGoalById(goalId) : null;

  if (goal?.categories?.length) {
    const goalCandidates = candidates.filter((challenge) =>
      goal.categories.includes(challenge.category)
    );
    if (goalCandidates.length) {
      candidates = goalCandidates;
    }
  }

  const preferenceCandidates = (() => {
    if (!preferences) {
      return candidates;
    }
    let filtered = candidates;
    if (preferences.preferredCategories?.length) {
      filtered = filtered.filter((challenge) =>
        preferences.preferredCategories?.includes(challenge.category)
      );
    }
    if (preferences.durationPreference) {
      if (preferences.durationPreference === "short") {
        filtered = filtered.filter((challenge) => challenge.durationMin <= 5);
      } else if (preferences.durationPreference === "medium") {
        filtered = filtered.filter(
          (challenge) => challenge.durationMin >= 5 && challenge.durationMin <= 7
        );
      } else if (preferences.durationPreference === "long") {
        filtered = filtered.filter((challenge) => challenge.durationMin >= 7);
      }
    }
    if (preferences.energyPreference && preferences.energyPreference !== "any") {
      filtered = filtered.filter(
        (challenge) => challenge.energy === preferences.energyPreference
      );
    }
    return filtered;
  })();

  if (preferenceCandidates.length) {
    candidates = preferenceCandidates;
  }

  const moodFiltered = (() => {
    let filtered = candidates;
    if (mood <= 2) {
      filtered = filtered.filter(
        (challenge) =>
          (challenge.category === "rest" || challenge.category === "mental") &&
          challenge.durationMin <= 5
      );
    }

    if (mood >= 4) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.category === "movement" || challenge.category === "reflection"
      );
    }

    if (energy <= 2) {
      const lowEnergy = filtered.filter((challenge) => challenge.energy === "low");
      if (lowEnergy.length) {
        filtered = lowEnergy;
      }
    }
    return filtered;
  })();

  if (moodFiltered.length) {
    candidates = moodFiltered;
  } else if (preferenceCandidates.length) {
    candidates = preferenceCandidates;
  }

  if (inactiveDays > 3) {
    const minDuration = Math.min(...candidates.map((challenge) => challenge.durationMin));
    candidates = candidates.filter((challenge) => challenge.durationMin === minDuration);
  }

  if (!candidates.length) {
    if (goal?.categories?.length) {
      const goalCandidates = baseCandidates.filter((challenge) =>
        goal.categories.includes(challenge.category)
      );
      candidates = goalCandidates.length ? goalCandidates : baseCandidates;
    } else {
      candidates = baseCandidates.length ? baseCandidates : CHALLENGES;
    }
  }

  return pickRandom(candidates) ?? CHALLENGES[0] ?? null;
};
