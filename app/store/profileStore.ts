import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GoalId } from "../types/goal";

interface ProfileState {
  goalId?: GoalId;
  hasOnboarded: boolean;
  hasHydrated: boolean;
  setGoal: (goalId: GoalId) => void;
  completeOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      goalId: undefined,
      hasOnboarded: false,
      hasHydrated: false,
      setGoal: (goalId) => set({ goalId }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      resetProfile: () =>
        set((state) => ({
          goalId: undefined,
          hasOnboarded: false,
          hasHydrated: state.hasHydrated,
        })),
    }),
    {
      name: "bloom-profile",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
