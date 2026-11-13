"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface BorderlessInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
  badge?: React.ReactNode;
  containerClassName?: string;
}

export const BorderlessInput = forwardRef<HTMLInputElement, BorderlessInputProps>(
  (
    {
      leftIcon,
      icon,
      error,
      badge,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const renderedIcon = leftIcon || icon;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {/* Main row: official icon on left, badge + underline input on right */}
        <div className="flex items-center gap-3">
          {renderedIcon && (
            <label
              htmlFor={id}
              className="shrink-0 flex items-center justify-center cursor-pointer"
              aria-hidden="true"
            >
              {renderedIcon}
            </label>
          )}

          {/* Right column: badge on top, underline input on bottom (covers full icon height) */}
          <div
            className={`
              flex-1 min-w-0 flex flex-col justify-between
              ${badge ? "h-10" : "h-auto"}
            `}
          >
            {/* Badge indicator above the input */}
            {badge && (
              <div className="flex items-center leading-none">
                {badge}
              </div>
            )}

            {/* Borderless input: only bottom border shows */}
            <div
              className={`
                flex items-center pb-1 pt-0.5 transition-all duration-200 border-b-2 bg-transparent
                ${
                  error
                    ? "!border-red-500"
                    : "border-[#005A9C] focus-within:border-[#005A9C]"
                }
              `}
            >
              <input
                ref={ref}
                id={id}
                className={`
                  w-full bg-transparent text-slate-900 font-medium text-small-xs
                  placeholder:text-slate-400
                  border-0 outline-none focus:outline-none focus:ring-0 p-0 leading-tight
                  ${className}
                `}
                {...props}
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            id={id ? `error-${id}` : undefined}
            className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium pt-0.5"
            role="alert"
          >
            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </span>
            <span className="leading-4 text-red-500">{error}</span>
          </div>
        )}
      </div>
    );
  },
);

BorderlessInput.displayName = "BorderlessInput";
