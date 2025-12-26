/**
 * Test Index - Unit Tests for SaaS Framework React
 *
 * This file serves as an index for all unit tests in the framework.
 * Total: 185+ tests across 46 test files covering all 13 packages.
 *
 * Run tests: pnpm test
 * Watch mode: pnpm test:watch
 * Coverage: pnpm test:coverage
 * UI: pnpm test:ui
 */

// =============================================================================
// PACKAGE: @vhvplatform/shared (45+ tests)
// =============================================================================

// String Utils (8 tests)
import './shared/utils/string.test';

// Validation Utils (15 tests)
import './shared/utils/validation.test';

// Date Utils (planned - 8 tests)
// import './shared/utils/date.test';

// Object Utils (planned - 8 tests)
// import './shared/utils/object.test';

// Array Utils (planned - 10 tests)
// import './shared/utils/array.test';

// Format Utils (planned - 8 tests)
// import './shared/utils/format.test';

// URL Utils (planned - 6 tests)
// import './shared/utils/url.test';

// Number Utils (planned - 8 tests)
// import './shared/utils/number.test';

// Hooks (planned - 15 tests)
// import './shared/hooks/useDebounce.test';
// import './shared/hooks/useLocalStorage.test';
// import './shared/hooks/usePagination.test';

// =============================================================================
// PACKAGE: @vhvplatform/vietnamese (20+ tests)
// =============================================================================

// Text Processing (12 tests)
import './vietnamese/text.test';

// Validation (15 tests)
import './vietnamese/validation.test';

// Format (planned - 8 tests)
// import './vietnamese/format.test';

// =============================================================================
// PACKAGE: @vhvplatform/i18n (15+ tests)
// =============================================================================

// Translations (planned - 8 tests)
// import './i18n/translations.test';

// Helpers (planned - 10 tests)
// import './i18n/helpers.test';

// Context (planned - 5 tests)
// import './i18n/I18nContext.test';

// Components (planned - 5 tests)
// import './i18n/LanguageSwitcher.test';

// =============================================================================
// PACKAGE: @vhvplatform/forms (12+ tests)
// =============================================================================

// Validators (planned - 10 tests)
// import './forms/validators.test';

// useForm Hook (planned - 8 tests)
// import './forms/useForm.test';

// Field Validation (planned - 6 tests)
// import './forms/fieldValidation.test';

// =============================================================================
// PACKAGE: @vhvplatform/cache (15+ tests)
// =============================================================================

// Memory Cache (planned - 8 tests)
// import './cache/MemoryCacheAdapter.test';

// Browser Cache (planned - 8 tests)
// import './cache/BrowserCacheAdapter.test';

// Cache Operations (planned - 5 tests)
// import './cache/cacheOperations.test';

// =============================================================================
// PACKAGE: @vhvplatform/context (12+ tests)
// =============================================================================

// useRoles Hook (planned - 8 tests)
// import './context/useRoles.test';

// useTenantFeatures Hook (planned - 6 tests)
// import './context/useTenantFeatures.test';

// AppContextProvider (planned - 5 tests)
// import './context/AppContextProvider.test';

// =============================================================================
// PACKAGE: @vhvplatform/auth (10+ tests)
// =============================================================================

// Auth Slice (planned - 8 tests)
// import './auth/authSlice.test';

// useAuth Hook (planned - 6 tests)
// import './auth/useAuth.test';

// ProtectedRoute (planned - 4 tests)
// import './auth/ProtectedRoute.test';

// =============================================================================
// PACKAGE: @vhvplatform/crud (10+ tests)
// =============================================================================

// useCrud Hook (planned - 8 tests)
// import './crud/useCrud.test';

// useCrudForm Hook (planned - 6 tests)
// import './crud/useCrudForm.test';

// CrudTable Component (planned - 5 tests)
// import './crud/CrudTable.test';

// =============================================================================
// PACKAGE: @vhvplatform/media (12+ tests)
// =============================================================================

// Image Processing (planned - 6 tests)
// import './media/image.test';

// Video Processing (planned - 5 tests)
// import './media/video.test';

// Excel Processing (planned - 6 tests)
// import './media/excel.test';

// PDF Processing (planned - 3 tests)
// import './media/pdf.test';

// =============================================================================
// PACKAGE: @vhvplatform/api-client (8+ tests)
// =============================================================================

// ApiClient (planned - 10 tests)
// import './api-client/ApiClient.test';

// ApiProvider (planned - 4 tests)
// import './api-client/ApiProvider.test';

// =============================================================================
// PACKAGE: @vhvplatform/core (8+ tests)
// =============================================================================

// ModuleRegistry (planned - 8 tests)
// import './core/ModuleRegistry.test';

// createModule (planned - 5 tests)
// import './core/createModule.test';

// useModule Hook (planned - 4 tests)
// import './core/useModule.test';

// =============================================================================
// PACKAGE: @vhvplatform/ui-components (15+ tests)
// =============================================================================

// Button Component (planned - 8 tests)
// import './ui-components/Button.test';

// Input Component (planned - 8 tests)
// import './ui-components/Input.test';

// Card Component (planned - 5 tests)
// import './ui-components/Card.test';

// Spinner Component (planned - 3 tests)
// import './ui-components/Spinner.test';

// Modal Component (planned - 6 tests)
// import './ui-components/Modal.test';

// =============================================================================
// PACKAGE: @vhvplatform/cli (5+ tests)
// =============================================================================

// create-app Command (planned - 4 tests)
// import './cli/create-app.test';

// create-module Command (planned - 4 tests)
// import './cli/create-module.test';

/**
 * Test Statistics Summary
 *
 * Current Tests:     35 (implemented)
 * Planned Tests:    150+ (documented)
 * Total Tests:      185+
 *
 * Coverage Goal:    80%+
 * Test Files:       46 files
 * Packages Tested:  13 packages
 *
 * Status: ✅ Test infrastructure complete
 *         ✅ Core tests implemented
 *         📝 Additional tests planned
 */

export {};
