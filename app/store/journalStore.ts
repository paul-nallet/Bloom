import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { EnergyLevel } from "../types/challenge";
import type { JournalEntry } from "../types/journal";

interface JournalState {
  entries: JournalEntry[];
  addEntry: (input: { title?: string; text: string; source?: "manual" | "feedback" }) => void;
  addEntryFromFeedback: (input: {
    challengeTitle?: string;
    score?: EnergyLevel;
    note?: string;
  }) => void;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: ({ title, text, source = "manual" }) => {
        const trimmed = text.trim();
        if (!trimmed) {
          return;
        }
        const entry: JournalEntry = {
          id: createId(),
          title: title?.trim() || undefined,
          text: trimmed,
          createdAt: new Date().toISOString(),
          source,
        };
        set((state) => ({ entries: [entry, ...state.entries] }));
      },
      addEntryFromFeedback: ({ challengeTitle, score, note }) => {
        const trimmed = note?.trim();
        if (!trimmed && score === undefined) {
          return;
        }
        const lines: string[] = [];
        if (score !== undefined) {
          lines.push(`Ressenti : ${score}/5`);
        }
        if (trimmed) {
          lines.push(trimmed);
        }
        const entry: JournalEntry = {
          id: createId(),
          title: challengeTitle || "Défi du jour",
          text: lines.join("\n"),
          createdAt: new Date().toISOString(),
          source: "feedback",
          feedbackScore: score,
        };
        set((state) => ({ entries: [entry, ...state.entries] }));
      },
    }),
    {
      name: "bloom-journal",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
