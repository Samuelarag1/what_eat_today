import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../../context/LanguageContext";
import { Head } from "next/document"; // Asegúrate de importar Head

export const metadata: Metadata = {
  title: "Que comemos hoy ?",
  description: "Generated by Que comemos hoy ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="es">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <body>{children}</body>
      </html>
    </LanguageProvider>
  );
}
