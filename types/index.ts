export interface ILanguage {
  pages: {
    home: {
      title: string;
      generateButton: string;
      ingredientsTitle: string;
      ingredientsDescription: string;
      searchPlaceholder: string;
      noIngredients: string;
      createButton: string;
      lastRecipes: string;
      noRecipes: string;
    };
    header: {
      title: string;
      switch: string;
    };
  };
  spinner: {
    title: string;
  };
  recipes: {
    title: string;
    ingredients: string;
    steps: string;
  };
}
