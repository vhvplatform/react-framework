# 🌍 I18n Package - Enhanced Multi-Language Support

Complete internationalization (i18n) system for the SaaS Framework with support for **6 languages**.

## Supported Languages

| Code | Language | Native Name | Flag |
|------|----------|-------------|------|
| `vi` | Vietnamese | Tiếng Việt | 🇻🇳 |
| `en` | English | English | 🇬🇧 |
| `es` | Spanish | Español | 🇪🇸 |
| `zh` | Chinese (Simplified) | 简体中文 | 🇨🇳 |
| `ja` | Japanese | 日本語 | 🇯🇵 |
| `ko` | Korean | 한국어 | 🇰🇷 |

## Features

✅ **6 Languages** - Vietnamese, English, Spanish, Chinese, Japanese, Korean  
✅ **200+ Translations** - Pre-translated common keys  
✅ **Auto-Detection** - Detect browser language automatically  
✅ **LocalStorage** - Persist user's language preference  
✅ **Variable Interpolation** - `{{variable}}` syntax  
✅ **Nested Keys** - `user.profile.email` support  
✅ **Fallback Language** - Graceful degradation  
✅ **React Components** - LanguageSwitcher, LanguageToggle  
✅ **Utility Functions** - Format dates, currency, numbers by locale  
✅ **TypeScript** - Full type safety

## Installation

```bash
pnpm add @vhvplatform/i18n
```

## Quick Start

### 1. Setup Provider

```tsx
import { I18nProvider } from '@vhvplatform/i18n';

function App() {
  return (
    <I18nProvider
      config={{
        defaultLanguage: 'vi',
        fallbackLanguage: 'en',
        // Auto-detect from browser if not set
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

### 2. Use Translations

```tsx
import { useTranslation } from '@vhvplatform/i18n';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome', { name: 'John' })}</h1>
      <button>{t('common.save')}</button>
      <p>{t('auth.emailRequired')}</p>
    </div>
  );
}
```

### 3. Language Switcher

```tsx
import { LanguageSwitcher, LanguageToggle } from '@vhvplatform/i18n';

function Header() {
  return (
    <div>
      {/* Dropdown with all languages */}
      <LanguageSwitcher showLabels />
      
      {/* Or simple toggle button */}
      <LanguageToggle />
    </div>
  );
}
```

## Translation Categories

### Common Actions
```tsx
t('common.save')        // Save, Lưu, Guardar, 保存, 保存, 저장
t('common.cancel')      // Cancel, Hủy, Cancelar, 取消, キャンセル, 취소
t('common.delete')      // Delete, Xóa, Eliminar, 删除, 削除, 삭제
t('common.edit')        // Edit, Sửa, Editar, 编辑, 編集, 편집
t('common.create')      // Create, Tạo mới, Crear, 创建, 作成, 생성
```

### Authentication
```tsx
t('auth.login')         // Login, Đăng nhập, Iniciar sesión, 登录, ログイン, 로그인
t('auth.register')      // Register, Đăng ký, Registrarse, 注册, 登録, 회원가입
t('auth.email')         // Email
t('auth.password')      // Password, Mật khẩu, Contraseña, 密码, パスワード, 비밀번호
t('auth.forgotPassword') // Forgot Password
```

### User Profile
```tsx
t('user.profile')       // Profile
t('user.fullName')      // Full Name
t('user.email')         // Email
t('user.phone')         // Phone
t('user.role')          // Role
```

### Navigation
```tsx
t('navigation.home')        // Home, Trang chủ, Inicio, 首页, ホーム, 홈
t('navigation.dashboard')   // Dashboard
t('navigation.users')       // Users
t('navigation.settings')    // Settings
```

### Errors
```tsx
t('error.notFound')         // Page Not Found
t('error.serverError')      // Server Error
t('error.networkError')     // Network Error
t('error.unauthorized')     // Unauthorized
```

### Validation
```tsx
t('validation.required')             // This field is required
t('validation.invalidEmail')         // Invalid email
t('validation.minLength', { min: 8 }) // Minimum 8 characters
t('validation.passwordMismatch')     // Passwords do not match
```

### Pagination
```tsx
t('pagination.page')        // Page
t('pagination.showing')     // Showing
t('pagination.items')       // items
```

### Time (Relative)
```tsx
t('time.justNow')                      // Just now
t('time.minutesAgo', { minutes: 5 })   // 5 minutes ago
t('time.hoursAgo', { hours: 2 })       // 2 hours ago
t('time.daysAgo', { days: 3 })         // 3 days ago
```

## Advanced Usage

### Variable Interpolation

```tsx
const { t } = useTranslation();

// Single variable
t('common.welcome', { name: 'Alice' });
// Output: "Welcome Alice", "Chào mừng Alice", etc.

// Multiple variables
t('validation.minLength', { min: 8 });
// Output: "Minimum 8 characters", "Tối thiểu 8 ký tự", etc.
```

### Custom Translations

```tsx
import { useI18n } from '@vhvplatform/i18n';

function MyComponent() {
  const { addTranslations } = useI18n();

  // Add custom translations for a language
  addTranslations('vi', {
    myApp: {
      title: 'Ứng dụng của tôi',
      description: 'Mô tả',
    },
  });

  addTranslations('en', {
    myApp: {
      title: 'My Application',
      description: 'Description',
    },
  });

  return <h1>{t('myApp.title')}</h1>;
}
```

### Language Detection

```tsx
import { detectUserLanguage, getBrowserLanguage } from '@vhvplatform/i18n';

// Detect from localStorage > browser > default
const userLang = detectUserLanguage('app_language', 'en');

