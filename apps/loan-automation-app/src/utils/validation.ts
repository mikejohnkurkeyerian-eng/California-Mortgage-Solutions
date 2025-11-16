/**
 * Validation utilities for loan application form
 */

// Email validation with format and domain check
export const validateEmail = (email: string): {valid: boolean; error?: string} => {
  if (!email) {
    return {valid: false, error: 'Email is required'};
  }

  // Basic email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {valid: false, error: 'Please enter a valid email address'};
  }

  // Check for common invalid domains
  const invalidDomains = ['test.com', 'example.com', 'invalid.com', 'test.test'];
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && invalidDomains.includes(domain)) {
    return {valid: false, error: 'Please use a real email address'};
  }

  // Check for common valid email providers (basic domain validation)
  const validDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com',
    'icloud.com', 'mail.com', 'protonmail.com', 'live.com', 'msn.com',
    'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net',
    'charter.net', 'earthlink.net', 'juno.com', 'aim.com', 'bellsouth.net',
    'company', 'corp', 'org', 'edu', 'gov', 'net', 'io', 'co'
  ];

  // Allow common TLDs or specific known providers
  const hasValidTLD = domain && (
    validDomains.some(vd => domain === vd || domain.endsWith('.' + vd)) ||
    /\.(com|net|org|edu|gov|io|co|us|ca|uk)$/.test(domain)
  );

  if (!hasValidTLD) {
    return {valid: false, error: 'Please enter a valid email address with a real domain'};
  }

  return {valid: true};
};

// Phone number validation and formatting
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 10 digits
  if (numbers.length > 10) {
    return formatPhoneNumber(numbers.slice(0, 10));
  }

  // Format: (XXX) XXX-XXXX
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

export const validatePhoneNumber = (phone: string): {valid: boolean; error?: string} => {
  if (!phone) {
    return {valid: false, error: 'Phone number is required'};
  }

  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length !== 10) {
    return {valid: false, error: 'Phone number must be 10 digits'};
  }

  // Check for invalid patterns (all same digit, all zeros, etc.)
  if (/^(\d)\1{9}$/.test(numbers)) {
    return {valid: false, error: 'Please enter a valid phone number'};
  }

  return {valid: true};
};

// Date of birth formatting with forced slashes
export const formatDateOfBirth = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 8 digits (MMDDYYYY)
  if (numbers.length > 8) {
    return formatDateOfBirth(numbers.slice(0, 8));
  }

  // Format: MM/DD/YYYY
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

export const validateDateOfBirth = (dob: string): {valid: boolean; error?: string} => {
  if (!dob) {
    return {valid: false, error: 'Date of birth is required'};
  }

  const numbers = dob.replace(/\D/g, '');
  
  if (numbers.length !== 8) {
    return {valid: false, error: 'Date must be in MM/DD/YYYY format'};
  }

  const month = parseInt(numbers.slice(0, 2), 10);
  const day = parseInt(numbers.slice(2, 4), 10);
  const year = parseInt(numbers.slice(4, 8), 10);

  if (month < 1 || month > 12) {
    return {valid: false, error: 'Month must be between 01 and 12'};
  }

  if (day < 1 || day > 31) {
    return {valid: false, error: 'Day must be between 01 and 31'};
  }

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear - 18) {
    return {valid: false, error: 'You must be at least 18 years old'};
  }

  // Basic date validity check
  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
    return {valid: false, error: 'Invalid date'};
  }

  return {valid: true};
};

// Address validation
export const validateStreetAddress = (street: string): {valid: boolean; error?: string} => {
  if (!street || street.trim().length < 5) {
    return {valid: false, error: 'Street address must be at least 5 characters'};
  }

  // Check for at least one number and one letter
  if (!/\d/.test(street) || !/[a-zA-Z]/.test(street)) {
    return {valid: false, error: 'Street address must include a number and street name'};
  }

  return {valid: true};
};

export const validateCity = (city: string): {valid: boolean; error?: string} => {
  if (!city || city.trim().length < 2) {
    return {valid: false, error: 'City name must be at least 2 characters'};
  }

  // Check for only letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(city)) {
    return {valid: false, error: 'City name can only contain letters, spaces, hyphens, and apostrophes'};
  }

  return {valid: true};
};

export const validateZipCode = (zip: string): {valid: boolean; error?: string} => {
  if (!zip) {
    return {valid: false, error: 'ZIP code is required'};
  }

  if (!/^\d{5}$/.test(zip)) {
    return {valid: false, error: 'ZIP code must be 5 digits'};
  }

  return {valid: true};
};

// Employer name validation
export const validateEmployerName = (employerName: string): {valid: boolean; error?: string} => {
  if (!employerName || employerName.trim().length < 2) {
    return {valid: false, error: 'Employer name must be at least 2 characters'};
  }

  // Check for valid company name format (letters, numbers, spaces, common business suffixes)
  if (!/^[a-zA-Z0-9\s.,&-]+$/.test(employerName)) {
    return {valid: false, error: 'Employer name contains invalid characters'};
  }

  // Check for common invalid patterns
  const invalidPatterns = ['test', 'example', 'company', 'business', 'employer'];
  const lowerName = employerName.toLowerCase();
  if (invalidPatterns.some(pattern => lowerName === pattern || lowerName.includes(pattern + ' '))) {
    return {valid: false, error: 'Please enter a real employer name'};
  }

  return {valid: true};
};

