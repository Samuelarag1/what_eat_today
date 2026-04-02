# Que Comemos Hoy

Aplicacion mobile con Expo y React Native para decidir que cocinar sin depender de internet.

## Que cambio en esta version

- Migracion de la base web/Next.js a Expo Router.
- Flujo offline-first: ya no depende de Gemini, Prisma ni un backend para generar recetas.
- Persistencia local con AsyncStorage para historial y favoritas.
- Arquitectura tipada y modular con TypeScript estricto.
- UI movil nueva, preparada para Android, iOS y web desde Expo.

## Stack actual

- Expo SDK 55
- React Native 0.83
- Expo Router
- AsyncStorage
- TypeScript estricto
- React Compiler habilitado

## Como levantarlo

```bash
npm install
npm run start
```

Tambien puedes abrirlo con:

```bash
npm run android
npm run ios
npm run web
```

## Verificaciones utiles

```bash
npm run lint
npm run typecheck
npm run check
```

## Notas de producto

- La app funciona sin conexion.
- Las recetas se generan localmente a partir de ingredientes y plantillas.
- Se asume una despensa minima con agua, aceite, sal y pimienta.
- El historial queda guardado en el dispositivo.

## Estructura

```text
src/
  app/         rutas Expo Router
  components/  UI reutilizable
  context/     estado global y persistencia
  data/        catalogo de ingredientes y textos
  lib/         generador offline, storage y helpers
  types/       tipos del dominio
```
