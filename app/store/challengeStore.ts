import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { selectChallenge } from "../data/challenges";
import { useProfileStore } from "./profileStore";
import type {
  ChallengeSession,
  ChallengeSuggestion,
  DailyContext,
  EnergyLevel,
} from "../types/challenge";
import type { ExperimentPreferences, ExperimentReview } from "../types/experiment";
import { getDateKey } from "../utils/date";

interface ChallengeState {
  context: DailyContext;
  suggestion: ChallengeSuggestion | null;
  session: ChallengeSession | null;
  rotationHistory: string[];
  experimentPreferences: ExperimentPreferences;
  experimentReview: ExperimentReview;
  initForToday: () => void;
  submitMicroBlog: (mood: EnergyLevel, energy: EnergyLevel, note: string) => void;
  acceptChallenge: () => void;
  rotateChallenge: () => void;
  skipToday: () => void;
  completeChallenge: () => void;
  abandonChallenge: (reason: string, note?: string) => void;
  saveFeedback: (score?: EnergyLevel, note?: string) => void;
  setExperimentPreferences: (input: ExperimentPreferences) => void;
  resetExperimentReview: () => void;
  resetForDebug: () => void;
}

const createContext = (prev?: DailyContext): DailyContext => ({
  dateKey: getDateKey(),
  mood: undefined,
  energy: undefined,
  note: "",
  lastAcceptedAt: prev?.lastAcceptedAt,
});

const hasActiveSession = (session: ChallengeSession | null) =>
  !!session && !session.completedAt && !session.abandonedAt;

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      context: createContext(),
      suggestion: null,
      session: null,
      rotationHistory: [],
      experimentPreferences: {
        energyPreference: "any",
      },
      experimentReview: {
        completedSinceReview: 0,
      },
      initForToday: () => {
        const today = getDateKey();
        set((state) => {
          const stillActive = hasActiveSession(state.session);
          const previousDateKey = state.context?.dateKey;
          const context =
            previousDateKey === today ? state.context : createContext(state.context);
          let suggestion = state.suggestion;
          let rotationHistory = state.rotationHistory;
          let session = state.session;

          if (
            !stillActive &&
            (session?.completedAt || session?.abandonedAt) &&
            previousDateKey !== today
          ) {
            session = null;
          }

          if (!stillActive && previousDateKey !== today) {
            suggestion = null;
            rotationHistory = [];
          }

          return { context, suggestion, rotationHistory, session };
        });
      },
      submitMicroBlog: (mood, energy, note) => {
        const today = getDateKey();
        set((state) => {
          const stillActive = hasActiveSession(state.session);
          const base =
            state.context?.dateKey === today ? state.context : createContext(state.context);
          const context: DailyContext = { ...base, mood, energy, note };
          let suggestion = state.suggestion;
          let rotationHistory = state.rotationHistory;
          const goalId = useProfileStore.getState().goalId;
          const preferences = state.experimentPreferences;

          if (!stillActive && (!suggestion || suggestion.dateKey !== today)) {
            const next = selectChallenge(context, [], goalId, preferences);
            suggestion = next
              ? { dateKey: today, challengeId: next.id, rotationsUsed: 0 }
              : null;
            rotationHistory = suggestion ? [suggestion.challengeId] : [];
          }

          return { context, suggestion, rotationHistory };
        });
      },
      acceptChallenge: () => {
        const now = new Date().toISOString();
        set((state) => {
          if (!state.suggestion) {
            return state;
          }
          if (state.suggestion.skippedUntil === getDateKey()) {
            return state;
          }
          const session: ChallengeSession = {
            challengeId: state.suggestion.challengeId,
            acceptedAt: now,
          };
          return {
            session,
            context: { ...state.context, lastAcceptedAt: now },
          };
        });
      },
      rotateChallenge: () => {
        const today = getDateKey();
        set((state) => {
          if (!state.suggestion || state.suggestion.dateKey !== today) {
            return state;
          }
          if (state.suggestion.rotationsUsed >= 2) {
            return state;
          }
          const goalId = useProfileStore.getState().goalId;
          const preferences = state.experimentPreferences;
          const excluded = [state.suggestion.challengeId, ...state.rotationHistory];
          const next = selectChallenge(state.context, excluded, goalId, preferences);
          if (!next) {
            return state;
          }
          const suggestion: ChallengeSuggestion = {
            ...state.suggestion,
            challengeId: next.id,
            rotationsUsed: state.suggestion.rotationsUsed + 1,
          };
          const rotationHistory = [...state.rotationHistory, next.id];
          return { suggestion, rotationHistory };
        });
      },
      skipToday: () => {
        const today = getDateKey();
        set((state) => {
          const goalId = useProfileStore.getState().goalId;
          const preferences = state.experimentPreferences;
          if (!state.suggestion || state.suggestion.dateKey !== today) {
            const next = selectChallenge(state.context, [], goalId, preferences);
            if (!next) {
              return state;
            }
            return {
              suggestion: {
                dateKey: today,
                challengeId: next.id,
                rotationsUsed: 0,
                skippedUntil: today,
              },
              rotationHistory: [next.id],
            };
          }
          return {
            suggestion: { ...state.suggestion, skippedUntil: today },
          };
        });
      },
      completeChallenge: () => {
        const now = new Date().toISOString();
        set((state) => {
          if (!state.session || state.session.completedAt) {
            return state;
          }
          return {
            session: { ...state.session, completedAt: now },
            experimentReview: {
              ...state.experimentReview,
              completedSinceReview: state.experimentReview.completedSinceReview + 1,
            },
          };
        });
      },
      saveFeedback: (score, note) => {
        const now = new Date().toISOString();
        set((state) => {
          if (!state.session || state.session.abandonedAt) {
            return state;
          }
          return {
            session: {
              ...state.session,
              feedbackScore: score,
              feedbackNote: note,
              feedbackAt: now,
            },
          };
        });
      },
      abandonChallenge: (reason, note) => {
        const today = getDateKey();
        set((state) => {
          if (!state.session || state.session.abandonedAt) {
            return state;
          }
          const trimmedReason = reason.trim();
          if (!trimmedReason) {
            return state;
          }
          const goalId = useProfileStore.getState().goalId;
          const preferences = state.experimentPreferences;
          const excluded = [
            state.suggestion?.challengeId,
            ...state.rotationHistory,
          ].filter(Boolean) as string[];
          const next = selectChallenge(state.context, excluded, goalId, preferences);
          const suggestion = next
            ? { dateKey: today, challengeId: next.id, rotationsUsed: 2 }
            : null;
          const rotationHistory = next
            ? [...state.rotationHistory, next.id]
            : state.rotationHistory;
          return {
            session: {
              ...state.session,
              abandonedAt: new Date().toISOString(),
              abandonReason: trimmedReason,
              abandonNote: note?.trim() || undefined,
            },
            suggestion,
            rotationHistory,
            experimentReview: {
              ...state.experimentReview,
              completedSinceReview: state.experimentReview.completedSinceReview + 1,
            },
          };
        });
      },
      setExperimentPreferences: (input) => {
        set(() => ({
          experimentPreferences: input,
        }));
      },
      resetExperimentReview: () => {
        set(() => ({
          experimentReview: {
            completedSinceReview: 0,
            lastReviewAt: new Date().toISOString(),
          },
        }));
      },
      resetForDebug: () => {
        set(() => ({
          context: createContext(),
          suggestion: null,
          session: null,
          rotationHistory: [],
          experimentPreferences: { energyPreference: "any" },
          experimentReview: { completedSinceReview: 0 },
        }));
      },
    }),
    {
      name: "bloom-challenges",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
