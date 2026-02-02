import { Pressable, Text, View } from "react-native";
import type { EnergyLevel } from "../types/challenge";

const LEVELS: EnergyLevel[] = [1, 2, 3, 4, 5];

interface ScaleSelectorProps {
  value?: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
}

export default function ScaleSelector({ value, onChange }: ScaleSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {LEVELS.map((level) => {
        const selected = value === level;
        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            className={`px-3 py-2 rounded-full border ${
              selected ? "bg-muted border-accent" : "bg-surface border-border"
            }`}
            accessibilityRole="button"
          >
            <Text className="text-sm text-textPrimary">{level}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
