import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import MoodSelector from "../components/MoodSelector";
import { useRitualStore } from "../store/ritualStore";

export default function RitualScreen() {
  const note = useRitualStore((s) => s.note);
  const setNote = useRitualStore((s) => s.setNote);
  const reset = useRitualStore((s) => s.reset);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Rituel doux</Text>
        <Text className="text-base text-textSecondary">
          Choisis ce qui te parle. Rien n’est obligatoire.
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-textSecondary">Ton humeur</Text>
        <MoodSelector />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-textSecondary">Une pensée (optionnel)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Quelques mots, si tu veux."
          placeholderTextColor="#7A6C5F"
          multiline
          className="min-h-[96px] bg-surface border border-border rounded-2xl p-3 text-textPrimary"
        />
      </View>

      <Button label="Terminer doucement" onPress={reset} />
    </ScrollView>
  );
}
