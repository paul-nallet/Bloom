import { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { useChallengeStore } from "../store/challengeStore";
import { useJournalStore } from "../store/journalStore";
import { useProfileStore } from "../store/profileStore";
import type { RootStackParamList, RootTabParamList } from "../types/navigation";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Reset">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ResetScreen({ navigation }: Props) {
  const resetChallenges = useChallengeStore((s) => s.resetForDebug);
  const resetJournal = useJournalStore((s) => s.resetJournal);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    resetChallenges();
    resetJournal();
    resetProfile();
    setConfirming(false);
    navigation.replace("Onboarding");
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Réinitialiser</Text>
        <Text className="text-base text-textSecondary">
          Remettre l’app à zéro pour retester les flows.
        </Text>
      </View>

      <Card title="Tout effacer">
        <Text className="text-sm text-textSecondary mb-3">
          Objectif, défis, journal et préférences seront réinitialisés.
        </Text>
        {!confirming ? (
          <Button label="Réinitialiser maintenant" onPress={() => setConfirming(true)} />
        ) : (
          <View className="gap-2">
            <Pressable
              onPress={handleReset}
              className="px-4 py-3 rounded-full bg-accent"
              accessibilityRole="button"
            >
              <Text className="text-base text-textPrimary text-center">
                Oui, tout réinitialiser
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setConfirming(false)}
              className="px-4 py-3 rounded-full border border-border"
              accessibilityRole="button"
            >
              <Text className="text-base text-textPrimary text-center">Annuler</Text>
            </Pressable>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}
