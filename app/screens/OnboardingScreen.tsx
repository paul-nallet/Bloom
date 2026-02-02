import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Button from "../components/Button";
import colors from "../theme/colors";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const PAGES = [
  {
    title: "Bienvenue dans Bloom",
    subtitle: "Un rituel doux, 10 minutes maximum. Rien d’obligatoire.",
  },
  {
    title: "Écouter ton humeur",
    subtitle: "Choisis ce qui te parle, à ton rythme.",
  },
  {
    title: "Déposer quelques mots",
    subtitle: "Un journal calme pour revenir quand tu veux.",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<any>(null);
  const [index, setIndex] = useState(0);

  const scrollX = useSharedValue(0);
  const pageWidth = useSharedValue(width);
  const drift = useSharedValue(0);
  const spinOne = useSharedValue(0);
  const spinTwo = useSharedValue(0);
  const spinThree = useSharedValue(0);

  useEffect(() => {
    pageWidth.value = width;
  }, [width, pageWidth]);

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 6000 }), -1, true);
  }, [drift]);

  useEffect(() => {
    spinOne.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );
    spinTwo.value = withRepeat(
      withTiming(-360, { duration: 22000, easing: Easing.linear }),
      -1,
      false
    );
    spinThree.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, [spinOne, spinTwo, spinThree]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const circleOneAnim = useAnimatedStyle(() => {
    const pw = pageWidth.value || 1;
    const base = interpolate(
      scrollX.value,
      [0, pw, pw * 2],
      [-18, 26, -12],
      Extrapolate.CLAMP
    );
    const phase = (scrollX.value / pw) * Math.PI + 0.6;
    const wobble = Math.sin(phase) * 9;
    const driftPhase = drift.value * Math.PI * 2;
    const translateX = Math.sin(phase) * 24 + Math.sin(driftPhase) * 6;
    const translateY = Math.cos(phase) * 18 + Math.cos(driftPhase) * 6;
    const scale = 1 + Math.sin(phase) * 0.1 + Math.sin(driftPhase) * 0.03;
    const rotate = base + wobble + spinOne.value;
    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const circleTwoAnim = useAnimatedStyle(() => {
    const pw = pageWidth.value || 1;
    const base = interpolate(
      scrollX.value,
      [0, pw, pw * 2],
      [22, -18, 32],
      Extrapolate.CLAMP
    );
    const phase = (scrollX.value / pw) * Math.PI + 1.7;
    const wobble = Math.sin(phase) * 8;
    const driftPhase = drift.value * Math.PI * 2 + 1.2;
    const translateX = Math.cos(phase) * -26 + Math.sin(driftPhase) * 7;
    const translateY = Math.sin(phase) * 20 + Math.cos(driftPhase) * 6;
    const scale = 1 + Math.cos(phase) * 0.11 + Math.sin(driftPhase) * 0.03;
    const rotate = base + wobble + spinTwo.value + 35;
    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const circleThreeAnim = useAnimatedStyle(() => {
    const pw = pageWidth.value || 1;
    const base = interpolate(
      scrollX.value,
      [0, pw, pw * 2],
      [-14, 18, -28],
      Extrapolate.CLAMP
    );
    const phase = (scrollX.value / pw) * Math.PI + 2.6;
    const wobble = Math.sin(phase) * 10;
    const driftPhase = drift.value * Math.PI * 2 + 2.4;
    const translateX = Math.sin(phase) * 22 + Math.sin(driftPhase) * 6;
    const translateY = Math.cos(phase) * -24 + Math.cos(driftPhase) * 6;
    const scale = 1 + Math.sin(phase) * 0.1 + Math.cos(driftPhase) * 0.03;
    const rotate = base + wobble + spinThree.value - 25;
    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const goNext = () => {
    if (index < PAGES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
      return;
    }
    navigation.replace("Home");
  };

  const skip = () => {
    navigation.replace("Home");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-2 flex-row justify-end" style={styles.topRow}>
        <Pressable
          onPress={skip}
          className="py-2"
          accessibilityRole="button"
          pointerEvents={index < PAGES.length - 1 ? "auto" : "none"}
          style={index < PAGES.length - 1 ? null : styles.skipHidden}
          accessibilityElementsHidden={index >= PAGES.length - 1}
          importantForAccessibility={
            index >= PAGES.length - 1 ? "no-hide-descendants" : "auto"
          }
        >
          <Text className="text-sm text-textSecondary">Passer</Text>
        </Pressable>
      </View>

      <View className="px-6">
        <View className="h-56 mb-8">
          <Animated.View style={[styles.circle, styles.circleOne, circleOneAnim]} />
          <Animated.View style={[styles.circle, styles.circleTwo, circleTwoAnim]} />
          <Animated.View style={[styles.circle, styles.circleThree, circleThreeAnim]} />
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setIndex(nextIndex);
        }}
        className="flex-1"
      >
        {PAGES.map((page) => (
          <View key={page.title} style={{ width }} className="px-6">
            <Text className="text-2xl text-textPrimary mb-3">{page.title}</Text>
            <Text className="text-base text-textSecondary">{page.subtitle}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View className="px-6 pb-6 gap-4">
        <View className="flex-row justify-center gap-2">
          {PAGES.map((_, dotIndex) => (
            <View
              key={`dot-${dotIndex}`}
              className={`h-2 w-2 rounded-full ${
                dotIndex === index ? "bg-textPrimary" : "bg-border"
              }`}
            />
          ))}
        </View>
        <Button label={index === PAGES.length - 1 ? "Commencer" : "Suivant"} onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
  },
  topRow: {
    minHeight: 36,
  },
  skipHidden: {
    opacity: 0,
  },
  circleOne: {
    width: 220,
    height: 150,
    backgroundColor: colors.accent,
    borderRadius: 999,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 160,
    borderBottomLeftRadius: 110,
    top: 10,
    left: 20,
    opacity: 0.5,
  },
  circleTwo: {
    width: 170,
    height: 210,
    backgroundColor: colors.muted,
    borderRadius: 999,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 170,
    borderBottomRightRadius: 140,
    borderBottomLeftRadius: 160,
    top: 60,
    right: 10,
    opacity: 0.6,
  },
  circleThree: {
    width: 200,
    height: 130,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 130,
    borderBottomRightRadius: 140,
    borderBottomLeftRadius: 120,
    bottom: 0,
    left: 120,
    opacity: 0.8,
  },
});
