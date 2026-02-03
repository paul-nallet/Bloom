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
import Svg, { Defs, Filter, FeGaussianBlur, Path, Pattern, Rect } from "react-native-svg";
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

const BLOB_PATHS = [
  "M44 42C63 16 99 8 130 22C162 36 191 52 186 89C181 126 152 150 118 150C84 150 50 144 28 118C6 92 25 68 44 42Z",
  "M32 58C50 28 83 12 118 18C153 24 190 42 192 78C194 114 165 148 126 150C87 152 46 146 26 120C6 94 14 88 32 58Z",
  "M38 44C60 18 96 6 132 20C168 34 194 58 186 94C178 130 144 152 108 150C72 148 36 132 22 106C8 80 16 70 38 44Z",
];

const GRAIN_DOTS = [
  { x: 6, y: 8, s: 1, o: 0.18 },
  { x: 18, y: 12, s: 1.2, o: 0.14 },
  { x: 28, y: 6, s: 0.9, o: 0.2 },
  { x: 44, y: 16, s: 1.1, o: 0.15 },
  { x: 58, y: 10, s: 1, o: 0.12 },
  { x: 70, y: 18, s: 1.3, o: 0.16 },
  { x: 8, y: 32, s: 1, o: 0.14 },
  { x: 22, y: 28, s: 1.1, o: 0.2 },
  { x: 36, y: 34, s: 0.9, o: 0.12 },
  { x: 52, y: 30, s: 1.2, o: 0.15 },
  { x: 66, y: 28, s: 1, o: 0.18 },
  { x: 74, y: 40, s: 1.1, o: 0.16 },
  { x: 10, y: 52, s: 1.2, o: 0.14 },
  { x: 20, y: 48, s: 0.9, o: 0.19 },
  { x: 34, y: 54, s: 1, o: 0.16 },
  { x: 46, y: 48, s: 1.2, o: 0.14 },
  { x: 60, y: 54, s: 1, o: 0.2 },
  { x: 72, y: 50, s: 1.1, o: 0.15 },
  { x: 14, y: 66, s: 1, o: 0.12 },
  { x: 26, y: 70, s: 1.1, o: 0.18 },
  { x: 40, y: 64, s: 0.9, o: 0.16 },
  { x: 56, y: 68, s: 1.2, o: 0.14 },
  { x: 68, y: 72, s: 1, o: 0.2 },
  { x: 76, y: 64, s: 1.1, o: 0.16 },
];

const Blob = ({
  id,
  width,
  height,
  color,
  opacity,
  blur,
  path,
}: {
  id: string;
  width: number;
  height: number;
  color: string;
  opacity: number;
  blur: number;
  path: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 200 160"
    style={{ overflow: "visible" }}
  >
    <Defs>
      <Filter
        id={`blur-${id}`}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="userSpaceOnUse"
      >
        <FeGaussianBlur stdDeviation={blur} />
      </Filter>
    </Defs>
    <Path d={path} fill={color} opacity={opacity} filter={`url(#blur-${id})`} />
  </Svg>
);

const GrainOverlay = () => (
  <Svg width="100%" height="100%" style={styles.grain}>
    <Defs>
      <Pattern id="grain-pattern" width={80} height={80} patternUnits="userSpaceOnUse">
        {GRAIN_DOTS.map((dot, index) => (
          <Rect
            key={`grain-${index}`}
            x={dot.x}
            y={dot.y}
            width={dot.s}
            height={dot.s}
            fill="#000"
            opacity={dot.o}
          />
        ))}
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#grain-pattern)" opacity={0.12} />
  </Svg>
);

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
      withTiming(360, { duration: 26000, easing: Easing.linear }),
      -1,
      false
    );
    spinTwo.value = withRepeat(
      withTiming(-360, { duration: 34000, easing: Easing.inOut(Easing.linear) }),
      -1,
      false
    );
    spinThree.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.cubic }),
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
      [0, pw, pw * -2],
      [-18, 26, 2],
      Extrapolate.CLAMP
    );
    const phase = (scrollX.value / pw) * Math.PI + 0.3;
    const wobble = Math.sin(phase) * 30;
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
      [0, pw, pw * 6],
      [22, -18, 32],
      'identity'
    );
    const phase = (scrollX.value / pw) * Math.PI - 1.2;
    const wobble = Math.sin(phase) * 60;
    const driftPhase = drift.value * Math.PI * 2 + 1.2;
    const translateX = Math.cos(phase) * -26 + Math.sin(driftPhase) * 7;
    const translateY = Math.sin(phase) * 20 + Math.cos(driftPhase) * .5;
    const scale = 1 + Math.cos(phase) * 0.40 + Math.sin(driftPhase) * 0.30;
    const rotate = base + wobble + spinTwo.value + 15;
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
    const phase = (scrollX.value / pw) * Math.PI + 2.4;
    const wobble = Math.sin(phase) * 90;
    const driftPhase = drift.value * Math.PI * 2 + 2.4;
    const translateX = Math.sin(phase) * 22 + Math.sin(driftPhase) * 6;
    const translateY = Math.cos(phase) * -24 + Math.cos(driftPhase) * 9;
    const scale = 1 + Math.sin(phase) * 0.6 + Math.cos(driftPhase) * 0.3;
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
    navigation.replace("RootTabs");
  };

  const skip = () => {
    navigation.replace("RootTabs");
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

      <View className="px-6" style={styles.hero}>
        <View className="h-56 mb-8" pointerEvents="none">
          <Animated.View style={[styles.blob, styles.blobOne, circleOneAnim]}>
            <Blob
              id="one"
              width={220}
              height={400}
              color={colors.accent}
              opacity={0.55}
              blur={10}
              path={BLOB_PATHS[0]}
            />
          </Animated.View>
          <Animated.View style={[styles.blob, styles.blobTwo, circleTwoAnim]}>
            <Blob
              id="two"
              width={400}
              height={400}
              color={colors.muted}
              opacity={0.55}
              blur={10}
              path={BLOB_PATHS[1]}
            />
          </Animated.View>
          <Animated.View style={[styles.blob, styles.blobThree, circleThreeAnim]}>
            <Blob
              id="three"
              width={400}
              height={400}
              color={colors.surface}
              opacity={0.6}
              blur={10}
              path={BLOB_PATHS[2]}
            />
          </Animated.View>
          <GrainOverlay />
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
              className={`h-2 w-2 rounded-full ${dotIndex === index ? "bg-textPrimary" : "bg-border"
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
  topRow: {
    minHeight: 36,
    position: "relative",
    zIndex: 2,
  },
  skipHidden: {
    opacity: 0,
  },
  hero: {
    position: "relative",
    zIndex: 0,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  blob: {
    position: "absolute",
  },
  blobOne: {
    width: 400,
    height: 400,
    top: 10,
    left: 20,
  },
  blobTwo: {
    width: 400,
    height: 400,
    top: 80,
    right: 10,
  },
  blobThree: {
    width: 400,
    height: 400,
    bottom: 0,
    left: 0,
  },
});
