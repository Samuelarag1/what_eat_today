import { ingredientMap } from "@/data/ingredients";
import { formatList } from "@/lib/text";
import {
  Ingredient,
  Locale,
  MaterializedRecipe,
  RecipeBadgeKey,
  RecipeDifficultyKey,
  RecipeTemplateContext,
  RecipeTemplateId,
  StoredRecipe
} from "@/types/domain";

type RenderedRecipe = {
  title: string;
  summary: string;
  steps: string[];
  durationMinutes: number;
  difficulty: RecipeDifficultyKey;
  badgeKeys: RecipeBadgeKey[];
};

type RecipeTemplate = {
  id: RecipeTemplateId;
  score: (context: RecipeTemplateContext) => number;
  buildIngredientIds: (context: RecipeTemplateContext) => string[];
  render: (recipe: StoredRecipe, locale: Locale, ingredientIds: string[]) => RenderedRecipe;
};

const proteinIds = ["chicken", "beef", "fish", "tuna", "eggs"];
const legumeIds = ["beans", "chickpeas", "lentils"];
const leafyIds = ["lettuce", "spinach"];
const fruitIds = ["apple", "orange", "grapes", "strawberries", "banana", "watermelon", "avocado", "lemon"];
const wrapIds = ["tortilla-wheat", "tortilla-corn"];
const herbIds = ["basil", "parsley"];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function uniqueIds(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getIngredients(ids: string[]) {
  return ids
    .map((id) => ingredientMap.get(id))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient));
}

function createContext(selectedIngredientIds: string[]): RecipeTemplateContext {
  const selectedIds = uniqueIds(selectedIngredientIds);
  const selectedIngredients = getIngredients(selectedIds);
  const byCategory = selectedIngredients.reduce<RecipeTemplateContext["byCategory"]>((accumulator, ingredient) => {
    accumulator[ingredient.category] = [...(accumulator[ingredient.category] ?? []), ingredient];
    return accumulator;
  }, {});

  return { selectedIds, selectedIngredients, byCategory };
}

function hasId(context: RecipeTemplateContext, ingredientId: string) {
  return context.selectedIds.includes(ingredientId);
}

function hasAnyId(context: RecipeTemplateContext, ingredientIds: string[]) {
  return ingredientIds.some((ingredientId) => hasId(context, ingredientId));
}

function pickIds(
  context: RecipeTemplateContext,
  predicate: (ingredient: Ingredient) => boolean,
  limit: number,
  excludedIds: string[] = []
) {
  return context.selectedIngredients
    .filter((ingredient) => !excludedIds.includes(ingredient.id))
    .filter(predicate)
    .slice(0, limit)
    .map((ingredient) => ingredient.id);
}

function pickByCategory(
  context: RecipeTemplateContext,
  categories: Ingredient["category"][],
  limit: number,
  excludedIds: string[] = []
) {
  return pickIds(context, (ingredient) => categories.includes(ingredient.category), limit, excludedIds);
}

function buildIngredientSet(...parts: string[][]) {
  return uniqueIds(parts.flat());
}

function t(locale: Locale, spanish: string, english: string) {
  return locale === "es" ? spanish : english;
}

function localizedName(locale: Locale, ingredientId: string) {
  return ingredientMap.get(ingredientId)?.label[locale] ?? ingredientId;
}

function localizedNames(locale: Locale, ingredientIds: string[]) {
  return ingredientIds.map((ingredientId) => localizedName(locale, ingredientId));
}

function preview(locale: Locale, ingredientIds: string[], count = 2) {
  return formatList(locale, localizedNames(locale, ingredientIds).slice(0, count));
}

