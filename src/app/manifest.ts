import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "¿Que comemos hoy?",
    short_name: "¿Que comemos?",
    description: "App to generate food",
    start_url: "/",
    display: "standalone",
    background_color: "#72BCA5",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
