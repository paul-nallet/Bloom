import type { Challenge, DailyContext } from "../types/challenge";
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
  excludeIds: string[] = []
) => {
  const mood = context.mood ?? 3;
  const energy = context.energy ?? 3;
  const inactiveDays = daysSince(context.lastAcceptedAt);

  let candidates = CHALLENGES.filter((challenge) => !excludeIds.includes(challenge.id));

  if (mood <= 2) {
    candidates = candidates.filter(
      (challenge) =>
        (challenge.category === "rest" || challenge.category === "mental") &&
        challenge.durationMin <= 5
    );
  }

  if (mood >= 4) {
    candidates = candidates.filter(
      (challenge) =>
        challenge.category === "movement" || challenge.category === "reflection"
    );
  }

  if (energy <= 2) {
    const lowEnergy = candidates.filter((challenge) => challenge.energy === "low");
    if (lowEnergy.length) {
      candidates = lowEnergy;
    }
  }

  if (inactiveDays > 3) {
    const minDuration = Math.min(...candidates.map((challenge) => challenge.durationMin));
    candidates = candidates.filter((challenge) => challenge.durationMin === minDuration);
  }

  if (!candidates.length) {
    candidates = CHALLENGES.filter((challenge) => !excludeIds.includes(challenge.id));
  }

  return pickRandom(candidates) ?? CHALLENGES[0] ?? null;
};
