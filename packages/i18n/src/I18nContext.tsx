import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { I18nManager } from './I18nManager';
import { I18nConfig, I18nContextValue, Language, TranslationDictionary } from './types';

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * I18n Provider Props
 */
interface I18nProviderProps {
  children: ReactNode;
  config?: I18nConfig;
}

/**
 * I18n Provider Component
 */
export function I18nProvider({ children, config = {} }: I18nProviderProps) {
  const {
    defaultLanguage = 'vi',
    fallbackLanguage = 'en',
    resources = {},
    storageKey = 'saas_language',
    debug = false,
  } = config;

  // Initialize manager
  const [manager] = useState(() => new I18nManager(defaultLanguage, fallbackLanguage, resources, debug));

  // Load language from storage
  const loadLanguage = (): Language => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'vi' || stored === 'en') {
        return stored;
      }
    } catch (error) {
      if (debug) {
        console.error('[i18n] Failed to load language from storage:', error);
      }
    }
    return defaultLanguage;
  };

  const [language, setLanguageState] = useState<Language>(loadLanguage);

  // Update manager language
  useEffect(() => {
    manager.setLanguage(language);
  }, [language, manager]);

  // Set language with persistence
  const setLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguageState(newLanguage);
      try {
        localStorage.setItem(storageKey, newLanguage);
      } catch (error) {
        if (debug) {
          console.error('[i18n] Failed to save language to storage:', error);
        }
      }
    },
    [storageKey, debug]
  );

  // Translation function
  const t = useCallback(
    (key: string, options?: Record<string, string | number>) => {
      return manager.translate(key, options);
    },
    [manager, language] // Re-create when language changes
  );

  // Add translations
  const addTranslations = useCallback(
    (lang: Language, translations: TranslationDictionary) => {
      manager.addTranslations(lang, translations);
    },
    [manager]
  );

  const value: I18nContextValue = {
    language,
    setLanguage,
    t,
    addTranslations,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to use i18n
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
}

/**
 * Hook to get translation function - memoized
 */
export function useTranslation() {
  const { t, language } = useI18n();
  return useMemo(() => ({ t, language }), [t, language]);
}

/**
 * Hook to get language - memoized
 */
export function useLanguage() {
  const { language, setLanguage } = useI18n();
  return useMemo(() => [language, setLanguage] as const, [language, setLanguage]);
}
