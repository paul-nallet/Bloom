import { create } from "zustand";
import type { Mood } from "../types/mood";

interface RitualState {
  mood: Mood | null;
  note: string;
  setMood: (mood: Mood) => void;
  setNote: (note: string) => void;
  reset: () => void;
}

export const useRitualStore = create<RitualState>((set) => ({
  mood: null,
  note: "",
  setMood: (mood) => set({ mood }),
  setNote: (note) => set({ note }),
  reset: () => set({ mood: null, note: "" }),
}));
