// Specs: @specs/components/ui/search-input.md

import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

export function SearchInput({ style, ...props }: TextInputProps) {
  return (
    <View style={styles.container}>
      <TextInput accessibilityLabel={props.placeholder ?? "Search"} style={[styles.input, style]} {...props} />
      <Text style={styles.icon} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">🔍</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 0,
  },
  icon: {
    marginLeft: 8,
    fontSize: 16,
  },
});
