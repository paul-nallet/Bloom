export type ChallengeCategory = "movement" | "rest" | "reflection" | "mental";
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  durationMin: number;
  energy: "low" | "medium";
  prompt: string;
}

export interface DailyContext {
  dateKey: string;
  mood?: EnergyLevel;
  energy?: EnergyLevel;
  note?: string;
  lastAcceptedAt?: string;
}

export interface ChallengeSuggestion {
  dateKey: string;
  challengeId: string;
  rotationsUsed: number;
  skippedUntil?: string;
}

export interface ChallengeSession {
  challengeId: string;
  acceptedAt: string;
  completedAt?: string;
  abandonedAt?: string;
  abandonReason?: string;
  abandonNote?: string;
  feedbackScore?: EnergyLevel;
  feedbackNote?: string;
  feedbackAt?: string;
}
