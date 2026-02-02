import { Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  tone?: "primary" | "ghost";
}

export default function Button({ label, onPress, tone = "primary" }: ButtonProps) {
  const base = "px-4 py-3 rounded-full";
  const tones = {
    primary: "bg-accent",
    ghost: "bg-transparent border border-border",
  };

  return (
    <Pressable
      onPress={onPress}
      className={`${base} ${tones[tone]} active:opacity-80`}
      accessibilityRole="button"
    >
      <Text className="text-base text-textPrimary text-center">{label}</Text>
    </Pressable>
  );
}
