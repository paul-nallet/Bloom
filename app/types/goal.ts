import type { ChallengeCategory } from "./challenge";

export type GoalId =
  | "creativity"
  | "calm"
  | "gentle-energy"
  | "clarity"
  | "connection";

export interface Goal {
  id: GoalId;
  title: string;
  categories: ChallengeCategory[];
}