// Get browser language only
const browserLang = getBrowserLanguage(); // 'vi' | 'en' | 'es' | 'zh' | 'ja' | 'ko' | null
```

### Language Metadata

```tsx
import { 
  getLanguageMetadata, 
  getLanguageName, 
  getLanguageFlag,
  SUPPORTED_LANGUAGES 
} from '@vhvplatform/i18n';

// Get metadata
const metadata = getLanguageMetadata('vi');
// { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr' }

// Get language name
getLanguageName('vi', true);   // "Tiếng Việt" (native)
getLanguageName('vi', false);  // "Vietnamese" (English)

// Get flag emoji
getLanguageFlag('ja');  // "🇯🇵"

// All supported languages
SUPPORTED_LANGUAGES.forEach(lang => {
  console.log(`${lang.flag} ${lang.nativeName}`);
});
```

### Format Utilities

```tsx
import { formatDate, formatCurrency, formatNumber } from '@vhvplatform/i18n';

const { language } = useI18n();

// Format date
formatDate(new Date(), language);
// vi: "24/12/2025"
// en: "12/24/2025"
// ja: "2025/12/24"

// Format currency
formatCurrency(1000000, language, 'VND');
// vi: "1.000.000₫"
// en: "$1,000,000"
// zh: "¥1,000,000"

// Format number
formatNumber(1234567.89, language);
// vi: "1.234.567,89"
// en: "1,234,567.89"
// zh: "1,234,567.89"
```

### Programmatic Language Change

```tsx
import { useLanguage } from '@vhvplatform/i18n';

function LanguageManager() {
  const [language, setLanguage] = useLanguage();

  const changeToVietnamese = () => setLanguage('vi');
  const changeToEnglish = () => setLanguage('en');
  const changeToSpanish = () => setLanguage('es');

  return (
    <div>
      <p>Current: {language}</p>
      <button onClick={changeToVietnamese}>Tiếng Việt</button>
      <button onClick={changeToEnglish}>English</button>
      <button onClick={changeToSpanish}>Español</button>
    </div>
  );
}
```

## Components

### LanguageSwitcher

Dropdown select with all 6 languages:

```tsx
<LanguageSwitcher 
  showLabels={true}     // Show "🇻🇳 Tiếng Việt" vs "🇻🇳"
  className="my-custom-class"
/>
```

### LanguageToggle

Simple button that cycles through languages:

```tsx
<LanguageToggle className="my-button" />
```

## Configuration Options

```tsx
interface I18nConfig {
  defaultLanguage?: Language;      // Default: 'vi'
  fallbackLanguage?: Language;     // Default: 'en'
  resources?: TranslationResources; // Custom translations
  storageKey?: string;             // Default: 'i18n_language'
  debug?: boolean;                 // Log missing translations
}
```

## Best Practices

### 1. Use Translation Keys Consistently

```tsx
// ✅ Good - consistent key structure
t('user.profile.email')
t('user.profile.phone')
t('user.profile.address')

// ❌ Bad - inconsistent structure
t('email')
t('userPhone')
t('addr')
```

### 2. Provide Context in Variables

```tsx
// ✅ Good - clear variable names
t('validation.minLength', { min: 8 })

// ❌ Bad - unclear variable names
t('validation.minLength', { n: 8 })
```

### 3. Use Nested Keys for Organization

```tsx
// ✅ Good - organized by category
auth: {
  login: 'Login',
  register: 'Register',
  password: 'Password',
}

// ❌ Bad - flat structure
authLogin: 'Login',
authRegister: 'Register',
authPassword: 'Password',
```

### 4. Always Provide Fallback Language

```tsx
<I18nProvider
  config={{
    defaultLanguage: 'vi',
    fallbackLanguage: 'en',  // ✅ Always set fallback
  }}
>
```

## Examples

### Complete Authentication Form

```tsx
import { useTranslation } from '@vhvplatform/i18n';
import { Button, Input } from '@vhvplatform/ui-components';

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <h1>{t('auth.login')}</h1>
      
      <Input
        label={t('auth.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('auth.email')}
      />
      
      <Input
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('auth.password')}
      />
      
      <Button type="submit">
        {t('auth.login')}
      </Button>
      
      <p>
        {t('auth.dontHaveAccount')} 
        <a href="/register">{t('auth.register')}</a>
      </p>
    </form>
  );
}
```

### Multi-Language Dashboard

```tsx
import { useTranslation, LanguageSwitcher } from '@vhvplatform/i18n';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <header>
        <h1>{t('navigation.dashboard')}</h1>
        <LanguageSwitcher showLabels />
      </header>
      
      <nav>
        <a href="/">{t('navigation.home')}</a>
        <a href="/users">{t('navigation.users')}</a>
        <a href="/settings">{t('navigation.settings')}</a>
      </nav>
      
      <main>
        <h2>{t('common.welcome', { name: user.name })}</h2>
        {/* Dashboard content */}
      </main>
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with type-safe translation keys:

```tsx
import { Language, TranslationDictionary, I18nConfig } from '@vhvplatform/i18n';

// Type-safe language
const lang: Language = 'vi';

// Type-safe translations
const translations: TranslationDictionary = {
  myApp: {
    title: 'My App',
  },
};

// Type-safe config
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
};
```

## Contributing Translations

To add a new language or improve existing translations:

1. Create `common.{lang}.ts` in `src/translations/`
2. Follow the structure of existing files
3. Update `Language` type in `src/types.ts`
4. Export in `src/translations/index.ts`
5. Add to `SUPPORTED_LANGUAGES` in `src/utils/helpers.ts`

## License

MIT
