import type { Goal, GoalId } from "../types/goal";

export const GOALS: Goal[] = [
  {
    id: "creativity",
    title: "Être plus créatif",
    categories: ["reflection", "mental"],
  },
  {
    id: "calm",
    title: "Trouver du calme",
    categories: ["rest", "mental"],
  },
  {
    id: "gentle-energy",
    title: "Énergie douce",
    categories: ["movement", "rest"],
  },
  {
    id: "clarity",
    title: "Gagner en clarté",
    categories: ["reflection", "mental"],
  },
  {
    id: "connection",
    title: "Se sentir connecté",
    categories: ["reflection", "mental"],
  },
];

export const DEFAULT_GOAL_ID: GoalId = GOALS[0]?.id ?? "creativity";

export const getGoalById = (id?: GoalId | null) =>
  GOALS.find((goal) => goal.id === id);
