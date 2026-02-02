import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">

      <View className="gap-2">
        <Text className="text-2xl text-textPrimary">Bloom</Text>
        <Text className="text-base text-textSecondary">
          Un rituel doux, 10 minutes maximum. Rien d’obligatoire.
        </Text>
      </View>

      <Card title="Aujourd’hui">
        <Text className="text-sm text-textSecondary mb-4">
          Comment te sens-tu en ce moment ?
        </Text>
        <Button label="Commencer le rituel" onPress={() => navigation.navigate("Ritual")} />
      </Card>

      <Card title="Journal">
        <Text className="text-sm text-textSecondary mb-4">
          Quelques lignes, si tu en as envie.
        </Text>
        <Button label="Ouvrir le journal" tone="ghost" onPress={() => navigation.navigate("Journal")} />
      </Card>
    </ScrollView>
  );
}
