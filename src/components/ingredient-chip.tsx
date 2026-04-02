import { Pressable, StyleSheet, Text, View } from "react-native";

import { cardShadow, palette, radius, spacing } from "@/lib/theme";

type IngredientChipProps = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function IngredientChip({ emoji, label, selected, onPress }: IngredientChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 84,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.softBorder,
    backgroundColor: "rgba(15, 61, 62, 0.82)",
    gap: spacing.sm,
    ...cardShadow
  },
  cardSelected: {
    borderColor: palette.amber,
    backgroundColor: "rgba(242, 183, 80, 0.16)"
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 247, 234, 0.1)"
  },
  iconWrapSelected: {
    backgroundColor: palette.white
  },
  emoji: {
    fontSize: 24
  },
  label: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "700"
  },
  labelSelected: {
    color: palette.cream
  }
});
