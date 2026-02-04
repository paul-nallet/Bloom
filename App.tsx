import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Flower, RotateCcw, Sprout } from "lucide-react-native";
import colors from "./app/theme/colors";
import HomeScreen from "./app/screens/HomeScreen";
import JournalScreen from "./app/screens/JournalScreen";
import RitualScreen from "./app/screens/RitualScreen";
import OnboardingScreen from "./app/screens/OnboardingScreen";
import ChallengeInProgressScreen from "./app/screens/ChallengeInProgressScreen";
import ChallengeFeedbackScreen from "./app/screens/ChallengeFeedbackScreen";
import ResetScreen from "./app/screens/ResetScreen";
import type { RootStackParamList, RootTabParamList } from "./app/types/navigation";
import { useProfileStore } from "./app/store/profileStore";
import { View } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.textPrimary },
        tabBarStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Bloom",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Flower color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Sprout color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
      <Tab.Screen
        name="Reset"
        component={ResetScreen}
        options={{
          title: "Reset",
          tabBarLabel: "Reset",
          tabBarIcon: ({ color, size }) => (
            <RotateCcw color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const hasOnboarded = useProfileStore((s) => s.hasOnboarded);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={hasOnboarded ? "RootTabs" : "Onboarding"}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!hasOnboarded ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : null}
        <Stack.Screen name="RootTabs" component={RootTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Ritual" component={RitualScreen} options={{ title: "Rituel" }} />
        <Stack.Screen
          name="ChallengeInProgress"
          component={ChallengeInProgressScreen}
          options={{ title: "Défi doux" }}
        />
        <Stack.Screen
          name="ChallengeFeedback"
          component={ChallengeFeedbackScreen}
          options={{ title: "Ton ressenti" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
