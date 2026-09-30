import { SUPPORTED_LANGUAGES } from "@/i18n";
import { useLanguageStore } from "@/store/language";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type LanguageSwitcherProps = {
  style?: StyleProp<ViewStyle>;
};

export function LanguageSwitcher({ style }: LanguageSwitcherProps) {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <View style={[styles.container, style]}>
      {SUPPORTED_LANGUAGES.map((code) => {
        const isActive = code === language;

        return (
          <Pressable
            key={code}
            onPress={() => setLanguage(code)}
            style={[styles.option, isActive && styles.optionActive]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
              {code.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    padding: 2,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  optionActive: {
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  optionTextActive: {
    color: "#121212",
  },
});
