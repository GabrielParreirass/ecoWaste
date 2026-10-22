import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Language, Translatable, translate, TranslationValues } from "../i18n/translate";

export const LANGUAGE_STORAGE_KEY = "ecowaste-language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (message: Translatable, values?: TranslationValues) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>("pt");
  const currentLanguage = useRef<Language>("pt");
  const changedByUser = useRef(false);
  const pendingSave = useRef(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try {
        const saved = Platform.OS === "web"
          ? globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY)
          : await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
        if (mounted && !changedByUser.current && (saved === "pt" || saved === "en")) {
          currentLanguage.current = saved;
          updateLanguage(saved);
        }
      } catch {
        // Language switching remains available if device storage is unavailable.
      }
    };
    void restore();
    return () => { mounted = false; };
  }, []);

  const setLanguage = useCallback((next: Language) => {
    changedByUser.current = true;
    currentLanguage.current = next;
    updateLanguage(next);
    // Keep rapid changes in order, including asynchronous native storage writes.
    pendingSave.current = pendingSave.current.then(async () => {
      if (Platform.OS === "web") {
        globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, next);
      } else {
        await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, next);
      }
    }).catch(() => {});
  }, []);

  // MQTT callbacks registered once must also read the latest chosen language.
  const t = useCallback((message: Translatable, values?: TranslationValues) =>
    translate(message, currentLanguage.current, values), []);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
