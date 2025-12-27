import { describe, it, expect } from 'vitest';
import {
  removeVietnameseTones,
  vietnameseToSlug,
  titleCaseVietnamese,
  hasVietnameseCharacters,
  sortVietnamese,
} from '@vhvplatform/vietnamese';

describe('Vietnamese Text Utils', () => {
  describe('removeVietnameseTones', () => {
    it('should remove Vietnamese tones', () => {
      expect(removeVietnameseTones('Xin chào')).toBe('Xin chao');
      expect(removeVietnameseTones('Việt Nam')).toBe('Viet Nam');
      expect(removeVietnameseTones('Tiếng Việt')).toBe('Tieng Viet');
    });

    it('should handle text without tones', () => {
      expect(removeVietnameseTones('Hello')).toBe('Hello');
      expect(removeVietnameseTones('123')).toBe('123');
    });

    it('should handle empty string', () => {
      expect(removeVietnameseTones('')).toBe('');
    });

    it('should handle all Vietnamese characters', () => {
      expect(removeVietnameseTones('áàảãạăắằẳẵặâấầẩẫậ')).toBe('aaaaaaaaaaaaaaaaa'); // 17 a's
      expect(removeVietnameseTones('éèẻẽẹêếềểễệ')).toBe('eeeeeeeeeee'); // 11 e's
      expect(removeVietnameseTones('íìỉĩị')).toBe('iiiii');
      expect(removeVietnameseTones('óòỏõọôốồổỗộơớờởỡợ')).toBe('ooooooooooooooooo'); // 17 o's
      expect(removeVietnameseTones('úùủũụưứừửữự')).toBe('uuuuuuuuuuu'); // 11 u's
      expect(removeVietnameseTones('ýỳỷỹỵ')).toBe('yyyyy');
      expect(removeVietnameseTones('đ')).toBe('d');
    });
  });

  describe('vietnameseToSlug', () => {
    it('should convert Vietnamese to URL-friendly slug', () => {
      expect(vietnameseToSlug('Xin chào Việt Nam')).toBe('xin-chao-viet-nam');
      expect(vietnameseToSlug('Tiếng Việt')).toBe('tieng-viet');
      expect(vietnameseToSlug('Hà Nội')).toBe('ha-noi');
    });

    it('should handle special characters', () => {
      expect(vietnameseToSlug('Hello & World!')).toBe('hello-world');
      expect(vietnameseToSlug('Test/Value')).toBe('test-value');
    });

    it('should handle multiple spaces', () => {
      expect(vietnameseToSlug('Hello    World')).toBe('hello-world');
    });

    it('should convert to lowercase', () => {
      expect(vietnameseToSlug('HELLO WORLD')).toBe('hello-world');
    });
  });

  describe('titleCaseVietnamese', () => {
    it('should capitalize each word', () => {
      expect(titleCaseVietnamese('xin chào việt nam')).toBe('Xin Chào Việt Nam');
      expect(titleCaseVietnamese('tiếng việt')).toBe('Tiếng Việt');
    });

    it('should handle already title-cased text', () => {
      expect(titleCaseVietnamese('Xin Chào')).toBe('Xin Chào');
    });
  });

  describe('hasVietnameseCharacters', () => {
    it('should detect Vietnamese characters', () => {
      expect(hasVietnameseCharacters('Xin chào')).toBe(true);
      expect(hasVietnameseCharacters('Việt Nam')).toBe(true);
      expect(hasVietnameseCharacters('đường')).toBe(true);
    });

    it('should return false for non-Vietnamese text', () => {
      expect(hasVietnameseCharacters('Hello')).toBe(false);
      expect(hasVietnameseCharacters('123')).toBe(false);
    });

    it('should handle mixed text', () => {
      expect(hasVietnameseCharacters('Hello Việt Nam')).toBe(true);
    });
  });

  describe('sortVietnamese', () => {
    it('should sort Vietnamese text correctly', () => {
      const input = ['Đà Nẵng', 'Hà Nội', 'Cần Thơ', 'Sài Gòn'];
      const sorted = sortVietnamese(input);
      expect(sorted[0]).toBe('Cần Thơ');
      expect(sorted[sorted.length - 1]).toBe('Sài Gòn');
    });

    it('should handle empty array', () => {
      expect(sortVietnamese([])).toEqual([]);
    });

    it('should not mutate original array', () => {
      const input = ['B', 'A', 'C'];
      const original = [...input];
      sortVietnamese(input);
      expect(input).toEqual(original);
    });
  });
});
