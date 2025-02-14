"use client";

import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { en } from "../languages/en";
import { es } from "../languages/es";
import { ILanguage } from "../types";

interface LanguageContextData {
  language: ILanguage;
  idiom: string;
  locale: string;
  handleSelectIdiom: (idiom: string) => void;
}

const LanguageContext = createContext<LanguageContextData | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<IProps> = ({ children }) => {
  const [idiom, setIdiom] = useState<string>("es");

  const handleSelectIdiom = useCallback((newIdiom: string) => {
    setIdiom(newIdiom);
  }, []);

  const language = useMemo<ILanguage>(() => {
    if (idiom === "en") return en;
    return es;
  }, [idiom]);

  const contextValue = useMemo<LanguageContextData>(
    () => ({
      language,
      handleSelectIdiom,
      idiom,
      locale: idiom === "en" ? "en-US" : "es-AR",
    }),
    [language, handleSelectIdiom, idiom]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