const templates: RecipeTemplate[] = [
  {
    id: "quick-omelette",
    score: (context) => (hasId(context, "eggs") ? 90 + pickByCategory(context, ["vegetable", "dairy", "herb"], 4).length * 4 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        ["eggs"],
        pickByCategory(context, ["vegetable"], 3, ["eggs"]),
        pickByCategory(context, ["dairy"], 1, ["eggs"]),
        pickByCategory(context, ["herb"], 1, ["eggs"])
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => id !== "eggs")) || t(locale, "tu seleccion", "your ingredients");

      return {
        title: t(locale, `Tortilla rapida con ${focus}`, `Quick omelette with ${focus}`),
        summary: t(locale, "Una mezcla simple de sarten para resolver una comida en minutos.", "A simple skillet mix that solves a meal in minutes."),
        steps: [
          t(locale, "Pica la parte vegetal y deja los huevos listos para batir.", "Chop the vegetables and get the eggs ready to whisk."),
          t(locale, "Saltea primero lo mas firme hasta que tome aroma.", "Saute the firmest ingredients first until fragrant."),
          t(locale, "Incorpora los huevos y cocina a fuego medio.", "Add the eggs and cook over medium heat."),
          t(locale, "Dobla o revuelve y sirve enseguida.", "Fold or scramble it and serve right away.")
        ],
        durationMinutes: 12,
        difficulty: "easy",
        badgeKeys: ["fast", "protein", "comfort"]
      };
    }
  },
  {
    id: "smart-toast",
    score: (context) => (hasId(context, "bread") ? 82 + pickByCategory(context, ["protein", "dairy", "vegetable", "fruit"], 4).length * 3 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        ["bread"],
        pickByCategory(context, ["dairy", "protein"], 2, ["bread"]),
        pickByCategory(context, ["vegetable", "fruit", "condiment"], 3, ["bread"])
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => id !== "bread")) || t(locale, "despensa", "your pantry");

      return {
        title: t(locale, `Tostadas potentes de ${focus}`, `Loaded toast with ${focus}`),
        summary: t(locale, "Ideal para desayuno fuerte, almuerzo rapido o cena liviana.", "Ideal for a strong breakfast, quick lunch, or lighter dinner."),
        steps: [
          t(locale, "Tuesta el pan hasta que quede firme.", "Toast the bread until crisp."),
          t(locale, "Prepara un topping corto con lo cremoso y lo fresco.", "Build a short topping with creamy and fresh ingredients."),
          t(locale, "Monta las tostadas en capas para sumar contraste.", "Layer the toast for better contrast."),
          t(locale, "Termina con hierbas o mostaza si elegiste alguna.", "Finish with herbs or mustard if you selected them.")
        ],
        durationMinutes: 10,
        difficulty: "easy",
        badgeKeys: ["fast", "balanced"]
      };
    }
  },
  {
    id: "pasta-pan",
    score: (context) => {
      if (!hasId(context, "pasta")) {
        return 0;
      }

      return 88 + Number(hasAnyId(context, ["tomato", "cheese"])) * 6 + pickByCategory(context, ["protein", "vegetable"], 4).length * 2;
    },
    buildIngredientIds: (context) =>
      buildIngredientSet(
        ["pasta"],
        pickIds(context, (ingredient) => ["tomato", "onion", "garlic", "cheese", ...proteinIds, ...herbIds].includes(ingredient.id), 4, ["pasta"]),
        pickByCategory(context, ["vegetable"], 2, ["pasta"])
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => id !== "pasta"));

      return {
        title: t(locale, `Pasta de sarten con ${focus}`, `Skillet pasta with ${focus}`),
        summary: t(locale, "Una version practica para aprovechar pasta con pocos ingredientes.", "A practical version of pasta that works with a small ingredient list."),
        steps: [
          t(locale, "Hierve la pasta hasta dejarla apenas al dente.", "Boil the pasta until just al dente."),
          t(locale, "En otra sarten concentra sabor con la base aromatica.", "In another pan, build flavor with your aromatic base."),
          t(locale, "Suma la pasta cocida y mezcla hasta integrar.", "Add the cooked pasta and toss until combined."),
          t(locale, "Termina con queso o hierbas.", "Finish with cheese or herbs.")
        ],
        durationMinutes: 20,
        difficulty: "medium",
        badgeKeys: ["comfort", "balanced"]
      };
    }
  },
  {
    id: "rice-bowl",
    score: (context) => {
      if (!hasId(context, "rice")) {
        return 0;
      }

      return 86 + Number(hasAnyId(context, [...proteinIds, ...legumeIds])) * 6 + pickByCategory(context, ["vegetable"], 4).length * 2;
    },
    buildIngredientIds: (context) =>
      buildIngredientSet(
        ["rice"],
        pickByCategory(context, ["protein", "legume"], 2, ["rice"]),
        pickByCategory(context, ["vegetable"], 3, ["rice"]),
        pickByCategory(context, ["herb"], 1, ["rice"])
      ),
    render: (_recipe, locale, ingredientIds) => {
      const base = localizedName(locale, ingredientIds.find((id) => id !== "rice") ?? "rice");

      return {
        title: t(locale, `Bowl casero de ${base}`, `Homestyle bowl with ${base}`),
        summary: t(locale, "Pensado para una comida completa, rendidora y facil de repetir.", "Designed as a complete meal that is satisfying and easy to repeat."),
        steps: [
          t(locale, "Cocina el arroz y dejalo suelto.", "Cook the rice and keep it fluffy."),
          t(locale, "Marca aparte la proteina o las legumbres.", "Cook the protein or legumes separately."),
          t(locale, "Integra las verduras al final para mantener textura.", "Add the vegetables at the end to keep their texture."),
          t(locale, "Sirve en bowl y termina con hierbas o limon.", "Serve in a bowl and finish with herbs or lemon.")
        ],
        durationMinutes: 18,
        difficulty: "easy",
        badgeKeys: ["balanced", "mealprep"]
      };
    }
  },
  {
    id: "fresh-salad",
    score: (context) => (hasAnyId(context, [...leafyIds, "cucumber", "tomato", "avocado"]) ? 74 + pickByCategory(context, ["vegetable", "fruit", "legume", "protein", "dairy"], 5).length * 2 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => [...leafyIds, "cucumber", "tomato", "avocado"].includes(ingredient.id), 3),
        pickByCategory(context, ["fruit", "legume", "protein", "dairy"], 2)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds);

      return {
        title: t(locale, `Ensalada fresca de ${focus}`, `Fresh salad with ${focus}`),
        summary: t(locale, "Una combinacion fria y flexible para cuando quieres algo liviano pero completo.", "A cool, flexible combination for when you want something light but complete."),
        steps: [
          t(locale, "Lava y corta todo en tamaños parejos.", "Wash and cut everything into even sizes."),
          t(locale, "Combina primero la base verde con lo cremoso.", "Mix the greens with the creamy ingredients first."),
          t(locale, "Agrega fruta, legumbre o proteina para sumar contraste.", "Add fruit, legumes, or protein for contrast."),
          t(locale, "Termina con limon o hierbas si las elegiste.", "Finish with lemon or herbs if you selected them.")
        ],
        durationMinutes: 8,
        difficulty: "easy",
        badgeKeys: ["fresh", "veggie"]
      };
    }
  },
  {
    id: "wrap-combo",
    score: (context) => (hasAnyId(context, wrapIds) ? 84 + pickByCategory(context, ["protein", "legume", "vegetable", "dairy"], 5).length * 2 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => wrapIds.includes(ingredient.id), 1),
        pickByCategory(context, ["protein", "legume"], 2),
        pickByCategory(context, ["vegetable", "dairy", "fruit"], 3)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => !wrapIds.includes(id)));

      return {
        title: t(locale, `Wrap tibio de ${focus}`, `Warm wrap with ${focus}`),
        summary: t(locale, "Una receta movil, practica y muy adaptable a lo que tengas a mano.", "A portable, practical recipe that adapts well to whatever is available."),
        steps: [
          t(locale, "Calienta apenas la tortilla para volverla flexible.", "Warm the tortilla just enough to make it flexible."),
          t(locale, "Arma un relleno corto con lo mas sabroso de tu seleccion.", "Build a short filling with the most flavorful ingredients you picked."),
          t(locale, "Enrolla firme y dora si quieres mas textura.", "Roll it tightly and toast it for extra texture if you want."),
          t(locale, "Corta al medio y sirve.", "Slice it in half and serve.")
        ],
        durationMinutes: 14,
        difficulty: "easy",
        badgeKeys: ["fast", "balanced"]
      };
    }
  },
  {
    id: "potato-skillet",
    score: (context) => {
      if (!hasAnyId(context, ["potato", "sweet-potato"])) {
        return 0;
      }

      return 80 + Number(hasAnyId(context, ["eggs", "cheese", ...proteinIds])) * 6 + pickByCategory(context, ["vegetable"], 3).length * 2;
    },
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => ["potato", "sweet-potato"].includes(ingredient.id), 1),
        pickIds(context, (ingredient) => ["onion", "garlic", "eggs", "cheese", ...proteinIds, ...herbIds].includes(ingredient.id), 4),
        pickByCategory(context, ["vegetable"], 2)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const base = localizedName(locale, ingredientIds[0] ?? "potato");

      return {
        title: t(locale, `Sarten rustica de ${base}`, `Rustic skillet with ${base}`),
        summary: t(locale, "Con una base de papa o camote, esta opcion resuelve una comida mas casera.", "With potato or sweet potato as the base, this option feels more homestyle."),
        steps: [
          t(locale, "Corta la base en cubos chicos para acelerar la coccion.", "Cut the base into small cubes to speed up cooking."),
          t(locale, "Dora primero y suma aromatics cuando empiece a ablandarse.", "Brown it first and add aromatics once it starts to soften."),
          t(locale, "Integra queso, huevos o proteina para volverla plato principal.", "Add cheese, eggs, or protein to turn it into a main dish."),
          t(locale, "Deja reposar un minuto antes de servir.", "Let it rest for a minute before serving.")
        ],
        durationMinutes: 22,
        difficulty: "medium",
        badgeKeys: ["comfort", "balanced"]
      };
    }
  },
  {
    id: "legume-stew",
    score: (context) => (hasAnyId(context, legumeIds) ? 78 + Number(hasAnyId(context, ["onion", "carrot", "tomato", "garlic"])) * 8 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => legumeIds.includes(ingredient.id), 1),
        pickIds(context, (ingredient) => ["onion", "carrot", "tomato", "garlic", ...herbIds].includes(ingredient.id), 4),
        pickByCategory(context, ["vegetable"], 2)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const base = localizedName(locale, ingredientIds[0] ?? "lentils");

      return {
        title: t(locale, `Guiso simple de ${base}`, `Simple ${base} stew`),
        summary: t(locale, "Una receta rendidora y noble para dias en los que conviene cocinar una sola vez.", "A reliable, filling recipe for days when cooking once matters."),
        steps: [
          t(locale, "Comienza con cebolla, ajo y zanahoria para construir base.", "Start with onion, garlic, and carrot to build the base."),
          t(locale, "Suma la legumbre y cocina hasta integrar sabores.", "Add the legume and cook until the flavors come together."),
          t(locale, "Corrige espesor con un poco mas de agua si hace falta.", "Adjust the thickness with a little more water if needed."),
          t(locale, "Termina con hierbas para dar frescura.", "Finish with herbs for freshness.")
        ],
        durationMinutes: 25,
        difficulty: "medium",
        badgeKeys: ["mealprep", "comfort", "veggie"]
      };
    }
  },
  {
    id: "protein-plate",
    score: (context) => (hasAnyId(context, ["chicken", "beef", "fish", "tuna"]) ? 76 + pickByCategory(context, ["vegetable", "fruit", "herb"], 4).length * 2 : 0),
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => ["chicken", "beef", "fish", "tuna"].includes(ingredient.id), 1),
        pickByCategory(context, ["vegetable"], 3),
        pickIds(context, (ingredient) => ["lemon", ...herbIds].includes(ingredient.id), 2)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const base = localizedName(locale, ingredientIds[0] ?? "chicken");

      return {
        title: t(locale, `Plato express de ${base}`, `Quick ${base} plate`),
        summary: t(locale, "Un plato principal rapido que prioriza coccion directa y acompañamientos cortos.", "A quick main dish focused on direct cooking and short sides."),
        steps: [
          t(locale, "Seca y cocina la proteina con fuego firme para dorar.", "Dry and cook the protein over solid heat so it browns."),
          t(locale, "Aprovecha la misma sarten para sumar verduras.", "Use the same pan to add vegetables."),
          t(locale, "Balancea con limon o hierbas hacia el final.", "Balance it with lemon or herbs toward the end."),
          t(locale, "Sirve apenas salga del fuego.", "Serve it as soon as it comes off the heat.")
        ],
        durationMinutes: 18,
        difficulty: "easy",
        badgeKeys: ["protein", "balanced"]
      };
    }
  },
  {
    id: "smoothie-break",
    score: (context) => {
      if (!hasAnyId(context, ["milk", "yogurt"]) || !hasAnyId(context, fruitIds)) {
        return 0;
      }

      return 72 + Number(hasAnyId(context, ["honey", "chocolate"])) * 4;
    },
    buildIngredientIds: (context) =>
      buildIngredientSet(
        pickIds(context, (ingredient) => ["milk", "yogurt"].includes(ingredient.id), 1),
        pickIds(context, (ingredient) => fruitIds.includes(ingredient.id), 3),
        pickIds(context, (ingredient) => ["honey", "chocolate"].includes(ingredient.id), 1)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => !["milk", "yogurt"].includes(id)));

      return {
        title: t(locale, `Vaso frio de ${focus}`, `Smooth blend with ${focus}`),
        summary: t(locale, "Funciona como desayuno, merienda o salida dulce sin agregar complejidad.", "Works as breakfast, a snack, or a sweet reset without much effort."),
        steps: [
          t(locale, "Enfria o trocea la fruta para ganar textura.", "Chill or cut the fruit for better texture."),
          t(locale, "Licua con la base lactea hasta que quede cremoso.", "Blend it with the dairy base until creamy."),
          t(locale, "Ajusta dulzor con miel o chocolate si los elegiste.", "Adjust sweetness with honey or chocolate if you picked them."),
          t(locale, "Sirve de inmediato.", "Serve immediately.")
        ],
        durationMinutes: 6,
        difficulty: "easy",
        badgeKeys: ["sweet", "fast"]
      };
    }
  },
  {
    id: "sweet-griddle",
    score: (context) => {
      if (!hasId(context, "flour") || !hasAnyId(context, ["milk", "eggs"])) {
        return 0;
      }

      return 68 + Number(hasAnyId(context, ["banana", "apple", "strawberries", "honey", "chocolate"])) * 6;
    },
    buildIngredientIds: (context) =>
      buildIngredientSet(
        ["flour"],
        pickIds(context, (ingredient) => ["milk", "eggs"].includes(ingredient.id), 2),
        pickIds(context, (ingredient) => ["banana", "apple", "strawberries", "honey", "chocolate"].includes(ingredient.id), 2)
      ),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds.filter((id) => id !== "flour"));

      return {
        title: t(locale, `Bocados dulces con ${focus}`, `Sweet skillet bites with ${focus}`),
        summary: t(locale, "Una salida casera cuando tienes base para masa y algo dulce para acompañar.", "A homemade option whenever you have a batter base and something sweet to finish it."),
        steps: [
          t(locale, "Haz una mezcla simple con harina y la base liquida.", "Make a simple batter with the flour and liquid base."),
          t(locale, "Agrega fruta o chocolate para integrar el sabor.", "Add fruit or chocolate so the flavor is built in."),
          t(locale, "Cocina porciones chicas en una sarten apenas engrasada.", "Cook small portions in a lightly greased pan."),
          t(locale, "Termina con miel o fruta fresca.", "Finish with honey or fresh fruit.")
        ],
        durationMinutes: 16,
        difficulty: "medium",
        badgeKeys: ["sweet", "comfort"]
      };
    }
  },
  {
    id: "pantry-mix",
    score: (context) => (context.selectedIds.length >= 2 ? 32 : 0),
    buildIngredientIds: (context) => context.selectedIds.slice(0, 5),
    render: (_recipe, locale, ingredientIds) => {
      const focus = preview(locale, ingredientIds);

      return {
        title: t(locale, `Salteado salvavidas con ${focus}`, `No-fuss skillet with ${focus}`),
        summary: t(locale, "Una receta flexible para salir adelante con lo que ya tienes.", "A flexible recipe that gets the job done with what you already have."),
        steps: [
          t(locale, "Ordena los ingredientes desde los mas firmes a los mas delicados.", "Arrange the ingredients from firmest to most delicate."),
          t(locale, "Cocina en tandas cortas para no perder textura.", "Cook in short batches so the texture stays lively."),
          t(locale, "Une todo al final y ajusta con la despensa base.", "Bring everything together at the end and season with your pantry basics."),
          t(locale, "Sirve bien caliente.", "Serve it hot.")
        ],
        durationMinutes: 15,
        difficulty: "easy",
        badgeKeys: ["fast", "balanced"]
      };
    }
  }
];

