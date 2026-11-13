"use client";

import { forwardRef, memo, useCallback, useId, useEffect, useRef } from "react";
import PhoneInput, { type Value } from "react-phone-number-input";
import type { CountryCode } from "libphonenumber-js";
import { AlertCircle } from "lucide-react";
import "react-phone-number-input/style.css";
import "./phone-number-field.css";
import type { PhoneNumberFieldProps } from "@/app/onboarding/types/phone";
import { CountrySelectSearch } from "@/app/onboarding/components/CountrySelectSearch";
import {
  getMaxDigitsForCountry,
  truncateToCountryLimit,
  getCountryCallingCode,
  getMaxFormattedLengthForCountry,
} from "@/app/onboarding/utils/phone";

export const PhoneNumberField = memo(
  forwardRef<HTMLInputElement, PhoneNumberFieldProps>(
    (
      {
        name,
        label,
        placeholder = "98765 43210",
        required = false,
        disabled = false,
        defaultCountry = "IN",
        error,
        helperText,
        value,
        countryValue,
        onChange,
        onCountryChange,
        onBlur,
        leftIcon,
        className = "",
        action,
      },
      ref,
    ) => {
      const generatedId = useId();
      const inputId = `field-${name || generatedId}`;
      const errorId = `error-${name || generatedId}`;
      const helperId = `helper-${name || generatedId}`;

      const country = countryValue ?? defaultCountry;
      const maxInputLength = getMaxFormattedLengthForCountry(country);
      const maxDigits = getMaxDigitsForCountry(country);
      const callingCode = getCountryCallingCode(country);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (/^\d$/.test(e.key)) {
            const currentValue = e.currentTarget.value || "";
            const digitCount = currentValue.replace(/\D/g, "").length;
            const allowedDigitCount = callingCode.length + maxDigits;

            const selectionStart = e.currentTarget.selectionStart ?? 0;
            const selectionEnd = e.currentTarget.selectionEnd ?? 0;
            const isOverwriting = selectionStart !== selectionEnd;

            if (digitCount >= allowedDigitCount && !isOverwriting) {
              e.preventDefault();
            }
          }
        },
        [callingCode, maxDigits],
      );

      const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
          const pastedText = e.clipboardData.getData("text") || "";
          const currentValue = e.currentTarget.value || "";

          const pastedDigits = pastedText.replace(/\D/g, "");
          if (!pastedDigits) return;

          const selectionStart = e.currentTarget.selectionStart ?? 0;
          const selectionEnd = e.currentTarget.selectionEnd ?? 0;

          const valueWithoutSelection =
            currentValue.slice(0, selectionStart) +
            currentValue.slice(selectionEnd);
          const currentDigits = valueWithoutSelection.replace(/\D/g, "");

          const allowedDigitCount = callingCode.length + maxDigits;

          if (currentDigits.length + pastedDigits.length > allowedDigitCount) {
            e.preventDefault();
            const remainingSlots = allowedDigitCount - currentDigits.length;

            if (remainingSlots > 0) {
              const truncatedPaste = pastedDigits.slice(0, remainingSlots);
              const input = e.currentTarget;
              const newRawValue =
                currentValue.slice(0, selectionStart) +
                truncatedPaste +
                currentValue.slice(selectionEnd);

              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value",
              )?.set;
              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(input, newRawValue);
                input.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }
          }
        },
        [callingCode, maxDigits],
      );

      const onChangeRef = useRef(onChange);
      useEffect(() => {
        onChangeRef.current = onChange;
      }, [onChange]);

      // Truncate existing value if it exceeds the limit of the selected country
      useEffect(() => {
        if (value && country) {
          const truncated = truncateToCountryLimit(value, country);
          if (truncated && truncated !== value) {
            onChangeRef.current?.(truncated);
          }
        }
      }, [country, value]);

      const handleChange = useCallback(
        (val?: Value) => {
          const cleanedVal = val
            ? truncateToCountryLimit(val as string, country)
            : undefined;
          onChange?.(cleanedVal);
        },
        [onChange, country],
      );

      const handleCountryChange = useCallback(
        (newCountry?: CountryCode) => {
          if (newCountry) {
            onCountryChange?.(newCountry);
          }
        },
        [onCountryChange],
      );

      return (
        <div
          className={`space-y-1.5 ${className}`}
          data-field={name}
        >
          {/* Field Label */}
          {label && (
            <label
              htmlFor={inputId}
              className="inline-flex items-center text-xs font-medium text-slate-700"
            >
              <span>{label}</span>
              {required && (
                <span
                  className="text-rose-500 font-bold text-xs"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {/* Phone Input Container */}
          <div className={action ? "flex items-center gap-2" : undefined}>
            <div className={`phone-field-wrapper ${action ? "flex-1" : ""}`}>
              <PhoneInput
                ref={ref as any}
                international
                withCountryCallingCode
                defaultCountry={defaultCountry}
                country={countryValue}
                value={
                  (value && !String(value).startsWith("+")
                    ? `+${countryValue ? getCountryCallingCode(countryValue) : getCountryCallingCode(defaultCountry)}${String(value).replace(/\D/g, "")}`
                    : (value as Value)) || ""
                }
                onChange={handleChange}
                onCountryChange={handleCountryChange}
                disabled={disabled}
                placeholder={placeholder}
                countrySelectComponent={CountrySelectSearch as any}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                aria-required={required}
                numberInputProps={{
                  id: inputId,
                  name: name,
                  onBlur: onBlur,
                  className: "PhoneInputInput",
                  maxLength: maxInputLength,
                  onKeyDown: handleKeyDown,
                  onPaste: handlePaste,
                  "aria-label": label || placeholder || "Phone number",
                }}
                className={`PhoneInput ${error ? "PhoneInput--error" : ""} ${
                  disabled ? "PhoneInput--disabled" : ""
                }`}
              />
            </div>
            {action}
          </div>

          {/* Validation Error Message */}
          {error && (
            <div
              id={errorId}
              className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium"
              role="alert"
            >
              <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              </span>
              <span className="leading-4">{error}</span>
            </div>
          )}
        </div>
      );
    },
  ),
);

PhoneNumberField.displayName = "PhoneNumberField";
