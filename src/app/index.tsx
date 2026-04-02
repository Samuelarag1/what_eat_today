import { useEffect, useMemo, useState, useTransition, useDeferredValue } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { IngredientChip } from "@/components/ingredient-chip";
import { LanguageToggle } from "@/components/language-toggle";
import { RecipeCard } from "@/components/recipe-card";
import { ScreenShell } from "@/components/screen-shell";
import { useAppSettings } from "@/context/app-settings-context";
import { useRecipeHistory } from "@/context/recipe-history-context";
import { ingredientMap, ingredients, minimumIngredientsForRecipes } from "@/data/ingredients";
import { buildRecipeBatch, materializeRecipe } from "@/lib/recipe-generator";
import { formatDate, normalizeText } from "@/lib/text";
import { cardShadow, palette, radius, spacing } from "@/lib/theme";
import { Ingredient, MaterializedRecipe, StoredRecipe } from "@/types/domain";

type PresentableRecipe = {
  stored: StoredRecipe;
  display: MaterializedRecipe;
  createdAtValue: string;
};

function toPresentableRecipe(recipe: StoredRecipe, locale: "es" | "en"): PresentableRecipe {
  return {
    stored: recipe,
    display: materializeRecipe(recipe, locale),
    createdAtValue: formatDate(locale, recipe.createdAt)
  };
}

