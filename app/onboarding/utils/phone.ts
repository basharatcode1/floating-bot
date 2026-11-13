import {
  isValidPhoneNumber,
  parsePhoneNumber,
  getCountryCallingCode as libGetCountryCallingCode,
  type CountryCode,
  type NumberFormat,
  getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile";

/**
 * Validates a phone number using libphonenumber-js.
 * Returns true if the phone number is valid according to international/country standards.
 */
export function validatePhoneNumber(phoneNumber?: string): boolean {
  if (!phoneNumber || phoneNumber.trim() === "") return false;
  try {
    return isValidPhoneNumber(phoneNumber);
  } catch {
    return false;
  }
}

/**
 * Formats a phone number for display.
 * Default format is INTERNATIONAL (e.g. "+91 98765 43210").
 */
export function formatPhoneDisplay(
  phoneNumber?: string,
  country?: CountryCode,
  format: NumberFormat = "INTERNATIONAL"
): string {
  if (!phoneNumber) return "";
  try {
    const parsed = parsePhoneNumber(phoneNumber, country);
    return parsed ? parsed.format(format) : phoneNumber;
  } catch {
    return phoneNumber;
  }
}

/**
 * Gets the calling code for a given country code (e.g., "IN" -> "91").
 */
export function getCountryCallingCode(country: CountryCode): string {
  try {
    return libGetCountryCallingCode(country);
  } catch {
    return "";
  }
}

/**
 * Ensures a phone string is formatted as E.164 (e.g., "+919876543210").
 */
export function parsePhoneToE164(
  phoneNumber?: string,
  country?: CountryCode
): string {
  if (!phoneNumber) return "";
  try {
    const parsed = parsePhoneNumber(phoneNumber, country);
    return parsed ? parsed.number : phoneNumber;
  } catch {
    return phoneNumber;
  }
}

/**
 * Returns the maximum standard national mobile number digit count for a country code.
 * Falls back to 15 (E.164 standard limit) if not found or empty.
 */
export function getMaxDigitsForCountry(country?: CountryCode): number {
  if (!country) return 15;
  try {
    const example = getExampleNumber(country, examples);
    if (example && example.nationalNumber) {
      return example.nationalNumber.length;
    }
  } catch {
    // Ignore error and fallback
  }
  return 15;
}

/**
 * Truncates an E.164 phone number to the maximum allowed digits for the specified country.
 */
export function truncateToCountryLimit(
  value: string | undefined,
  country?: CountryCode
): string | undefined {
  if (!value || !country) return value;
  try {
    const callingCode = getCountryCallingCode(country);
    const prefix = `+${callingCode}`;
    if (value.startsWith(prefix)) {
      const rawNational = value.slice(prefix.length);
      const digitsOnly = rawNational.replace(/\D/g, "");
      const maxDigits = getMaxDigitsForCountry(country);
      if (digitsOnly.length > maxDigits) {
        return prefix + digitsOnly.slice(0, maxDigits);
      }
    }
  } catch {
    // Ignore error
  }
  return value;
}

/**
 * Returns the maximum formatted international string length for a country code.
 * Adds a small buffer to avoid cutting off valid formatting variants.
 */
export function getMaxFormattedLengthForCountry(country?: CountryCode): number {
  if (!country) return 20;
  try {
    const example = getExampleNumber(country, examples);
    if (example) {
      const formatted = example.format("INTERNATIONAL");
      return formatted.length + 1;
    }
  } catch {
    // Ignore error and fallback
  }
  // Safe fallback: callingCode + space + maxDigits + formatting buffer
  const maxDigits = getMaxDigitsForCountry(country);
  const callingCode = getCountryCallingCode(country);
  return 1 + callingCode.length + 1 + maxDigits + 5;
}



