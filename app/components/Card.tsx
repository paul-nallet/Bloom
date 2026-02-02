import { ReactNode } from "react";
import { Text, View } from "react-native";

interface CardProps {
  title?: string;
  children?: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-4">
      {title ? (
        <Text className="text-base text-textPrimary mb-2">{title}</Text>
      ) : null}
      {children}
    </View>
  );
}
