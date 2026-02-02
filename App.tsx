import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import colors from "./app/theme/colors";
import HomeScreen from "./app/screens/HomeScreen";
import JournalScreen from "./app/screens/JournalScreen";
import RitualScreen from "./app/screens/RitualScreen";
import OnboardingScreen from "./app/screens/OnboardingScreen";
import type { RootStackParamList } from "./app/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Bloom" }} />
        <Stack.Screen name="Ritual" component={RitualScreen} options={{ title: "Rituel" }} />
        <Stack.Screen name="Journal" component={JournalScreen} options={{ title: "Journal" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
