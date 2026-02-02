import { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { getDailyPhrase } from "../data/dailyPhrases";
import { getChallengeById } from "../data/challenges";
import { useChallengeStore } from "../store/challengeStore";
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
  const abandonChallenge = useChallengeStore((s) => s.abandonChallenge);
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const resetForDebug = useChallengeStore((s) => s.resetForDebug);

  useEffect(() => {
    initForToday();
  }, [initForToday]);

  const today = getDateKey();
  const hasActiveSession = !!session && !session.completedAt && !session.abandonedAt;
  const completedToday =
    !!session?.completedAt && getDateKey(new Date(session.completedAt)) === today;
  const skippedToday = suggestion?.skippedUntil === today;
  const activeChallenge = getChallengeById(session?.challengeId);

  const showRitualCard = !hasActiveSession && !completedToday && !skippedToday;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-6">
      <View className="gap-2">
        <Text className="text-2xl text-textPrimary">Bloom</Text>
        <Text className="text-base text-textSecondary">{getDailyPhrase()}</Text>
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
              label="Défi réalisé"
              onPress={() => {
                completeChallenge();
                navigation.navigate("ChallengeFeedback");
              }}
            />
            <Button
              label="Continuer"
              tone="ghost"
              onPress={() => navigation.navigate("ChallengeInProgress")}
            />
          </View>
          <Pressable
            onPress={() => {
              abandonChallenge();
            }}
            className="mt-3"
            accessibilityRole="button"
          >
            <Text className="text-sm text-textSecondary text-center">Arrêter ici</Text>
          </Pressable>
        </Card>
      ) : null}

      {showRitualCard ? (
        <Card title="Ton moment du jour">
          <Text className="text-sm text-textSecondary mb-4">
            Si tu veux, on peut commencer doucement.
          </Text>
          <Button label="Commencer mon rituel" onPress={() => navigation.navigate("Ritual")} />
        </Card>
      ) : null}

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
