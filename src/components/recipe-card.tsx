import { Pressable, StyleSheet, Text, View } from "react-native";

import { cardShadow, palette, radius, spacing } from "@/lib/theme";
import { MaterializedRecipe, RecipeBadgeKey } from "@/types/domain";

type RecipeCardProps = {
  recipe: MaterializedRecipe;
  createdAtLabel: string;
  createdAtValue: string;
  minutesLabel: string;
  difficultyLabel: string;
  openLabel: string;
  favoriteLabel: string;
  favoritedLabel: string;
  badgeLabels: Record<RecipeBadgeKey, string>;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export function RecipeCard({
  recipe,
  createdAtLabel,
  createdAtValue,
  minutesLabel,
  difficultyLabel,
  openLabel,
  favoriteLabel,
  favoritedLabel,
  badgeLabels,
  onOpen,
  onToggleFavorite
}: RecipeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.summary}>{recipe.summary}</Text>
        </View>
        <Pressable onPress={onToggleFavorite} style={[styles.favoriteButton, recipe.isFavorite && styles.favoriteButtonActive]}>
          <Text style={[styles.favoriteIcon, recipe.isFavorite && styles.favoriteIconActive]}>{recipe.isFavorite ? "★" : "☆"}</Text>
          <Text style={[styles.favoriteLabel, recipe.isFavorite && styles.favoriteLabelActive]}>
            {recipe.isFavorite ? favoritedLabel : favoriteLabel}
          </Text>
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {recipe.durationMinutes} {minutesLabel}
        </Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{difficultyLabel}</Text>
      </View>

      <View style={styles.badges}>
        {recipe.badgeKeys.map((badge) => (
          <View key={badge} style={styles.badge}>
            <Text style={styles.badgeLabel}>{badgeLabels[badge]}</Text>
          </View>
        ))}
      </View>

      <Text numberOfLines={2} style={styles.ingredients}>
        {recipe.ingredients.join(" • ")}
      </Text>

      <Pressable onPress={onOpen} style={styles.openButton}>
        <Text style={styles.openLabel}>{openLabel}</Text>
        <Text style={styles.openMeta}>
          {createdAtLabel} {createdAtValue}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: "rgba(15, 61, 62, 0.88)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.md,
    ...cardShadow
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "800"
  },
  summary: {
    color: palette.creamMuted,
    fontSize: 14,
    lineHeight: 20
  },
  favoriteButton: {
    minWidth: 74,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 247, 234, 0.08)",
    borderWidth: 1,
    borderColor: palette.softBorder,
    gap: 2
  },
  favoriteButtonActive: {
    backgroundColor: "rgba(242, 183, 80, 0.18)",
    borderColor: palette.amber
  },
  favoriteIcon: {
    color: palette.creamMuted,
    fontSize: 17
  },
  favoriteIconActive: {
    color: palette.amber
  },
  favoriteLabel: {
    color: palette.creamMuted,
    fontSize: 11,
    fontWeight: "700"
  },
  favoriteLabelActive: {
    color: palette.white
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  metaText: {
    color: palette.creamMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  metaDot: {
    color: palette.amber,
    fontSize: 12
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 247, 234, 0.12)"
  },
  badgeLabel: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "700"
  },
  ingredients: {
    color: palette.cream,
    fontSize: 14,
    lineHeight: 22
  },
  openButton: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.softBorder,
    gap: 4
  },
  openLabel: {
    color: palette.amber,
    fontSize: 14,
    fontWeight: "800"
  },
  openMeta: {
    color: palette.creamMuted,
    fontSize: 12
  }
});
