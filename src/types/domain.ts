export type Locale = "es" | "en";

export type IngredientCategory =
  | "vegetable"
  | "protein"
  | "carb"
  | "legume"
  | "dairy"
  | "fruit"
  | "condiment"
  | "herb";

export type RecipeDifficultyKey = "easy" | "medium";

export type RecipeBadgeKey =
  | "fast"
  | "balanced"
  | "fresh"
  | "comfort"
  | "protein"
  | "sweet"
  | "veggie"
  | "mealprep";

export type RecipeTemplateId =
  | "quick-omelette"
  | "smart-toast"
  | "pasta-pan"
  | "rice-bowl"
  | "fresh-salad"
  | "wrap-combo"
  | "potato-skillet"
  | "legume-stew"
  | "protein-plate"
  | "smoothie-break"
  | "sweet-griddle"
  | "pantry-mix";

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Ingredient {
  id: string;
  emoji: string;
  label: LocalizedText;
  category: IngredientCategory;
  tags: string[];
}

export interface StoredRecipe {
  id: string;
  batchId: string;
  templateId: RecipeTemplateId;
  ingredientIds: string[];
  selectedIngredientIds: string[];
  createdAt: string;
  isFavorite: boolean;
}

export interface MaterializedRecipe {
  id: string;
  batchId: string;
  title: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  durationMinutes: number;
  difficulty: RecipeDifficultyKey;
  badgeKeys: RecipeBadgeKey[];
  createdAt: string;
  isFavorite: boolean;
}

export interface RecipeTemplateContext {
  selectedIds: string[];
  selectedIngredients: Ingredient[];
  byCategory: Partial<Record<IngredientCategory, Ingredient[]>>;
}

export interface AppStrings {
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    offlineBadge: string;
    searchPlaceholder: string;
    selectedTitle: string;
    availableTitle: string;
    selectedEmpty: string;
    clearSelection: string;
    generate: string;
    helper: string;
    pantryNote: string;
    needMoreIngredients: string;
    generatedTitle: string;
    favoritesTitle: string;
    historyTitle: string;
    emptySearch: string;
    emptyHistory: string;
    emptyFavorites: string;
    clearHistory: string;
    localeEs: string;
    localeEn: string;
    generating: string;
    generatedReady: string;
  };
  recipe: {
    ingredients: string;
    steps: string;
    open: string;
    close: string;
    toggleFavorite: string;
    toggledFavorite: string;
    minutes: string;
    difficultyEasy: string;
    difficultyMedium: string;
    createdAt: string;
    noConnection: string;
    detailTitle: string;
  };
  badges: Record<RecipeBadgeKey, string>;
}
