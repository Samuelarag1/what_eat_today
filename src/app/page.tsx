"use client";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import data from "../../data.json";
import { IMIngredients } from "../../Models/Ingredient";
import { useLanguage } from "../../context/LanguageContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from "../../components/Loading";
import { Recipes } from "../../components/Recipes";
// import { FaRegEye } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
/* eslint-disable */
export default function Home() {
  const { language } = useLanguage();

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [recipesModalOpen, setRecipesModalOpen] = useState(false);
  // const [modalOpenRecipeSpecify, setModalOpenRecipeSpecify] = useState(false);
  const [ingredients, setIngredients] = useState<IMIngredients[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredIngredients, setFilteredIngredients] =
    useState<IMIngredients[]>(ingredients);
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<IMRecipes[]>([]);
  const [, setRecipesFetched] = useState<IMRecipes[]>([]);
  const [, setSelectedRecipe] = useState<IMRecipes | null>(null);

  const handleSelect = (ingredientName: string) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientName)) {
        return prevSelected.filter((name) => name !== ingredientName);
      } else {
        return [...prevSelected, ingredientName];
      }
    });
  };
  const handleRecipeClick = (recipe: IMRecipes) => {
    setSelectedRecipe(recipe);
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Error al obtener las recetas");
      }
      const data = await response.json();
      setRecipesFetched(data);
    } catch (error) {
      console.error(error);
    }
  };
  const getItems = () => {
    const ingredientList: IMIngredients[] = data.map((item) => ({
      name: item.name,
      icon: item.icon,
    }));
    setIngredients(ingredientList);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const normalizedTerm = term
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const filtered = ingredients.filter((ingredient) => {
      const normalizedIngredientName = ingredient.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedIngredientName.includes(normalizedTerm);
    });

    setFilteredIngredients(filtered);
  };

  const createRecipePrompt = () => {
    const prompt = {
      prompt: `Crea 3 recetas detalladas utilizando únicamente los siguientes ingredientes: ${selectedIngredients.join(
        ", "
      )}. Asume que cada ingrediente está disponible en una cantidad de 1 unidad, y que el usuario tiene acceso a agua para hervir o cocinar. Genera un JSON con las siguientes claves para cada receta:
          {
            "name": "Receta 1",
            "ingredients": ["ingrediente1", "ingrediente2", "ingrediente3"],
            "steps": [
              "Step 1: ...",
              "Step 2: ...",
              "Step 3: ..."
            ]
          }

    No agregues código ni otros textos innecesarios. Solo responde con un JSON válido como el siguiente ejemplo:

    Genera 3 recetas diferentes en el mismo formato de JSON sin ningún otro texto.
    NO DEVUELVAS EL PROMPT ENVIADO
    `,
    };
    return prompt.prompt.toString();
  };

  const handleGenerateRecipe = async () => {
    const prompt = createRecipePrompt();
    setLoading(true);
    setModalOpen(false);

    try {
      const result = await model.generateContent(prompt);

      if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const recipesText = result.response.candidates[0].content.parts[0].text;
        const recipesArray = JSON.parse(recipesText);

        for (const recipe of recipesArray) {
          const response = await fetch("/api/recipes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: recipe.name,
              ingredients: recipe.ingredients.join(", "),
              steps: recipe.steps.join(" | "),
            }),
          });

          if (!response.ok) {
            console.error("Error al guardar la receta");
          }
        }

        setRecipes(recipesArray);
      } else {
        console.error("La estructura de la respuesta no es la esperada.");
      }
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    }

    setTimeout(() => {
      setLoading(false);
      setRecipesModalOpen(true);
    }, 2000);
  };

  useEffect(() => {
    fetchRecipes();
    getItems();
  }, []);

  useEffect(() => {
    setFilteredIngredients(ingredients);
  }, [ingredients]);

  return (
    <>
      <div className="bg-gradient-to-b from-[#72BCA5] to-[#101A16] h-screen w-full flex flex-col items-center">
        <Header />
        <div className="flex flex-col justify-around items-center h-full w-full">
          <strong className="text-2xl text-shadow text-white text-center w-80">
            {language.pages.home.title}
          </strong>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#BC0B27] w-fit p-6 rounded-full shadow-md shadow-black border-2 border-black hover:bg-black hover:transition-color duration-500 font-primary text-xl text-white hover:text-gray-300"
              >
                {language.pages.home.generateButton}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-white">
                <DialogTitle>
                  {language.pages.home.ingredientsTitle}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {language.pages.home.ingredientsDescription}
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder={language.pages.home.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className="text-white"
              />
              <div className="grid grid-cols-4 gap-4 py-4 h-36 overflow-y-auto">
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className={`h-14 w-14 rounded-sm relative ${
                        selectedIngredients.includes(ingredient.name)
                          ? "border-green-500"
                          : "border-gray-400"
                      } border mt-2 mb-2`}
                    >
                      <input
                        type="checkbox"
                        className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                        checked={selectedIngredients.includes(ingredient.name)}
                        onChange={() => handleSelect(ingredient.name)}
                      />
                      <p className="text-2xl flex items-center justify-center h-full w-full pointer-events-none">
                        {ingredient.icon}
                      </p>
                      <p className="text-xs text-center text-white">
                        {ingredient.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-white">
                    {language.pages.home.noIngredients}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-[#BC0B27] w-full p-3 rounded-full shadow-md shadow-black border-2 border-black hover:bg-[#F1AE2B] hover:transition-color duration-300 font-primary text-xl text-white hover:text-black"
                  onClick={handleGenerateRecipe}
                >
                  {language.pages.home.createButton}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={recipesModalOpen} onOpenChange={setRecipesModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle className="text-white text-center">
                {language.recipes.title}
              </DialogTitle>
              <Recipes recipes={recipes} />
            </DialogContent>
          </Dialog>

          <div className="w-full flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>Hover</TooltipTrigger>
                <TooltipContent>
                  <p>Te voy a enseñar como deberias instalarla</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}
