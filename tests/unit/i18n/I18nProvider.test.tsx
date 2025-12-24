import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { I18nProvider, useI18n } from '@longvhv/i18n';

const TestComponent = () => {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <div data-testid="translation">{t('common.hello')}</div>
      <div data-testid="locale">{locale}</div>
      <button onClick={() => setLocale('vi')}>Change to Vietnamese</button>
    </div>
  );
};

describe('I18n Package', () => {
  describe('I18nProvider', () => {
    it('should provide i18n context', () => {
      const { getByTestId } = render(
        <I18nProvider
          locale="en"
          messages={{
            en: { common: { hello: 'Hello' } },
          }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('locale')).toHaveTextContent('en');
    });

    it('should translate messages', () => {
      const { getByTestId } = render(
        <I18nProvider
          locale="en"
          messages={{
            en: { common: { hello: 'Hello World' } },
          }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('translation')).toHaveTextContent('Hello World');
    });

    it('should support multiple locales', () => {
      const messages = {
        en: { common: { hello: 'Hello' } },
        vi: { common: { hello: 'Xin chào' } },
      };

      const { getByTestId, rerender } = render(
        <I18nProvider locale="en" messages={messages}>
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('translation')).toHaveTextContent('Hello');

      rerender(
        <I18nProvider locale="vi" messages={messages}>
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('translation')).toHaveTextContent('Xin chào');
    });
  });

  describe('useI18n hook', () => {
    it('should return translation function', () => {
      const Comp = () => {
        const { t } = useI18n();
        return <div>{t('test')}</div>;
      };

      const { container } = render(
        <I18nProvider locale="en" messages={{ en: { test: 'Test' } }}>
          <Comp />
        </I18nProvider>
      );

      expect(container).toHaveTextContent('Test');
    });

    it('should return current locale', () => {
      const Comp = () => {
        const { locale } = useI18n();
        return <div>{locale}</div>;
      };

      const { container } = render(
        <I18nProvider locale="en" messages={{ en: {} }}>
          <Comp />
        </I18nProvider>
      );

      expect(container).toHaveTextContent('en');
    });

    it('should handle missing translations', () => {
      const Comp = () => {
        const { t } = useI18n();
        return <div>{t('missing.key')}</div>;
      };

      const { container } = render(
        <I18nProvider locale="en" messages={{ en: {} }}>
          <Comp />
        </I18nProvider>
      );

      expect(container).toHaveTextContent('missing.key');
    });

    it('should support interpolation', () => {
      const Comp = () => {
        const { t } = useI18n();
        return <div>{t('greeting', { name: 'John' })}</div>;
      };

      const { container } = render(
        <I18nProvider locale="en" messages={{ en: { greeting: 'Hello {{name}}' } }}>
          <Comp />
        </I18nProvider>
      );

      expect(container).toHaveTextContent('Hello John');
    });
  });
});
