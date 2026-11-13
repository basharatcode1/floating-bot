import type { CountryCode } from "libphonenumber-js";

export interface PhoneFieldValue {
  phone: string; // E.164 format, e.g. "+919876543210"
  phoneCountry: CountryCode; // ISO 3166-1 alpha-2, e.g. "IN"
}

export interface PhoneNumberFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: CountryCode;
  error?: string;
  helperText?: string;
  value?: string;
  countryValue?: CountryCode;
  onChange?: (value: string | undefined) => void;
  onCountryChange?: (country: CountryCode) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}
