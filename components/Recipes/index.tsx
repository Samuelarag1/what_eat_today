import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "../../context/LanguageContext";

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
}

interface RecipesProps {
  recipes: Recipe[];
}

export function Recipes({ recipes }: RecipesProps) {
  const { language } = useLanguage();

  return (
    <Accordion type="single" collapsible className="w-full text-white">
      {recipes.map((recipe, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{recipe.name}</AccordionTrigger>
          <AccordionContent>
            <div>
              <strong>{language.recipes.ingredients}</strong>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <strong>{language.recipes.steps}</strong>
              <ul>
                {recipe.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
