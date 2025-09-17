import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translateAPI } from "@/services/api";

type LanguageCode = string;

type TranslationCache = Record<string, string>;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  translate: (text: string) => Promise<string>;
  getCachedTranslation: (text: string) => string | null;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "app-language";

function loadCacheKey(code: LanguageCode) {
  return `translations-${code}`;
}

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || "en";
  });

  const [cache, setCache] = useState<TranslationCache>(() => {
    try {
      const raw = localStorage.getItem(loadCacheKey(language));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    try {
      const raw = localStorage.getItem(loadCacheKey(language));
      setCache(raw ? JSON.parse(raw) : {});
    } catch {
      setCache({});
    }
  }, [language]);

  const persistCache = (updated: TranslationCache) => {
    try {
      localStorage.setItem(loadCacheKey(language), JSON.stringify(updated));
    } catch {
      // ignore storage failures
    }
  };

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
  };

  const getCachedTranslation = (text: string) => {
    if (language === "en") return text; // shortcut
    return cache[text] ?? null;
  };

  const translate = async (text: string) => {
    if (!text) return text;
    if (language === "en") return text;
    if (cache[text]) return cache[text];
    try {
      const translated = await translateAPI.translate(text, "auto", language);
      const updated = { ...cache, [text]: translated };
      setCache(updated);
      persistCache(updated);
      return translated;
    } catch {
      return text; // graceful fallback
    }
  };

  const value = useMemo(
    () => ({ language, setLanguage, translate, getCachedTranslation }),
    [language, cache]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
