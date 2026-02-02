import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { getChallengeById } from "../data/challenges";
import { useChallengeStore } from "../store/challengeStore";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ChallengeInProgress">;

export default function ChallengeInProgressScreen({ navigation }: Props) {
  const session = useChallengeStore((s) => s.session);
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const abandonChallenge = useChallengeStore((s) => s.abandonChallenge);

  const challenge = getChallengeById(session?.challengeId);

  if (!session || !challenge) {
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
            abandonChallenge();
            navigation.replace("RootTabs");
          }}
        />
      </View>
    </ScrollView>
  );
}
