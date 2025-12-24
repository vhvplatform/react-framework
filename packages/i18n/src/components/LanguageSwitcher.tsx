import { useLanguage } from '../I18nContext';
import { Language } from '../types';

interface LanguageSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

/**
 * Language switcher component with support for 6 languages
 */
export function LanguageSwitcher({ className = '', showLabels = true }: LanguageSwitcherProps) {
  const [language, setLanguage] = useLanguage();

  const languages = [
    { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'zh', flag: '🇨🇳', name: '简体中文' },
    { code: 'ja', flag: '🇯🇵', name: '日本語' },
    { code: 'ko', flag: '🇰🇷', name: '한국어' },
  ];

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className={`px-3 py-2 border rounded ${className}`}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {showLabels ? `${lang.flag} ${lang.name}` : lang.flag}
        </option>
      ))}
    </select>
  );
}

/**
 * Simple language toggle button (cycles through languages)
 */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const [language, setLanguage] = useLanguage();

  const languages: Language[] = ['vi', 'en', 'es', 'zh', 'ja', 'ko'];
  const languageLabels: Record<Language, string> = {
    vi: '🇻🇳',
    en: '🇬🇧',
    es: '🇪🇸',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
  };

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-2 border rounded hover:bg-gray-100 ${className}`}
      aria-label="Toggle language"
    >
      {languageLabels[language]}
    </button>
  );
}
