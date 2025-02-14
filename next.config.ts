<<<<<<< HEAD
const withPWA = require("next-pwa")({
  dest: "public",
});
module.exports = withPWA({
  // next.config here
});
=======
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
>>>>>>> 821041d01a0e2ee74a5cbbd71752d764f9014372
