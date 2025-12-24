/**
 * Vietnamese text processing utilities
 */

/**
 * Vietnamese tone marks
 */
const VIETNAMESE_TONES = {
  a: ['a', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ'],
  e: ['e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ'],
  i: ['i', 'ì', 'í', 'ỉ', 'ĩ', 'ị'],
  o: ['o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ'],
  u: ['u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự'],
  y: ['y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ'],
  d: ['d', 'đ'],
};

/**
 * Remove Vietnamese tones/diacritics
 */
export function removeVietnameseTones(text: string): string {
  let result = text;
  
  Object.entries(VIETNAMESE_TONES).forEach(([base, variants]) => {
    variants.forEach((variant) => {
      const regex = new RegExp(variant, 'gi');
      result = result.replace(regex, (match) => {
        return match === variant ? base : base.toUpperCase();
      });
    });
  });
  
  return result;
}

/**
 * Convert to slug (URL-friendly)
 */
export function vietnameseToSlug(text: string): string {
  let str = removeVietnameseTones(text);
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9\s-]/g, '');
  str = str.trim();
  str = str.replace(/\s+/g, '-');
  str = str.replace(/-+/g, '-');
  return str;
}

/**
 * Capitalize first letter (Vietnamese-aware)
 */
export function capitalizeVietnamese(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Title case (Vietnamese-aware)
 */
export function titleCaseVietnamese(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalizeVietnamese(word))
    .join(' ');
}

/**
 * Check if text contains Vietnamese characters
 */
export function hasVietnameseCharacters(text: string): boolean {
  const vietnameseRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  return vietnameseRegex.test(text);
}

/**
 * Count Vietnamese words
 */
export function countVietnameseWords(text: string): number {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return cleaned ? cleaned.split(' ').length : 0;
}

/**
 * Truncate Vietnamese text
 */
export function truncateVietnamese(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + suffix;
  }
  
  return truncated + suffix;
}

/**
 * Highlight Vietnamese search terms
 */
export function highlightVietnameseText(
  text: string,
  searchTerm: string,
  ignoreCase: boolean = true,
  ignoreTones: boolean = true
): string {
  if (!searchTerm) return text;
  
  let processedText = text;
  let processedSearch = searchTerm;
  
  if (ignoreTones) {
    processedText = removeVietnameseTones(text);
    processedSearch = removeVietnameseTones(searchTerm);
  }
  
  const flags = ignoreCase ? 'gi' : 'g';
  const regex = new RegExp(`(${processedSearch})`, flags);
  
  // Find matches in processed text and apply to original
  const matches: Array<{ start: number; end: number }> = [];
  let match;
  
  while ((match = regex.exec(processedText)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  // Build highlighted result
  let result = '';
  let lastIndex = 0;
  
  matches.forEach(({ start, end }) => {
    result += text.substring(lastIndex, start);
    result += `<mark>${text.substring(start, end)}</mark>`;
    lastIndex = end;
  });
  
  result += text.substring(lastIndex);
  return result;
}

/**
 * Sort Vietnamese strings
 */
export function sortVietnamese(
  arr: string[],
  ascending: boolean = true
): string[] {
  return arr.sort((a, b) => {
    const aProcessed = removeVietnameseTones(a).toLowerCase();
    const bProcessed = removeVietnameseTones(b).toLowerCase();
    
    if (ascending) {
      return aProcessed.localeCompare(bProcessed, 'vi');
    } else {
      return bProcessed.localeCompare(aProcessed, 'vi');
    }
  });
}

/**
 * Vietnamese phone number formatting
 */
export function formatVietnamesePhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it starts with 84 (country code)
  if (cleaned.startsWith('84')) {
    const number = cleaned.substring(2);
    if (number.length === 9) {
      return `+84 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }
  
  // Format 10-digit Vietnamese number
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
}

/**
 * Vietnamese currency formatting
 */
export function formatVietnameseCurrency(
  amount: number,
  showSymbol: boolean = true
): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);
  return showSymbol ? `${formatted}₫` : formatted;
}

/**
 * Vietnamese date formatting
 */
export function formatVietnameseDate(
  date: Date,
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  }[format];
  
  return new Intl.DateTimeFormat('vi-VN', options).format(date);
}

/**
 * Vietnamese number to words (for amounts)
 */
export function vietnameseNumberToWords(num: number): string {
  if (num === 0) return 'không';
  
  const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const teens = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
  const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
  const thousands = ['', 'nghìn', 'triệu', 'tỷ'];
  
  // Simple implementation for numbers up to 999,999,999
  // This can be extended for larger numbers
  
  return 'Coming soon';
}
