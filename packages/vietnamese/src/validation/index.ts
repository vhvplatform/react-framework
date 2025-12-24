/**
 * Vietnamese validation utilities
 */

/**
 * Validate Vietnamese phone number
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if starts with 84 (country code) and has 11 digits
  if (cleaned.startsWith('84') && cleaned.length === 11) {
    return true;
  }
  
  // Check if starts with 0 and has 10 digits
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const prefix = cleaned.substring(0, 3);
    const validPrefixes = ['032', '033', '034', '035', '036', '037', '038', '039',
                           '070', '076', '077', '078', '079',
                           '081', '082', '083', '084', '085',
                           '086', '088', '089', '090', '091', '092', '093',
                           '094', '096', '097', '098', '099', '056', '058', '059'];
    return validPrefixes.includes(prefix);
  }
  
  return false;
}

/**
 * Validate Vietnamese ID card number (CMND/CCCD)
 */
export function isValidVietnameseIDCard(id: string): boolean {
  const cleaned = id.replace(/\s/g, '');
  
  // Old CMND: 9 digits
  if (/^\d{9}$/.test(cleaned)) {
    return true;
  }
  
  // New CCCD: 12 digits
  if (/^\d{12}$/.test(cleaned)) {
    return true;
  }
  
  return false;
}

/**
 * Validate Vietnamese tax code (MST)
 */
export function isValidVietnameseTaxCode(taxCode: string): boolean {
  const cleaned = taxCode.replace(/[-\s]/g, '');
  
  // 10 digits or 10 digits + 3 digits for branches
  return /^\d{10}(-\d{3})?$/.test(cleaned) || /^\d{10}\d{3}?$/.test(cleaned);
}

/**
 * Validate Vietnamese postal code
 */
export function isValidVietnamesePostalCode(postalCode: string): boolean {
  const cleaned = postalCode.replace(/\s/g, '');
  return /^\d{6}$/.test(cleaned);
}

/**
 * Validate Vietnamese name
 */
export function isValidVietnameseName(name: string): boolean {
  // Vietnamese names can contain letters, spaces, and Vietnamese characters
  const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
  return vietnameseNameRegex.test(name.trim());
}

/**
 * Validate Vietnamese bank account number
 */
export function isValidVietnameseBankAccount(accountNumber: string): boolean {
  const cleaned = accountNumber.replace(/\s/g, '');
  // Vietnamese bank accounts are typically 6-19 digits
  return /^\d{6,19}$/.test(cleaned);
}
