import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import ScaleSelector from "../components/ScaleSelector";
import { getChallengeById } from "../data/challenges";
import { useChallengeStore } from "../store/challengeStore";
import type { EnergyLevel } from "../types/challenge";
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

export default function RitualScreen({ navigation }: Props) {
  const initForToday = useChallengeStore((s) => s.initForToday);
  const context = useChallengeStore((s) => s.context);
  const suggestion = useChallengeStore((s) => s.suggestion);
  const submitMicroBlog = useChallengeStore((s) => s.submitMicroBlog);
  const rotateChallenge = useChallengeStore((s) => s.rotateChallenge);
  const skipToday = useChallengeStore((s) => s.skipToday);
  const acceptChallenge = useChallengeStore((s) => s.acceptChallenge);

  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<EnergyLevel | undefined>(context?.mood);
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(context?.energy);
  const [note, setNote] = useState(context?.note ?? "");

  useEffect(() => {
    initForToday();
  }, [initForToday]);

  useEffect(() => {
    setMood(context?.mood);
    setEnergy(context?.energy);
    setNote(context?.note ?? "");
  }, [context?.dateKey]);

  const today = getDateKey();
  const challenge = getChallengeById(suggestion?.challengeId);
  const rotationsUsed = suggestion?.rotationsUsed ?? 0;
  const canRotate = rotationsUsed < 2;

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

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Rituel doux</Text>
        <Text className="text-base text-textSecondary">
          Choisis ce qui te parle. Rien n’est obligatoire.
        </Text>
      </View>

      {step === 1 ? (
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

      {step === 2 ? (
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

      {step === 3 ? (
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
