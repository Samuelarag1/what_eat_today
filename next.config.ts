import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ["en", "es"], // Idiomas soportados
    defaultLocale: "es", // Idioma por defecto
    localeDetection: false, // Si quieres desactivar la detección automática
  },
};

export default nextConfig;
