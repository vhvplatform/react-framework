/**
 * Supported languages
 * - vi: Vietnamese (Tiếng Việt)
 * - en: English
 * - es: Spanish (Español)
 * - zh: Chinese Simplified (简体中文)
 * - ja: Japanese (日本語)
 * - ko: Korean (한국어)
 */
export type Language = 'vi' | 'en' | 'es' | 'zh' | 'ja' | 'ko';

/**
 * Translation dictionary
 */
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/**
 * Translation resources
 */
export type TranslationResources = {
  [lang in Language]?: TranslationDictionary;
};

/**
 * Translation options
 */
export interface TranslationOptions {
  /**
   * Variables to interpolate in translation
   */
  [key: string]: string | number;
}

/**
 * I18n configuration
 */
export interface I18nConfig {
  /**
   * Default language
   */
  defaultLanguage?: Language;

  /**
   * Fallback language when translation is missing
   */
  fallbackLanguage?: Language;

  /**
   * Translation resources
   */
  resources?: TranslationResources;

  /**
   * Storage key for persisting language preference
   */
  storageKey?: string;

  /**
   * Enable debug mode
   */
  debug?: boolean;
}

/**
 * Translation function type
 */
export type TranslateFunction = (key: string, options?: TranslationOptions) => string;

/**
 * I18n context value
 */
export interface I18nContextValue {
  /**
   * Current language
   */
  language: Language;

  /**
   * Change language
   */
  setLanguage: (language: Language) => void;

  /**
   * Translation function
   */
  t: TranslateFunction;

  /**
   * Add translations
   */
  addTranslations: (language: Language, translations: TranslationDictionary) => void;
}
