import { ScrollView, Text, View } from "react-native";
import Card from "../components/Card";

export default function JournalScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Journal</Text>
        <Text className="text-base text-textSecondary">
          Un espace calme pour déposer ce qui vient.
        </Text>
      </View>

      <Card title="Aujourd’hui">
        <Text className="text-sm text-textSecondary">
          Ce journal est privé. Rien n’est obligatoire.
        </Text>
      </Card>

      <Card title="Souvenir doux">
        <Text className="text-sm text-textSecondary">
          Tu peux revenir ici quand tu veux.
        </Text>
      </Card>
    </ScrollView>
  );
}
