const withPWA = require("next-pwa")({
  dest: "public",
});
module.exports = withPWA({
  // next.config here
  i18n: {
    locales: ["en", "es"], // Idiomas soportados
    defaultLocale: "es", // Idioma por defecto
    localeDetection: false, // Si quieres desactivar la detección automática
  },
});
