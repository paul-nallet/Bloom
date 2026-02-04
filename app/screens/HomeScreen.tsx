import { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { getChallengeById } from "../data/challenges";
import { getGoalById } from "../data/goals";
import { useChallengeStore } from "../store/challengeStore";
import { useProfileStore } from "../store/profileStore";
import type { RootStackParamList, RootTabParamList } from "../types/navigation";
import { getDateKey } from "../utils/date";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const initForToday = useChallengeStore((s) => s.initForToday);
  const suggestion = useChallengeStore((s) => s.suggestion);
  const session = useChallengeStore((s) => s.session);
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const resetForDebug = useChallengeStore((s) => s.resetForDebug);
  const goalId = useProfileStore((s) => s.goalId);

  useEffect(() => {
    initForToday();
  }, [initForToday]);

  const today = getDateKey();
  const hasActiveSession = !!session && !session.completedAt && !session.abandonedAt;
  const completedToday =
    !!session?.completedAt && getDateKey(new Date(session.completedAt)) === today;
  const skippedToday = suggestion?.skippedUntil === today;
  const activeChallenge = getChallengeById(session?.challengeId);
  const suggestedChallenge = getChallengeById(suggestion?.challengeId);
  const goal = getGoalById(goalId);

  const hasSuggestion =
    !!suggestion && suggestion.dateKey === today && suggestion.skippedUntil !== today;
  const experienceTitle = hasActiveSession
    ? activeChallenge?.title ?? "À choisir"
    : hasSuggestion
    ? suggestedChallenge?.title ?? "À choisir"
    : "À choisir";

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-6">
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-xs text-textSecondary">Objectif</Text>
          <Text className="text-2xl text-textPrimary">{goal?.title ?? "À choisir"}</Text>
        </View>
        <View className="gap-1">
          <Text className="text-xs text-textSecondary">Expérience du jour</Text>
          <Text className="text-base text-textPrimary">{experienceTitle}</Text>
        </View>
      </View>

      {hasActiveSession ? (
        <Card title="Défi en cours">
          <Text className="text-sm text-textSecondary mb-2">
            {activeChallenge?.title ?? "Ton défi du moment"}
          </Text>
          {activeChallenge?.prompt ? (
            <Text className="text-sm text-textSecondary mb-3">{activeChallenge.prompt}</Text>
          ) : (
            <Text className="text-sm text-textSecondary mb-3">
              Tu peux reprendre quand tu veux.
            </Text>
          )}
          <View className="gap-2">
            <Button
              label="Continuer"
              onPress={() => navigation.navigate("ChallengeInProgress")}
            />
            <Button
              label="Défi réalisé"
              tone="ghost"
              onPress={() => {
                completeChallenge();
                navigation.navigate("ChallengeFeedback");
              }}
            />
          </View>
        </Card>
      ) : completedToday || skippedToday ? (
        <Card title="À demain">
          <Text className="text-sm text-textSecondary">
            C’est fait pour aujourd’hui. On se retrouve demain.
          </Text>
        </Card>
      ) : hasSuggestion ? (
        <Card title="Suggestion du jour">
          <Text className="text-sm text-textSecondary mb-2">
            {suggestedChallenge?.title ?? "Une expérience douce"}
          </Text>
          <Text className="text-xs text-textSecondary mb-4">
            {suggestedChallenge?.durationMin ?? 5} min
          </Text>
          <Button label="Reprendre le rituel" onPress={() => navigation.navigate("Ritual")} />
        </Card>
      ) : (
        <Card title="Ton moment du jour">
          <Text className="text-sm text-textSecondary mb-4">
            Si tu veux, on peut commencer doucement.
          </Text>
          <Button label="Commencer mon rituel" onPress={() => navigation.navigate("Ritual")} />
        </Card>
      )}

      {__DEV__ ? (
        <Pressable
          onPress={resetForDebug}
          className="self-center mt-4"
          accessibilityRole="button"
        >
          <Text className="text-xs text-textSecondary">Réinitialiser aujourd’hui (debug)</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
