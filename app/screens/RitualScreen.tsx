import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import ScaleSelector from "../components/ScaleSelector";
import { getChallengeById } from "../data/challenges";
import { getGoalById } from "../data/goals";
import { useChallengeStore } from "../store/challengeStore";
import { useProfileStore } from "../store/profileStore";
import type { ChallengeCategory, EnergyLevel } from "../types/challenge";
import type { ExperimentPreferences } from "../types/experiment";
import type { RootStackParamList } from "../types/navigation";
import { getDateKey } from "../utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "Ritual">;

const categoryLabel = (value?: string) => {
  switch (value) {
    case "movement":
      return "Mouvement";
    case "rest":
      return "Repos";
    case "reflection":
      return "Réflexion";
    case "mental":
      return "Mental";
    default:
      return "";
  }
};

type Step = 1 | 2 | 3;
type ReviewMode = "none" | "adjust" | "change";

export default function RitualScreen({ navigation }: Props) {
  const initForToday = useChallengeStore((s) => s.initForToday);
  const context = useChallengeStore((s) => s.context);
  const suggestion = useChallengeStore((s) => s.suggestion);
  const submitMicroBlog = useChallengeStore((s) => s.submitMicroBlog);
  const rotateChallenge = useChallengeStore((s) => s.rotateChallenge);
  const skipToday = useChallengeStore((s) => s.skipToday);
  const acceptChallenge = useChallengeStore((s) => s.acceptChallenge);
  const experimentPreferences = useChallengeStore((s) => s.experimentPreferences);
  const experimentReview = useChallengeStore((s) => s.experimentReview);
  const setExperimentPreferences = useChallengeStore((s) => s.setExperimentPreferences);
  const resetExperimentReview = useChallengeStore((s) => s.resetExperimentReview);
  const goalId = useProfileStore((s) => s.goalId);
  const goal = getGoalById(goalId);

  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<EnergyLevel | undefined>(context?.mood);
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(context?.energy);
  const [note, setNote] = useState(context?.note ?? "");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("none");
  const [showReview, setShowReview] = useState(
    experimentReview.completedSinceReview >= 3
  );
  const [durationPreference, setDurationPreference] = useState<
    ExperimentPreferences["durationPreference"]
  >(experimentPreferences.durationPreference);
  const [energyPreference, setEnergyPreference] = useState<
    ExperimentPreferences["energyPreference"]
  >(experimentPreferences.energyPreference ?? "any");
  const [preferredCategories, setPreferredCategories] = useState<
    ChallengeCategory[] | undefined
  >(experimentPreferences.preferredCategories);
  const [reviewError, setReviewError] = useState(false);

  useEffect(() => {
    initForToday();
  }, [initForToday]);

  useEffect(() => {
    setMood(context?.mood);
    setEnergy(context?.energy);
    setNote(context?.note ?? "");
  }, [context?.dateKey]);

  useEffect(() => {
    const due = experimentReview.completedSinceReview >= 3;
    setShowReview(due);
    if (due) {
      setReviewMode("none");
      setDurationPreference(experimentPreferences.durationPreference);
      setEnergyPreference(experimentPreferences.energyPreference ?? "any");
      setPreferredCategories(experimentPreferences.preferredCategories);
      setReviewError(false);
    }
  }, [experimentReview.completedSinceReview, experimentPreferences]);

  const today = getDateKey();
  const challenge = getChallengeById(suggestion?.challengeId);
  const rotationsUsed = suggestion?.rotationsUsed ?? 0;
  const canRotate = rotationsUsed < 2;
  const availableCategories = goal?.categories ?? [];

  const handleContinue = () => {
    submitMicroBlog(mood ?? 3, energy ?? 3, note);
    setStep(2);
  };

  const handleSkip = () => {
    skipToday();
    setStep(3);
  };

  const handleTry = () => {
    acceptChallenge();
    navigation.navigate("ChallengeInProgress");
  };

  const applyReview = (nextPreferences: ExperimentPreferences) => {
    setExperimentPreferences(nextPreferences);
    resetExperimentReview();
    setShowReview(false);
    setReviewMode("none");
  };

  const handleReviewContinue = () => {
    resetExperimentReview();
    setShowReview(false);
    setReviewMode("none");
  };

  const toggleCategory = (category: ChallengeCategory) => {
    setPreferredCategories((prev) => {
      if (!prev?.length) {
        return [category];
      }
      if (prev.includes(category)) {
        const next = prev.filter((item) => item !== category);
        return next.length ? next : undefined;
      }
      return [category];
    });
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Rituel doux</Text>
        <Text className="text-base text-textSecondary">
          Choisis ce qui te parle. Rien n’est obligatoire.
        </Text>
      </View>

      {showReview ? (
        <Card title="Bilan">
          <Text className="text-sm text-textSecondary mb-3">
            Après quelques expériences, tu veux continuer pareil, ajuster, ou changer ?
          </Text>

          {reviewMode === "none" ? (
            <View className="gap-2">
              <Button label="Continuer" onPress={handleReviewContinue} />
              <Button
                label="Ajuster"
                tone="ghost"
                onPress={() => {
                  setReviewMode("adjust");
                  setReviewError(false);
                }}
              />
              <Button
                label="Changer"
                tone="ghost"
                onPress={() => {
                  setReviewMode("change");
                  setReviewError(false);
                }}
              />
            </View>
          ) : null}

          {reviewMode === "adjust" ? (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-xs text-textSecondary">Durée</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { id: "short", label: "Court" },
                    { id: "medium", label: "Moyen" },
                    { id: "long", label: "Long" },
                  ].map((item) => {
                    const isSelected = item.id === durationPreference;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() =>
                          setDurationPreference(
                            isSelected
                              ? undefined
                              : (item.id as ExperimentPreferences["durationPreference"])
                          )
                        }
                        className={`px-3 py-2 rounded-full border ${
                          isSelected ? "bg-muted border-textPrimary" : "bg-surface border-border"
                        }`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text className="text-sm text-textPrimary">{item.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-xs text-textSecondary">Énergie</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { id: "low", label: "Doux" },
                    { id: "medium", label: "Moyen" },
                    { id: "any", label: "Peu importe" },
                  ].map((item) => {
                    const isSelected = item.id === energyPreference;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() =>
                          setEnergyPreference(
                            item.id as ExperimentPreferences["energyPreference"]
                          )
                        }
                        className={`px-3 py-2 rounded-full border ${
                          isSelected ? "bg-muted border-textPrimary" : "bg-surface border-border"
                        }`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text className="text-sm text-textPrimary">{item.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-xs text-textSecondary">Catégorie</Text>
                <View className="flex-row flex-wrap gap-2">
                  {availableCategories.map((category) => {
                    const isSelected = preferredCategories?.includes(category) ?? false;
                    return (
                      <Pressable
                        key={category}
                        onPress={() => toggleCategory(category)}
                        className={`px-3 py-2 rounded-full border ${
                          isSelected ? "bg-muted border-textPrimary" : "bg-surface border-border"
                        }`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text className="text-sm text-textPrimary">
                          {categoryLabel(category)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-2">
                <Button
                  label="Valider"
                  onPress={() => {
                    applyReview({
                      preferredCategories: preferredCategories?.length
                        ? preferredCategories
                        : undefined,
                      durationPreference,
                      energyPreference: energyPreference ?? "any",
                    });
                  }}
                />
                <Button
                  label="Retour"
                  tone="ghost"
                  onPress={() => setReviewMode("none")}
                />
              </View>
            </View>
          ) : null}

          {reviewMode === "change" ? (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-xs text-textSecondary">Catégorie</Text>
                <View className="flex-row flex-wrap gap-2">
                  {availableCategories.map((category) => {
                    const isSelected = preferredCategories?.includes(category) ?? false;
                    return (
                      <Pressable
                        key={category}
                        onPress={() => {
                          toggleCategory(category);
                          setReviewError(false);
                        }}
                        className={`px-3 py-2 rounded-full border ${
                          isSelected ? "bg-muted border-textPrimary" : "bg-surface border-border"
                        }`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text className="text-sm text-textPrimary">
                          {categoryLabel(category)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              {reviewError ? (
                <Text className="text-xs text-textSecondary">
                  Choisis une catégorie pour continuer.
                </Text>
              ) : null}
              <View className="gap-2">
                <Button
                  label="Valider"
                  onPress={() => {
                    if (!preferredCategories?.length) {
                      setReviewError(true);
                      return;
                    }
                    applyReview({
                      ...experimentPreferences,
                      preferredCategories,
                    });
                  }}
                />
                <Button
                  label="Retour"
                  tone="ghost"
                  onPress={() => setReviewMode("none")}
                />
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}

      {!showReview && step === 1 ? (
        <Card title="Check‑in">
          <View className="gap-3">
            <Text className="text-sm text-textSecondary">
              Un petit instant pour toi, sans pression.
            </Text>

            <View className="gap-2">
              <Text className="text-xs text-textSecondary">Humeur</Text>
              <ScaleSelector value={mood} onChange={setMood} />
            </View>

            <View className="gap-2">
              <Text className="text-xs text-textSecondary">Énergie</Text>
              <ScaleSelector value={energy} onChange={setEnergy} />
            </View>

            <View className="gap-2">
              <Text className="text-xs text-textSecondary">Une phrase pour toi</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Quelques mots, si tu veux."
                placeholderTextColor="#7A6C5F"
                multiline
                className="min-h-[96px] bg-surface border border-border rounded-2xl p-3 text-textPrimary"
              />
            </View>

            <Button label="Continuer" onPress={handleContinue} />
          </View>
        </Card>
      ) : null}

      {!showReview && step === 2 ? (
        <Card title="Suggestion douce">
          <Text className="text-sm text-textSecondary mb-2">Si tu as quelques minutes…</Text>
          <Text className="text-base text-textPrimary mb-3">
            {challenge?.prompt ?? "Une idée douce, juste pour toi."}
          </Text>
          <Text className="text-xs text-textSecondary mb-4">
            {challenge?.durationMin ?? 5} min · {categoryLabel(challenge?.category)}
          </Text>

          <View className="gap-3">
            <Button label="Essayer" onPress={handleTry} />

            <View className="flex-row gap-2">
              <Pressable
                onPress={rotateChallenge}
                disabled={!canRotate}
                className={`flex-1 px-3 py-2 rounded-full border ${
                  canRotate ? "bg-surface border-border" : "bg-muted border-border"
                }`}
                accessibilityRole="button"
              >
                <Text className="text-sm text-textPrimary text-center">Une autre idée</Text>
              </Pressable>

              <Pressable
                onPress={handleSkip}
                className="flex-1 px-3 py-2 rounded-full border border-border"
                accessibilityRole="button"
              >
                <Text className="text-sm text-textPrimary text-center">Pas aujourd’hui</Text>
              </Pressable>
            </View>

            {!canRotate ? (
              <Text className="text-xs text-textSecondary">
                On garde celle‑ci pour aujourd’hui. On pourra changer demain.
              </Text>
            ) : null}
          </View>
        </Card>
      ) : null}

      {!showReview && step === 3 ? (
        <Card title="Merci">
          <Text className="text-sm text-textSecondary mb-4">
            Merci d’avoir pris ce moment. On se revoit demain.
          </Text>
          <Button label="Terminer" onPress={() => navigation.goBack()} />
        </Card>
      ) : null}
    </ScrollView>
  );
}
