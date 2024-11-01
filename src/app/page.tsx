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
  const [ingredients, setIngredients] = useState<IMIngredients[]>([]); // Especifica el tipo de array
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleSelect = (ingredientName: string) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientName)) {
        console.log(`Deseleccionado: ${ingredientName}`);
        return prevSelected.filter((name) => name !== ingredientName);
      } else {
        console.log(`Seleccionado: ${ingredientName}`);
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

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-b from-[#72BCA5] to-[#101A16] h-screen w-full flex flex-col items-center align-middle">
        <Header />

        <div className="h-36 bg-[#F1AE2B] mt-20 w-72 rounded-3xl shadow-black shadow-md border-2 border-black text-center flex flex-col justify-around items-center">
          <p className="text-md font-bold text-shadow text-white">
            No tenes ningun ingrediente agregado
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#BC0B27] w-fit p-3 rounded-full shadow-md shadow-black border-2 border-black hover:bg-[#b87f87] hover:transition-color duration-300 font-primary text-xl text-white hover:text-gray-200"
              >
                Generar comida
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ingredientes</DialogTitle>
                <DialogDescription>
                  Podes seleccionar o buscar los ingredientes que tenes en tu
                  casa
                </DialogDescription>
              </DialogHeader>
              <Input placeholder="Buscar ingredientes" />

              <div className="grid grid-cols-4 gap-4 py-4 h-36 overflow-y-auto">
                {data.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`h-14 w-14 rounded-sm relative ${
                      selectedIngredients.includes(ingredient.name)
                        ? "border-green-500"
                        : "border-black"
                    } border`}
                  >
                    <input
                      type="checkbox"
                      className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer "
                      checked={selectedIngredients.includes(ingredient.name)}
                      onChange={() => handleSelect(ingredient.name)}
                    />
                    <p className="text-2xl flex items-center justify-center h-full w-full pointer-events-none">
                      {ingredient.icon}
                    </p>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">Crear comida</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
