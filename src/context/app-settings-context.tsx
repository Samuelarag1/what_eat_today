import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { translations } from "@/data/translations";
import { readString, storageKeys, writeString } from "@/lib/storage";
import { AppStrings, Locale } from "@/types/domain";

type AppSettingsContextValue = {
  locale: Locale;
  ready: boolean;
  strings: AppStrings;
  setLocale: (locale: Locale) => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const storedLocale = await readString(storageKeys.locale, "es");
      const nextLocale: Locale = storedLocale === "en" ? "en" : "es";

      if (!active) {
        return;
      }

      setLocaleState(nextLocale);
      setReady(true);
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      void writeString(storageKeys.locale, nextLocale);
    },
    []
  );

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      locale,
      ready,
      strings: translations[locale],
      setLocale
    }),
    [locale, ready, setLocale]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }

  return context;
}
