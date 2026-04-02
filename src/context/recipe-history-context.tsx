import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { readJson, storageKeys, writeJson } from "@/lib/storage";
import { StoredRecipe } from "@/types/domain";

type RecipeHistoryContextValue = {
  recipes: StoredRecipe[];
  favoriteRecipes: StoredRecipe[];
  ready: boolean;
  addGeneratedBatch: (recipes: StoredRecipe[]) => void;
  toggleFavorite: (recipeId: string) => void;
  clearHistory: () => void;
};

const RecipeHistoryContext = createContext<RecipeHistoryContextValue | undefined>(undefined);

export function RecipeHistoryProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<StoredRecipe[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const storedRecipes = await readJson<StoredRecipe[]>(storageKeys.recipes, []);

      if (!active) {
        return;
      }

      setRecipes(Array.isArray(storedRecipes) ? storedRecipes : []);
      setReady(true);
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  const addGeneratedBatch = useCallback(
    (nextBatch: StoredRecipe[]) => {
      setRecipes((previousRecipes) => {
        const nextRecipes = [...nextBatch, ...previousRecipes].slice(0, 60);
        void writeJson(storageKeys.recipes, nextRecipes);
        return nextRecipes;
      });
    },
    []
  );

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      setRecipes((previousRecipes) => {
        const nextRecipes = previousRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
        );

        void writeJson(storageKeys.recipes, nextRecipes);
        return nextRecipes;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    setRecipes([]);
    void writeJson(storageKeys.recipes, []);
  }, []);

  const value = useMemo<RecipeHistoryContextValue>(
    () => ({
      recipes,
      favoriteRecipes: recipes.filter((recipe) => recipe.isFavorite),
      ready,
      addGeneratedBatch,
      toggleFavorite,
      clearHistory
    }),
    [recipes, ready, addGeneratedBatch, toggleFavorite, clearHistory]
  );

  return <RecipeHistoryContext.Provider value={value}>{children}</RecipeHistoryContext.Provider>;
}

export function useRecipeHistory() {
  const context = useContext(RecipeHistoryContext);

  if (!context) {
    throw new Error("useRecipeHistory must be used within RecipeHistoryProvider");
  }

  return context;
}
