import { commonVi } from './common.vi';
import { commonEn } from './common.en';
import { commonEs } from './common.es';
import { commonZh } from './common.zh';
import { commonJa } from './common.ja';
import { commonKo } from './common.ko';
import { TranslationResources } from '../types';

/**
 * Default translations for all supported languages
 */
export const defaultTranslations: TranslationResources = {
  vi: commonVi,
  en: commonEn,
  es: commonEs,
  zh: commonZh,
  ja: commonJa,
  ko: commonKo,
};

export { commonVi, commonEn, commonEs, commonZh, commonJa, commonKo };
