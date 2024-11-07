import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "../../context/LanguageContext";

interface IRecipes {
  recipes: IMRecipes;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function Recipes({ recipes }: IRecipes) {
  const { language } = useLanguage();
  return (
    <Accordion type="single" collapsible className="w-full text-white">
      <AccordionItem value="item-1">
        <AccordionTrigger>Receta 1</AccordionTrigger>
        <AccordionContent>
          <div>
            <strong>
              {language.recipes.ingredients} <p></p>
            </strong>
          </div>{" "}
          <div className="mt-2">
            <strong>{language.recipes.steps}</strong>
            <ul>
              <li>paso 1</li>
              <li>paso 2</li>
              <li>paso 3</li>
              <li>paso 4</li>
              <li>paso 5</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Receta 2</AccordionTrigger>
        <AccordionContent>
          <div>
            <strong>
              {language.recipes.ingredients} <p></p>
            </strong>
          </div>{" "}
          <div className="mt-2">
            <strong>{language.recipes.steps}</strong>
            <ul>
              <li>paso 1</li>
              <li>paso 2</li>
              <li>paso 3</li>
              <li>paso 4</li>
              <li>paso 5</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Receta 3</AccordionTrigger>
        <AccordionContent>
          <div>
            <strong>
              {language.recipes.ingredients} <p></p>
            </strong>
          </div>{" "}
          <div className="mt-2">
            <strong>{language.recipes.steps}</strong>
            <ul>
              <li>paso 1</li>
              <li>paso 2</li>
              <li>paso 3</li>
              <li>paso 4</li>
              <li>paso 5</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
