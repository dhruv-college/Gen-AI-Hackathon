import { createContext, useContext, useState, ReactNode } from 'react';
import { websiteTranslator } from '@/services/websiteTranslation'; // 🔥 ADD THIS IMPORT

// Define all the languages your app will support
// Add all 12+ Indian languages here. The key (e.g., "hi")
// must match the translation key in your backend.
export const AppLanguages = {
  "en": "English",
  "hi": "हिंदी (Hindi)",
  "ta": "தமிழ் (Tamil)",
  "te": "తెలుగు (Telugu)",
  "mr": "मराठी (Marathi)",
  "bn": "বাংলা (Bengali)",
  "gu": "ગુજરાતી (Gujarati)",
  // Add more languages here
};

// This is the type for our "Language Brain"
type LanguageContextType = {
  language: string; // e.g., "en"
  setLanguage: (language: string) => void;
  getLanguageName: (code: string) => string;
  isTranslating: boolean; // 🔥 ADD THIS LINE
  translatePage: (targetLanguage: string) => Promise<void>; // 🔥 ADD THIS LINE
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// This is the component that will wrap your whole app
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("preferredLanguage") || "en";
  });
  const [isTranslating, setIsTranslating] = useState(false); // 🔥 ADD THIS LINE

  const translatePage = async (targetLanguage: string) => {
  setIsTranslating(true);
  try {
    // 🔥 REPLACE SIMULATION WITH REAL TRANSLATION
    const success = await websiteTranslator.translateWebsite(targetLanguage);
    
    if (success) {
      setLanguageState(targetLanguage);
      localStorage.setItem("preferredLanguage", targetLanguage);
    } else {
      console.error('Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
  } finally {
    setIsTranslating(false);
  }
};

  const setLanguage = (langCode: string) => {
    localStorage.setItem("preferredLanguage", langCode);
    setLanguageState(langCode);
  };
  
  const getLanguageName = (code: string) => {
    return AppLanguages[code as keyof typeof AppLanguages] || "English";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLanguageName, isTranslating, translatePage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// This is the "hook" our components will use to get the language
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}