export default function HomeScreen() {
  const { locale, ready: settingsReady, setLocale, strings } = useAppSettings();
  const {
    recipes,
    favoriteRecipes,
    ready: historyReady,
    addGeneratedBatch,
    toggleFavorite,
    clearHistory
  } = useRecipeHistory();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastBatchId, setLastBatchId] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    if (!lastBatchId && recipes.length > 0) {
      setLastBatchId(recipes[0].batchId);
    }
  }, [recipes, lastBatchId]);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setFeedbackMessage(null);
    }, 2400);

    return () => clearTimeout(timeoutId);
  }, [feedbackMessage]);

  const selectedIngredients = useMemo(
    () =>
      selectedIds
        .map((ingredientId) => ingredientMap.get(ingredientId))
        .filter((ingredient): ingredient is Ingredient => Boolean(ingredient)),
    [selectedIds]
  );

  const filteredIngredients = useMemo(() => {
    const normalizedSearch = normalizeText(deferredSearchTerm);

    if (!normalizedSearch) {
      return ingredients;
    }

    return ingredients.filter((ingredient) => {
      const haystack = normalizeText(`${ingredient.label.es} ${ingredient.label.en}`);
      return haystack.includes(normalizedSearch);
    });
  }, [deferredSearchTerm]);

  const latestRecipes = useMemo(
    () =>
      recipes
        .filter((recipe) => recipe.batchId === lastBatchId)
        .map((recipe) => toPresentableRecipe(recipe, locale)),
    [recipes, lastBatchId, locale]
  );

  const favoriteRecipeCards = useMemo(
    () => favoriteRecipes.map((recipe) => toPresentableRecipe(recipe, locale)),
    [favoriteRecipes, locale]
  );

  const historyRecipes = useMemo(
    () =>
      recipes
        .filter((recipe) => recipe.batchId !== lastBatchId)
        .slice(0, 6)
        .map((recipe) => toPresentableRecipe(recipe, locale)),
    [recipes, lastBatchId, locale]
  );

  const activeRecipe = useMemo(() => {
    const recipe = recipes.find((item) => item.id === activeRecipeId);
    return recipe ? toPresentableRecipe(recipe, locale) : null;
  }, [recipes, activeRecipeId, locale]);

  const isReady = settingsReady && historyReady;

  const difficultyLabel = (recipe: MaterializedRecipe) =>
    recipe.difficulty === "easy" ? strings.recipe.difficultyEasy : strings.recipe.difficultyMedium;

  const handleToggleIngredient = (ingredientId: string) => {
    setSelectedIds((previousSelected) =>
      previousSelected.includes(ingredientId)
        ? previousSelected.filter((id) => id !== ingredientId)
        : [...previousSelected, ingredientId]
    );
  };

  const handleGenerateRecipes = () => {
    if (selectedIds.length < minimumIngredientsForRecipes) {
      setFeedbackMessage(strings.home.needMoreIngredients);
      return;
    }

    const nextBatch = buildRecipeBatch(selectedIds);

    startTransition(() => {
      addGeneratedBatch(nextBatch);
      setLastBatchId(nextBatch[0]?.batchId ?? null);
      setActiveRecipeId(nextBatch[0]?.id ?? null);
      setFeedbackMessage(strings.home.generatedReady);
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setLastBatchId(null);
    setActiveRecipeId(null);
    setFeedbackMessage(null);
  };

  if (!isReady) {
    return (
      <ScreenShell>
        <SafeAreaView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={palette.white} />
          <Text style={styles.loadingText}>{strings.home.generating}</Text>
        </SafeAreaView>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={styles.eyebrow}>{strings.home.eyebrow}</Text>
              <LanguageToggle
                locale={locale}
                esLabel={strings.home.localeEs}
                enLabel={strings.home.localeEn}
                onChange={setLocale}
              />
            </View>

            <Text style={styles.title}>{strings.home.title}</Text>
            <Text style={styles.subtitle}>{strings.home.subtitle}</Text>

            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>{strings.home.offlineBadge}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{strings.home.selectedTitle}</Text>
            <Text style={styles.helperText}>{strings.home.helper}</Text>

            {feedbackMessage ? (
              <View style={[styles.feedbackBanner, isPending && styles.feedbackBannerPending]}>
                {isPending ? <ActivityIndicator size="small" color={palette.white} /> : null}
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </View>
            ) : null}

            <TextInput
              placeholder={strings.home.searchPlaceholder}
              placeholderTextColor="rgba(255, 247, 234, 0.62)"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <View style={styles.selectionRow}>
              {selectedIngredients.length > 0 ? (
                selectedIngredients.map((ingredient) => (
                  <Pressable
                    key={ingredient.id}
                    onPress={() => handleToggleIngredient(ingredient.id)}
                    style={styles.selectedPill}
                  >
                    <Text style={styles.selectedPillText}>
                      {ingredient.emoji} {ingredient.label[locale]}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.emptyInlineText}>{strings.home.selectedEmpty}</Text>
              )}
            </View>

            <View style={styles.actionsRow}>
              <Pressable onPress={() => setSelectedIds([])} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonLabel}>{strings.home.clearSelection}</Text>
              </Pressable>
              <Pressable onPress={handleGenerateRecipes} style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>{strings.home.generate}</Text>
              </Pressable>
            </View>

            <Text style={styles.pantryNote}>{strings.home.pantryNote}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{strings.home.availableTitle}</Text>
            <View style={styles.ingredientGrid}>
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <IngredientChip
                    key={ingredient.id}
                    emoji={ingredient.emoji}
                    label={ingredient.label[locale]}
                    selected={selectedIds.includes(ingredient.id)}
                    onPress={() => handleToggleIngredient(ingredient.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardText}>{strings.home.emptySearch}</Text>
                </View>
              )}
            </View>
          </View>

          <RecipeSection
            title={strings.home.generatedTitle}
            recipes={latestRecipes}
            strings={strings}
            onOpen={setActiveRecipeId}
            onToggleFavorite={toggleFavorite}
            difficultyLabel={difficultyLabel}
          />

          <RecipeSection
            title={strings.home.favoritesTitle}
            recipes={favoriteRecipeCards}
            emptyMessage={strings.home.emptyFavorites}
            strings={strings}
            onOpen={setActiveRecipeId}
            onToggleFavorite={toggleFavorite}
            difficultyLabel={difficultyLabel}
          />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{strings.home.historyTitle}</Text>
            {recipes.length > 0 ? (
              <Pressable onPress={handleClearHistory}>
                <Text style={styles.clearHistoryLabel}>{strings.home.clearHistory}</Text>
              </Pressable>
            ) : null}
          </View>

          <RecipeSection
            recipes={historyRecipes}
            emptyMessage={strings.home.emptyHistory}
            strings={strings}
            onOpen={setActiveRecipeId}
            onToggleFavorite={toggleFavorite}
            difficultyLabel={difficultyLabel}
          />
        </ScrollView>
      </SafeAreaView>

      <Modal transparent visible={Boolean(activeRecipe)} animationType="slide" onRequestClose={() => setActiveRecipeId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {activeRecipe ? (
              <>
                <Text style={styles.modalEyebrow}>{strings.recipe.detailTitle}</Text>
                <Text style={styles.modalTitle}>{activeRecipe.display.title}</Text>
                <Text style={styles.modalSummary}>{activeRecipe.display.summary}</Text>

                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaText}>
                    {activeRecipe.display.durationMinutes} {strings.recipe.minutes}
                  </Text>
                  <Text style={styles.modalMetaDot}>•</Text>
                  <Text style={styles.modalMetaText}>{difficultyLabel(activeRecipe.display)}</Text>
                  <Text style={styles.modalMetaDot}>•</Text>
                  <Text style={styles.modalMetaText}>{strings.recipe.noConnection}</Text>
                </View>

                <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{strings.recipe.ingredients}</Text>
                    {activeRecipe.display.ingredients.map((ingredient) => (
                      <Text key={ingredient} style={styles.modalBullet}>
                        • {ingredient}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{strings.recipe.steps}</Text>
                    {activeRecipe.display.steps.map((step) => (
                      <Text key={step} style={styles.modalStep}>
                        • {step}
                      </Text>
                    ))}
                  </View>
                </ScrollView>

                <Pressable onPress={() => setActiveRecipeId(null)} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseButtonLabel}>{strings.recipe.close}</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

function RecipeSection({
  title,
  recipes,
  emptyMessage,
  strings,
  onOpen,
  onToggleFavorite,
  difficultyLabel
}: {
  title?: string;
  recipes: PresentableRecipe[];
  emptyMessage?: string;
  strings: ReturnType<typeof useAppSettings>["strings"];
  onOpen: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string) => void;
  difficultyLabel: (recipe: MaterializedRecipe) => string;
}) {
  if (!title && recipes.length === 0 && !emptyMessage) {
    return null;
  }

  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

      {recipes.length > 0 ? (
        <View style={styles.recipeStack}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.stored.id}
              recipe={recipe.display}
              createdAtLabel={strings.recipe.createdAt}
              createdAtValue={recipe.createdAtValue}
              minutesLabel={strings.recipe.minutes}
              difficultyLabel={difficultyLabel(recipe.display)}
              openLabel={strings.recipe.open}
              favoriteLabel={strings.recipe.toggleFavorite}
              favoritedLabel={strings.recipe.toggledFavorite}
              badgeLabels={strings.badges}
              onOpen={() => onOpen(recipe.stored.id)}
              onToggleFavorite={() => onToggleFavorite(recipe.stored.id)}
            />
          ))}
        </View>
      ) : emptyMessage ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>{emptyMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxl * 2
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  loadingText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "700"
  },
  heroCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: "rgba(10, 37, 37, 0.72)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.md,
    ...cardShadow
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  eyebrow: {
    color: palette.amber,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1
  },
  title: {
    color: palette.white,
    fontSize: 42,
    lineHeight: 46,
    fontFamily: "ProtestStrike"
  },
  subtitle: {
    color: palette.cream,
    fontSize: 16,
    lineHeight: 24
  },
  offlineBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "rgba(109, 207, 149, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(109, 207, 149, 0.32)"
  },
  offlineBadgeText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  panel: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: "rgba(15, 61, 62, 0.86)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.md,
    ...cardShadow
  },
  panelTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "800"
  },
  helperText: {
    color: palette.creamMuted,
    fontSize: 14,
    lineHeight: 20
  },
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: "rgba(109, 207, 149, 0.16)"
  },
  feedbackBannerPending: {
    backgroundColor: "rgba(242, 183, 80, 0.18)"
  },
  feedbackText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: "700",
    flex: 1
  },
  searchInput: {
    borderWidth: 1,
    borderColor: palette.softBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: "rgba(255, 247, 234, 0.08)",
    color: palette.white,
    fontSize: 16
  },
  selectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  selectedPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 247, 234, 0.12)"
  },
  selectedPillText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: "700"
  },
  emptyInlineText: {
    color: palette.creamMuted,
    fontSize: 14
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center"
  },
  secondaryButtonLabel: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "800"
  },
  primaryButton: {
    flex: 1.3,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.amber,
    alignItems: "center"
  },
  primaryButtonLabel: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  pantryNote: {
    color: palette.creamMuted,
    fontSize: 12,
    lineHeight: 18
  },
  section: {
    gap: spacing.md
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionTitle: {
    color: palette.white,
    fontSize: 22,
    fontWeight: "900"
  },
  clearHistoryLabel: {
    color: palette.amber,
    fontSize: 13,
    fontWeight: "800"
  },
  ingredientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  recipeStack: {
    gap: spacing.md
  },
  emptyCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: "rgba(15, 61, 62, 0.62)",
    borderWidth: 1,
    borderColor: palette.softBorder
  },
  emptyCardText: {
    color: palette.creamMuted,
    fontSize: 14,
    lineHeight: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalCard: {
    maxHeight: "86%",
    padding: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: palette.pine,
    gap: spacing.md
  },
  modalEyebrow: {
    color: palette.amber,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1
  },
  modalTitle: {
    color: palette.white,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: "ProtestStrike"
  },
  modalSummary: {
    color: palette.creamMuted,
    fontSize: 15,
    lineHeight: 22
  },
  modalMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs
  },
  modalMetaText: {
    color: palette.cream,
    fontSize: 12,
    fontWeight: "700"
  },
  modalMetaDot: {
    color: palette.amber,
    fontSize: 12
  },
  modalScroll: {
    maxHeight: "56%"
  },
  modalScrollContent: {
    gap: spacing.lg
  },
  modalSection: {
    gap: spacing.sm
  },
  modalSectionTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "800"
  },
  modalBullet: {
    color: palette.cream,
    fontSize: 15,
    lineHeight: 22
  },
  modalStep: {
    color: palette.cream,
    fontSize: 15,
    lineHeight: 24
  },
  modalCloseButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: palette.amber
  },
  modalCloseButtonLabel: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "900"
  }
});
