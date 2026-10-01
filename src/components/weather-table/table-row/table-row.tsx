import { StyleSheet, Text, View } from "react-native";

export function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2c",
  },
  label: {
    fontSize: 15,
    color: "#8e8e93",
  },
  value: {
    fontSize: 15,
    color: "#e5e5e7",
    fontWeight: "600",
  },
});
