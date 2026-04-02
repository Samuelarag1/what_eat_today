import { AppStrings, Locale } from "@/types/domain";

export const translations: Record<Locale, AppStrings> = {
  es: {
    home: {
      eyebrow: "Expo + offline first",
      title: "Que comer hoy sin depender de internet",
      subtitle:
        "Elige los ingredientes que tienes y la app te propone ideas realistas, rapidas y guardadas en tu dispositivo.",
      offlineBadge: "Sin conexion",
      searchPlaceholder: "Buscar ingredientes",
      selectedTitle: "Seleccionados",
      availableTitle: "Ingredientes disponibles",
      selectedEmpty: "Todavia no seleccionaste ingredientes.",
      clearSelection: "Limpiar",
      generate: "Generar 3 ideas",
      helper: "Generacion local, historial persistente y una base lista para crecer en Expo.",
      pantryNote: "La app asume agua, aceite, sal y pimienta como despensa base.",
      needMoreIngredients: "Selecciona al menos 2 ingredientes para sugerir recetas.",
      generatedTitle: "Ideas para hoy",
      favoritesTitle: "Favoritas",
      historyTitle: "Historial reciente",
      emptySearch: "No encontramos ingredientes con esa busqueda.",
      emptyHistory: "Todavia no generaste recetas en este dispositivo.",
      emptyFavorites: "Marca favoritas para tener acceso rapido a tus mejores combinaciones.",
      clearHistory: "Borrar historial",
      localeEs: "ES",
      localeEn: "EN",
      generating: "Armando combinaciones offline...",
      generatedReady: "Listo. Ya tienes 3 recetas nuevas."
    },
    recipe: {
      ingredients: "Ingredientes",
      steps: "Pasos",
      open: "Ver detalle",
      close: "Cerrar",
      toggleFavorite: "Guardar",
      toggledFavorite: "Favorita",
      minutes: "min",
      difficultyEasy: "Facil",
      difficultyMedium: "Media",
      createdAt: "Guardada",
      noConnection: "No usa red ni backend",
      detailTitle: "Detalle"
    },
    badges: {
      fast: "rapida",
      balanced: "equilibrada",
      fresh: "fresca",
      comfort: "casera",
      protein: "proteica",
      sweet: "dulce",
      veggie: "vegetal",
      mealprep: "rendidora"
    }
  },
  en: {
    home: {
      eyebrow: "Expo + offline first",
      title: "What to cook today without relying on internet",
      subtitle:
        "Pick the ingredients you have and the app builds realistic, quick ideas stored directly on your device.",
      offlineBadge: "Offline",
      searchPlaceholder: "Search ingredients",
      selectedTitle: "Selected",
      availableTitle: "Available ingredients",
      selectedEmpty: "You have not selected ingredients yet.",
      clearSelection: "Clear",
      generate: "Generate 3 ideas",
      helper: "Local generation, persistent history, and a cleaner Expo foundation.",
      pantryNote: "The app assumes water, oil, salt, and pepper as pantry basics.",
      needMoreIngredients: "Select at least 2 ingredients to suggest recipes.",
      generatedTitle: "Ideas for today",
      favoritesTitle: "Favorites",
      historyTitle: "Recent history",
      emptySearch: "No ingredients matched that search.",
      emptyHistory: "You have not generated recipes on this device yet.",
      emptyFavorites: "Mark favorites to keep your best combinations nearby.",
      clearHistory: "Clear history",
      localeEs: "ES",
      localeEn: "EN",
      generating: "Building offline combinations...",
      generatedReady: "Done. You already have 3 new recipes."
    },
    recipe: {
      ingredients: "Ingredients",
      steps: "Steps",
      open: "Open details",
      close: "Close",
      toggleFavorite: "Save",
      toggledFavorite: "Favorite",
      minutes: "min",
      difficultyEasy: "Easy",
      difficultyMedium: "Medium",
      createdAt: "Saved",
      noConnection: "No network or backend required",
      detailTitle: "Details"
    },
    badges: {
      fast: "fast",
      balanced: "balanced",
      fresh: "fresh",
      comfort: "comfort",
      protein: "protein",
      sweet: "sweet",
      veggie: "veggie",
      mealprep: "batch-ready"
    }
  }
};
