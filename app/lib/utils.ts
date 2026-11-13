import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-micro",
        "text-micro-lg",
        "text-tiny",
        "text-tiny-lg",
        "text-tiny-xl",
        "text-small-xs",
        "text-small-sm",
        "text-section-title",
        "text-section-desc",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
