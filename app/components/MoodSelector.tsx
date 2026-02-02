import { Pressable, Text, View } from "react-native";
import { useRitualStore } from "../store/ritualStore";
import type { Mood } from "../types/mood";

const MOODS: { key: Mood; label: string }[] = [
  { key: "calm", label: "Calme" },
  { key: "soft", label: "Doux" },
  { key: "tired", label: "Fatigué" },
  { key: "foggy", label: "Brumeux" },
  { key: "grounded", label: "Ancré" },
];

export default function MoodSelector() {
  const mood = useRitualStore((s) => s.mood);
  const setMood = useRitualStore((s) => s.setMood);

  return (
    <View className="flex-row flex-wrap gap-2">
      {MOODS.map((item) => {
        const selected = mood === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => setMood(item.key)}
            className={`px-3 py-2 rounded-full border ${
              selected ? "bg-muted border-accent" : "bg-surface border-border"
            }`}
          >
            <Text className="text-sm text-textPrimary">{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
