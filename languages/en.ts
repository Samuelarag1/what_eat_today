import { ILanguage } from "../types/index";

export const en: ILanguage = {
  pages: {
    home: {
      title: "Stop thinking about what to cook and let AI do it for you...",
      generateButton: "Generate food",
      ingredientsTitle: "Ingredients",
      ingredientsDescription:
        "You can select or search for the ingredients you have at home.",
      searchPlaceholder: "Search ingredients",
      noIngredients: "No ingredients found",
      createButton: "Create",
      lastRecipes: "Your last recipes",
      noRecipes: "You have no generated recipes",
    },
    header: {
      title: "¿ What eat today ?",
      switch: "Change language",
    },
  },
  spinner: {
    title: "Generating your recipes 😋",
  },
  recipes: {
    title: "Recipes",
    ingredients: "Ingredients",
    steps: "Steps",
    close: "Close",
  },
};
