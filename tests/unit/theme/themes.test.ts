import { describe, it, expect } from 'vitest';
import { lightTheme, darkTheme } from '@vhvplatform/theme';

describe('Theme Definitions', () => {
  describe('lightTheme', () => {
    it('should have correct mode', () => {
      expect(lightTheme.mode).toBe('light');
    });

    it('should have all required colors', () => {
      expect(lightTheme.colors).toHaveProperty('primary');
      expect(lightTheme.colors).toHaveProperty('secondary');
      expect(lightTheme.colors).toHaveProperty('success');
      expect(lightTheme.colors).toHaveProperty('danger');
      expect(lightTheme.colors).toHaveProperty('warning');
      expect(lightTheme.colors).toHaveProperty('info');
      expect(lightTheme.colors).toHaveProperty('background');
      expect(lightTheme.colors).toHaveProperty('surface');
      expect(lightTheme.colors).toHaveProperty('text');
      expect(lightTheme.colors).toHaveProperty('textSecondary');
      expect(lightTheme.colors).toHaveProperty('border');
    });

    it('should have spacing definitions', () => {
      expect(lightTheme.spacing).toHaveProperty('xs');
      expect(lightTheme.spacing).toHaveProperty('sm');
      expect(lightTheme.spacing).toHaveProperty('md');
      expect(lightTheme.spacing).toHaveProperty('lg');
      expect(lightTheme.spacing).toHaveProperty('xl');
    });

    it('should have border radius definitions', () => {
      expect(lightTheme.borderRadius).toHaveProperty('none');
      expect(lightTheme.borderRadius).toHaveProperty('sm');
      expect(lightTheme.borderRadius).toHaveProperty('md');
      expect(lightTheme.borderRadius).toHaveProperty('lg');
      expect(lightTheme.borderRadius).toHaveProperty('full');
    });

    it('should have shadow definitions', () => {
      expect(lightTheme.shadows).toHaveProperty('sm');
      expect(lightTheme.shadows).toHaveProperty('md');
      expect(lightTheme.shadows).toHaveProperty('lg');
      expect(lightTheme.shadows).toHaveProperty('xl');
    });

    it('should have typography definitions', () => {
      expect(lightTheme.typography).toHaveProperty('fontFamily');
      expect(lightTheme.typography).toHaveProperty('fontSize');
      expect(lightTheme.typography).toHaveProperty('fontWeight');
    });

    it('should have light background color', () => {
      expect(lightTheme.colors.background).toBe('#ffffff');
    });

    it('should have dark text color', () => {
      expect(lightTheme.colors.text).toBe('#111827');
    });
  });

  describe('darkTheme', () => {
    it('should have correct mode', () => {
      expect(darkTheme.mode).toBe('dark');
    });

    it('should have all required colors', () => {
      expect(darkTheme.colors).toHaveProperty('primary');
      expect(darkTheme.colors).toHaveProperty('secondary');
      expect(darkTheme.colors).toHaveProperty('success');
      expect(darkTheme.colors).toHaveProperty('danger');
      expect(darkTheme.colors).toHaveProperty('warning');
      expect(darkTheme.colors).toHaveProperty('info');
      expect(darkTheme.colors).toHaveProperty('background');
      expect(darkTheme.colors).toHaveProperty('surface');
      expect(darkTheme.colors).toHaveProperty('text');
      expect(darkTheme.colors).toHaveProperty('textSecondary');
      expect(darkTheme.colors).toHaveProperty('border');
    });

    it('should have same spacing as light theme', () => {
      expect(darkTheme.spacing).toEqual(lightTheme.spacing);
    });

    it('should have same border radius as light theme', () => {
      expect(darkTheme.borderRadius).toEqual(lightTheme.borderRadius);
    });

    it('should have same typography as light theme', () => {
      expect(darkTheme.typography).toEqual(lightTheme.typography);
    });

    it('should have dark background color', () => {
      expect(darkTheme.colors.background).toBe('#111827');
    });

    it('should have light text color', () => {
      expect(darkTheme.colors.text).toBe('#f9fafb');
    });

    it('should have different shadows than light theme', () => {
      expect(darkTheme.shadows).not.toEqual(lightTheme.shadows);
    });
  });

  describe('Color Contrast', () => {
    it('should have same primary color in both themes', () => {
      expect(darkTheme.colors.primary).toBe(lightTheme.colors.primary);
    });

    it('should have same secondary color in both themes', () => {
      expect(darkTheme.colors.secondary).toBe(lightTheme.colors.secondary);
    });

    it('should have inverted background colors', () => {
      expect(lightTheme.colors.background).not.toBe(darkTheme.colors.background);
    });

    it('should have inverted text colors', () => {
      expect(lightTheme.colors.text).not.toBe(darkTheme.colors.text);
    });
  });
});
