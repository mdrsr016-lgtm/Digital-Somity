import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, Translations, formatCurrency as formatCurrencyUtil } from "../utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  formatMoney: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("ds_lang") as Language;
    return saved === "bn" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", language);
    document.documentElement.lang = language;
    localStorage.setItem("ds_lang", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "bn" : "en"));
  };

  const t: Translations = translations[language];

  const formatMoney = (amount: number) => formatCurrencyUtil(amount, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, formatMoney }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

