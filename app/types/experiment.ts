import type { ChallengeCategory } from "./challenge";

export interface ExperimentPreferences {
  preferredCategories?: ChallengeCategory[];
  durationPreference?: "short" | "medium" | "long";
  energyPreference?: "low" | "medium" | "any";
}

export interface ExperimentReview {
  completedSinceReview: number;
  lastReviewAt?: string;
}
