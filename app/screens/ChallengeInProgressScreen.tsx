import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { getChallengeById } from "../data/challenges";
import { useChallengeStore } from "../store/challengeStore";
import { useJournalStore } from "../store/journalStore";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ChallengeInProgress">;

export default function ChallengeInProgressScreen({ navigation }: Props) {
  const session = useChallengeStore((s) => s.session);
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const abandonChallenge = useChallengeStore((s) => s.abandonChallenge);
  const addEntryFromAbandon = useJournalStore((s) => s.addEntryFromAbandon);

  const [showAbandon, setShowAbandon] = useState(false);
  const [abandonReason, setAbandonReason] = useState<string | null>(null);
  const [abandonNote, setAbandonNote] = useState("");
  const [showReasonError, setShowReasonError] = useState(false);

  const challenge = getChallengeById(session?.challengeId);
  const reasonOptions = [
    "Pas le bon moment",
    "Trop long",
    "Pas pour moi",
    "Pas assez clair",
  ];

  const handleConfirmAbandon = () => {
    if (!abandonReason) {
      setShowReasonError(true);
      return;
    }
    addEntryFromAbandon({
      challengeTitle: challenge?.title,
      reason: abandonReason,
      note: abandonNote,
    });
    abandonChallenge(abandonReason, abandonNote);
    navigation.replace("RootTabs");
  };

  if (!session || session.abandonedAt || !challenge) {
    return (
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5">
        <Text className="text-base text-textSecondary">Rien en cours pour le moment.</Text>
        <View className="mt-4">
          <Button label="Retour à l’accueil" onPress={() => navigation.replace("RootTabs")} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">{challenge.title}</Text>
        <Text className="text-base text-textSecondary">{challenge.prompt}</Text>
      </View>

      <Card title="Durée">
        <Text className="text-sm text-textSecondary">{challenge.durationMin} minutes.</Text>
      </Card>

      <Card title="Tout va bien">
        <Text className="text-sm text-textSecondary">
          Tu peux avancer à ton rythme, sans pression.
        </Text>
      </Card>

      <View className="gap-2">
        <Button
          label="J’ai terminé"
          onPress={() => {
            completeChallenge();
            navigation.navigate("ChallengeFeedback");
          }}
        />
        <Button
          label="J’arrête ici"
          tone="ghost"
          onPress={() => {
            setShowAbandon((prev) => !prev);
            setShowReasonError(false);
          }}
        />
      </View>

      {showAbandon ? (
        <Card title="Pourquoi tu arrêtes ?">
          <Text className="text-sm text-textSecondary mb-3">
            C’est ok. Une raison suffit.
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {reasonOptions.map((reason) => {
              const isSelected = reason === abandonReason;
              return (
                <Pressable
                  key={reason}
                  onPress={() => {
                    setAbandonReason(isSelected ? null : reason);
                    setShowReasonError(false);
                  }}
                  className={`px-3 py-2 rounded-full border ${
                    isSelected ? "bg-muted border-textPrimary" : "bg-surface border-border"
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text className="text-sm text-textPrimary">{reason}</Text>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            value={abandonNote}
            onChangeText={setAbandonNote}
            placeholder="Un mot en plus (optionnel)"
            placeholderTextColor="#7A6C5F"
            multiline
            className="min-h-[84px] bg-surface border border-border rounded-2xl p-3 text-textPrimary"
          />
          {showReasonError ? (
            <Text className="text-xs text-textSecondary mt-2">
              Choisis une raison pour continuer.
            </Text>
          ) : null}
          <View className="gap-2 mt-3">
            <Pressable
              onPress={handleConfirmAbandon}
              className="px-4 py-3 rounded-full bg-accent"
              accessibilityRole="button"
            >
              <Text className="text-base text-textPrimary text-center">Confirmer</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowAbandon(false);
                setShowReasonError(false);
              }}
              className="px-4 py-3 rounded-full border border-border"
              accessibilityRole="button"
            >
              <Text className="text-base text-textPrimary text-center">Annuler</Text>
            </Pressable>
          </View>
        </Card>
      ) : null}
    </ScrollView>
  );
}
