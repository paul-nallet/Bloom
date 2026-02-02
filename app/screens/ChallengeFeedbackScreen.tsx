import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import ScaleSelector from "../components/ScaleSelector";
import { useChallengeStore } from "../store/challengeStore";
import type { EnergyLevel } from "../types/challenge";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ChallengeFeedback">;

export default function ChallengeFeedbackScreen({ navigation }: Props) {
  const session = useChallengeStore((s) => s.session);
  const saveFeedback = useChallengeStore((s) => s.saveFeedback);

  const [score, setScore] = useState<EnergyLevel | undefined>(session?.feedbackScore);
  const [note, setNote] = useState(session?.feedbackNote ?? "");

  if (!session) {
    return (
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
        <Text className="text-base text-textSecondary">Rien à enregistrer pour le moment.</Text>
        <Button label="Retour" onPress={() => navigation.replace("RootTabs")} />
      </ScrollView>
    );
  }

  const handleSave = () => {
    saveFeedback(score, note);
    navigation.replace("RootTabs");
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Comment tu te sens maintenant ?</Text>
        <Text className="text-base text-textSecondary">
          Tu peux écrire une phrase si tu veux.
        </Text>
      </View>

      <Card title="Ressenti">
        <ScaleSelector value={score} onChange={setScore} />
      </Card>

      <Card title="Une phrase (optionnel)">
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Quelques mots, si tu veux."
          placeholderTextColor="#7A6C5F"
          multiline
          className="min-h-[96px] bg-surface border border-border rounded-2xl p-3 text-textPrimary"
        />
      </Card>

      <View className="gap-2">
        <Button label="Enregistrer" onPress={handleSave} />
        <Button label="Passer" tone="ghost" onPress={() => navigation.replace("RootTabs")} />
      </View>
    </ScrollView>
  );
}