const templateMap = new Map(templates.map((template) => [template.id, template]));

export function buildRecipeBatch(selectedIngredientIds: string[]) {
  const context = createContext(selectedIngredientIds);
  const batchId = createId("batch");

  const rankedTemplates = templates
    .map((template) => ({ template, score: template.score(context) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const selectedTemplateIds = Array.from(
    new Set<RecipeTemplateId>([...rankedTemplates.map((entry) => entry.template.id), "pantry-mix"])
  ).slice(0, 3);

  const selectedTemplates = selectedTemplateIds
    .slice(0, 3)
    .map((templateId) => templateMap.get(templateId))
    .filter((template): template is RecipeTemplate => Boolean(template));

  return selectedTemplates.map<StoredRecipe>((template) => ({
    id: createId(template.id),
    batchId,
    templateId: template.id,
    ingredientIds: template.buildIngredientIds(context),
    selectedIngredientIds: context.selectedIds,
    createdAt: new Date().toISOString(),
    isFavorite: false
  }));
}

export function materializeRecipe(recipe: StoredRecipe, locale: Locale): MaterializedRecipe {
  const template = templateMap.get(recipe.templateId) ?? templateMap.get("pantry-mix");
  const ingredientIds = recipe.ingredientIds.length > 0 ? recipe.ingredientIds : recipe.selectedIngredientIds;
  const ingredientNames = localizedNames(locale, ingredientIds);
  const rendered = template!.render(recipe, locale, ingredientIds);

  return {
    id: recipe.id,
    batchId: recipe.batchId,
    title: rendered.title,
    summary: rendered.summary,
    ingredients: ingredientNames,
    steps: rendered.steps,
    durationMinutes: rendered.durationMinutes,
    difficulty: rendered.difficulty,
    badgeKeys: rendered.badgeKeys,
    createdAt: recipe.createdAt,
    isFavorite: recipe.isFavorite
  };
}
