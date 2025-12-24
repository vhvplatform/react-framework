import { describe, it, expect, beforeEach } from 'vitest';
import { I18nManager } from '@longvhv/i18n';

describe('I18n Package - I18nManager', () => {
  let manager: I18nManager;

  beforeEach(() => {
    manager = new I18nManager('en', {
      en: {
        common: {
          hello: 'Hello',
          goodbye: 'Goodbye',
        },
      },
      vi: {
        common: {
          hello: 'Xin chào',
          goodbye: 'Tạm biệt',
        },
      },
    });
  });

  describe('translate', () => {
    it('should translate simple key', () => {
      expect(manager.translate('common.hello')).toBe('Hello');
    });

    it('should translate with different locale', () => {
      manager.setLocale('vi');
      expect(manager.translate('common.hello')).toBe('Xin chào');
    });

    it('should return key when translation not found', () => {
      expect(manager.translate('missing.key')).toBe('missing.key');
    });

    it('should support interpolation', () => {
      manager = new I18nManager('en', {
        en: {
          greeting: 'Hello {{name}}!',
        },
      });

      expect(manager.translate('greeting', { name: 'John' })).toBe('Hello John!');
    });

    it('should support multiple variables', () => {
      manager = new I18nManager('en', {
        en: {
          message: '{{user}} sent {{count}} messages',
        },
      });

      expect(manager.translate('message', { user: 'Alice', count: '5' })).toBe(
        'Alice sent 5 messages'
      );
    });
  });

  describe('setLocale', () => {
    it('should change locale', () => {
      manager.setLocale('vi');
      expect(manager.getLocale()).toBe('vi');
      expect(manager.translate('common.hello')).toBe('Xin chào');
    });

    it('should work with non-existent locale', () => {
      manager.setLocale('fr');
      expect(manager.getLocale()).toBe('fr');
      expect(manager.translate('common.hello')).toBe('common.hello');
    });
  });

  describe('getLocale', () => {
    it('should return current locale', () => {
      expect(manager.getLocale()).toBe('en');
    });

    it('should return updated locale', () => {
      manager.setLocale('vi');
      expect(manager.getLocale()).toBe('vi');
    });
  });

  describe('addMessages', () => {
    it('should add messages for locale', () => {
      manager.addMessages('en', {
        new: {
          message: 'New message',
        },
      });

      expect(manager.translate('new.message')).toBe('New message');
    });

    it('should merge with existing messages', () => {
      manager.addMessages('en', {
        common: {
          welcome: 'Welcome',
        },
      });

      expect(manager.translate('common.hello')).toBe('Hello');
      expect(manager.translate('common.welcome')).toBe('Welcome');
    });
  });

  describe('hasTranslation', () => {
    it('should return true for existing translation', () => {
      expect(manager.hasTranslation('common.hello')).toBe(true);
    });

    it('should return false for missing translation', () => {
      expect(manager.hasTranslation('missing.key')).toBe(false);
    });
  });
});
