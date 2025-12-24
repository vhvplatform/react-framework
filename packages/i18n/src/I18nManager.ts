import { Language, TranslationDictionary, TranslationOptions, TranslationResources } from './types';

/**
 * I18n Manager for managing translations
 */
export class I18nManager {
  private resources: TranslationResources;
  private currentLanguage: Language;
  private fallbackLanguage: Language;
  private debug: boolean;

  constructor(
    defaultLanguage: Language = 'vi',
    fallbackLanguage: Language = 'en',
    resources: TranslationResources = {},
    debug = false
  ) {
    this.resources = resources;
    this.currentLanguage = defaultLanguage;
    this.fallbackLanguage = fallbackLanguage;
    this.debug = debug;
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set current language
   */
  setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  /**
   * Add translations for a language
   */
  addTranslations(language: Language, translations: TranslationDictionary): void {
    if (!this.resources[language]) {
      this.resources[language] = {};
    }
    this.resources[language] = this.deepMerge(this.resources[language]!, translations);
  }

  /**
   * Get translation by key
   */
  translate(key: string, options?: TranslationOptions): string {
    const translation = this.getTranslation(key, this.currentLanguage);

    if (translation === null) {
      // Try fallback language
      const fallbackTranslation = this.getTranslation(key, this.fallbackLanguage);

      if (fallbackTranslation === null) {
        if (this.debug) {
          console.warn(`[i18n] Missing translation for key: ${key}`);
        }
        return key;
      }

      return this.interpolate(fallbackTranslation, options);
    }

    return this.interpolate(translation, options);
  }

  /**
   * Get translation from resources
   */
  private getTranslation(key: string, language: Language): string | null {
    const keys = key.split('.');
    let current: any = this.resources[language];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  /**
   * Interpolate variables in translation
   */
  private interpolate(text: string, options?: TranslationOptions): string {
    if (!options) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return options[key] !== undefined ? String(options[key]) : match;
    });
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(
    target: TranslationDictionary,
    source: TranslationDictionary
  ): TranslationDictionary {
    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          typeof source[key] === 'object' &&
          !Array.isArray(source[key]) &&
          source[key] !== null &&
          typeof result[key] === 'object' &&
          !Array.isArray(result[key]) &&
          result[key] !== null
        ) {
          result[key] = this.deepMerge(
            result[key] as TranslationDictionary,
            source[key] as TranslationDictionary
          );
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Check if translation exists
   */
  hasTranslation(key: string, language?: Language): boolean {
    const lang = language || this.currentLanguage;
    return this.getTranslation(key, lang) !== null;
  }

  /**
   * Get all translations for current language
   */
  getAllTranslations(language?: Language): TranslationDictionary {
    const lang = language || this.currentLanguage;
    return this.resources[lang] || {};
  }
}
