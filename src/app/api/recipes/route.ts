import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
/* eslint-disable @typescript-eslint/no-unused-vars */

export async function POST(req: Request) {
  try {
    const { name, ingredients, steps } = await req.json();

    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        ingredients,
        steps,
      },
    });

    return NextResponse.json(newRecipe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al guardar la receta" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const recipes = await prisma.recipe.findMany();

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las recetas" },
      { status: 500 }
    );
  }
}
