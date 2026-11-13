"use client";

import { useCallback } from "react";
import type { CountryCode } from "libphonenumber-js";
import { parsePhoneToE164 } from "@/app/onboarding/utils/phone";

interface UsePhoneFieldOptions {
  setValue: (
    name: string,
    value: any,
    options?: { shouldDirty?: boolean; shouldValidate?: boolean }
  ) => void;
  phoneFieldName?: string;
  countryFieldName?: string;
  defaultCountry?: CountryCode;
}

export function usePhoneField({
  setValue,
  phoneFieldName = "mobileNumber",
  countryFieldName = "phoneCountry",
  defaultCountry = "IN",
}: UsePhoneFieldOptions) {
  const handlePhoneChange = useCallback(
    (val: string | undefined) => {
      const e164 = val ? parsePhoneToE164(val) : "";
      setValue(phoneFieldName, e164, { shouldValidate: true, shouldDirty: true });
    },
    [setValue, phoneFieldName]
  );

  const handleCountryChange = useCallback(
    (country: CountryCode) => {
      setValue(countryFieldName, country, { shouldValidate: true, shouldDirty: true });
    },
    [setValue, countryFieldName]
  );

  return {
    handlePhoneChange,
    handleCountryChange,
    defaultCountry,
  };
}
