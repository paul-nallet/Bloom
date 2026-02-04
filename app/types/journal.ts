import type { EnergyLevel } from "./challenge";

export type JournalSource = "manual" | "feedback" | "abandon";

export interface JournalEntry {
  id: string;
  title?: string;
  text: string;
  createdAt: string;
  source: JournalSource;
  feedbackScore?: EnergyLevel;
  abandonReason?: string;
}
