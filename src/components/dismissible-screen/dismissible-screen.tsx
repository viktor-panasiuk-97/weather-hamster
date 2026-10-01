import type { ReactNode } from "react";
import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

/**
 * Full-screen scrollable container with a background image that can be dismissed
 * by swiping down when the content is scrolled to the top.
 */
export function DismissibleScreen({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children: ReactNode;
}) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const startedAtTop = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const scroll = Gesture.Native();

  // Swipe-down dismiss only applies when the drag starts with the content scrolled to the top;
  // otherwise the drag belongs to the ScrollView.
  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-10, 10])
    .simultaneousWithExternalGesture(scroll)
    .onStart(() => {
      startedAtTop.value = scrollY.value <= 0;
    })
    .onUpdate((e) => {
      if (startedAtTop.value) {
        translateY.value = Math.max(0, e.translationY);
      }
    })
    .onEnd((e) => {
      if (!startedAtTop.value) {
        return;
      }
      if (translateY.value > height * 0.25 || e.velocityY > 800) {
        scheduleOnRN(onDismiss);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, containerStyle]}>
        <ImageBackground
          source={require("@/assets/images/bg.jpg")}
          style={styles.background}
          resizeMode="repeat"
        >
          <SafeAreaView style={styles.safeArea}>
            <GestureDetector gesture={scroll}>
              <Animated.ScrollView
                contentContainerStyle={styles.content}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                bounces={false}
                overScrollMode="never"
              >
                {children}
              </Animated.ScrollView>
            </GestureDetector>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
