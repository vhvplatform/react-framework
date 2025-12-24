import { Language } from '../types';

/**
 * Language metadata
 */
export interface LanguageMetadata {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

/**
 * All supported languages with metadata
 */
export const SUPPORTED_LANGUAGES: LanguageMetadata[] = [
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    direction: 'ltr',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
  },
];

/**
 * Get language metadata by code
 */
export function getLanguageMetadata(code: Language): LanguageMetadata | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get language display name
 */
export function getLanguageName(code: Language, useNative = true): string {
  const metadata = getLanguageMetadata(code);
  if (!metadata) return code;
  return useNative ? metadata.nativeName : metadata.name;
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(code: Language): string {
  const metadata = getLanguageMetadata(code);
  return metadata?.flag || '🌐';
}

/**
 * Check if language is RTL (Right-to-Left)
 */
export function isRTL(code: Language): boolean {
  const metadata = getLanguageMetadata(code);
  return metadata?.direction === 'rtl';
}

/**
 * Get browser's preferred language
 */
export function getBrowserLanguage(): Language | null {
  if (typeof window === 'undefined') return null;

  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Map browser language codes to supported languages
  const langMap: Record<string, Language> = {
    vi: 'vi',
    en: 'en',
    es: 'es',
    zh: 'zh',
    ja: 'ja',
    ko: 'ko',
  };

  return langMap[langCode] || null;
}

/**
 * Detect language from user preferences
 * Order: localStorage > browser > default
 */
export function detectUserLanguage(
  storageKey = 'i18n_language',
  defaultLanguage: Language = 'en'
): Language {
  // Try localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey);
    if (stored && isSupportedLanguage(stored)) {
      return stored as Language;
    }
  }

  // Try browser language
  const browserLang = getBrowserLanguage();
  if (browserLang) {
    return browserLang;
  }

  // Fall back to default
  return defaultLanguage;
}

/**
 * Check if a language code is supported
 */
export function isSupportedLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

/**
 * Get next language in cycle
 */
export function getNextLanguage(current: Language): Language {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const currentIndex = codes.indexOf(current);
  const nextIndex = (currentIndex + 1) % codes.length;
  return codes[nextIndex];
}

/**
 * Get previous language in cycle
 */
export function getPreviousLanguage(current: Language): Language {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const currentIndex = codes.indexOf(current);
  const prevIndex = (currentIndex - 1 + codes.length) % codes.length;
  return codes[prevIndex];
}

/**
 * Format language for display with flag
 */
export function formatLanguageDisplay(code: Language, showFlag = true, useNative = true): string {
  const metadata = getLanguageMetadata(code);
  if (!metadata) return code;

  const name = useNative ? metadata.nativeName : metadata.name;
  return showFlag ? `${metadata.flag} ${name}` : name;
}
