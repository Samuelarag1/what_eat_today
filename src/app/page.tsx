"use client";
import { useEffect, useState } from "react";
import { Header } from "../../components/header";
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

export default function Home() {
  const [ingredients, setIngredients] = useState<IMIngredients[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIngredients, setFilteredIngredients] =
    useState<IMIngredients[]>(ingredients);

  const handleSelect = (ingredientName: string) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientName)) {
        return prevSelected.filter((name) => name !== ingredientName);
      } else {
        return [...prevSelected, ingredientName];
      }
    });
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
      prompt: `Crea una receta detallada utilizando únicamente los siguientes ingredientes: ${selectedIngredients.join(
        ", "
      )}. Asume que cada ingrediente está disponible en una cantidad de 1 unidad, y que el usuario tiene acceso a agua para hervir o cocinar. Genera un JSON con el nombre de la receta y pasos descriptivos, sin imágenes.`,
    };
    console.log(prompt);
    return prompt;
  };

  const handleGenerateRecipe = async () => {
    const recipePrompt = createRecipePrompt();

    try {
      const response = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipePrompt),
      });

      const data = await response.json();
      console.log("Receta generada:", data);
    } catch (error) {
      console.error("Error generando receta:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    setFilteredIngredients(ingredients);
  }, [ingredients]);

  return (
    <div className="bg-gradient-to-b from-[#72BCA5] to-[#101A16] h-screen w-full flex flex-col items-center">
      <Header />
      <div className="flex flex-col justify-around items-center h-full w-full">
        <strong className="text-2xl text-shadow text-white text-center w-80">
          Deja de pensar en qué cocinar y que la IA lo haga por ti...
        </strong>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#BC0B27] w-fit p-6 rounded-full shadow-md shadow-black border-2 border-black hover:bg-black hover:transition-color duration-500 font-primary text-xl text-white hover:text-gray-300"
            >
              Generar comida
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="text-white">
              <DialogTitle>Ingredientes</DialogTitle>
              <DialogDescription className="text-gray-400">
                Puedes seleccionar o buscar los ingredientes que tienes en tu
                casa.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Buscar ingredientes"
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
                <p className="text-white">No se encontraron ingredientes</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-[#BC0B27] w-full p-3 rounded-full shadow-md shadow-black border-2 border-black hover:bg-[#F1AE2B] hover:transition-color duration-300 font-primary text-xl text-white hover:text-black"
                onClick={handleGenerateRecipe}
              >
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-40 bg-[#F1AE2B] w-80 rounded-3xl shadow-black shadow-md border-2 border-black text-center flex flex-col justify-around items-center mb-10 p-4">
          <p className="text-xl font-semibold">Tus últimas recetas</p>
          <div>
            <strong className="text-md text-gray-800">
              No tienes recetas generadas
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
