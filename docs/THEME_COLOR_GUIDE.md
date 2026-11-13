# Project Theme & Primary Color Specification

## 1. Overview
The standardized **Primary Color** for this project is:

- **Hex Code:** `#005A9C` (Deep Ocean Blue / Classic Brand Blue)
- **RGB:** `rgb(0, 90, 156)`
- **Hover / Dark Shade:** `#004A82`
- **Light Border / Subtle Accent:** `#DBEAFE`
- **Soft Background / Tint:** `#EFF6FF`
- **Focus Ring Alpha:** `rgba(0, 90, 156, 0.2)`

---

## 2. Global CSS Token Hierarchy (`app/globals.css`)

### 2.1 Tailwind CSS v4 `@theme` Tokens
```css
@theme {
  --color-primary: #005A9C;
  --color-primary-hover: #004A82;
  --color-primary-light: #DBEAFE;
  --color-primary-lighter: #EFF6FF;
  --color-brand-blue: #005A9C;
  --color-brand-cyan: #06B6D4;
  --color-accent-primary: var(--accent-primary);
  --background-image-gradient-brand: linear-gradient(90deg, #06B6D4 0%, #005A9C 100%);
  --background-image-gradient-heading: linear-gradient(90deg, #06B6D4 0%, #005A9C 100%);
}
```

### 2.2 Global Root Tokens (`:root`)
```css
:root {
  --primary: #005A9C;
  --primary-hover: #004A82;
  --primary-rgb: 0, 90, 156;
  --primary-light: #DBEAFE;
  --primary-lighter: #EFF6FF;
  --brand-blue: #005A9C;
  --accent-primary: #005A9C;
  --accent-primary-hover: #004A82;
  --brand-ocean: #005A9C;
  --brand-gradient: linear-gradient(90deg, #06B6D4 0%, #005A9C 100%);
  --heading-gradient: linear-gradient(90deg, #06B6D4 0%, #005A9C 100%);
}
```

### 2.3 Global Utility Classes
```css
.text-primary, @utility text-primary {
  color: var(--primary, #005A9C);
}

.bg-primary, @utility bg-primary {
  background-color: var(--primary, #005A9C);
}

.border-primary, @utility border-primary {
  border-color: var(--primary, #005A9C);
}

.text-brand-blue {
  color: var(--brand-blue, #005A9C);
}

.border-brand-blue {
  border-color: var(--brand-blue, #005A9C);
}

.bg-brand-blue {
  background-color: var(--brand-blue, #005A9C);
}
```

---

## 3. Onboarding Page Style Guidelines (`/onboarding`)

In accordance with project branding, all headers, section titles, and icons on the onboarding pages (`/onboarding`, `/onboarding/client`, `/onboarding/vendor`) strictly conform to `#005A9C`:

| Element | Applied Style | Color Code / Token |
|---------|---------------|-------------------|
| **Page Header Title** (`OnboardingPageHeader`) | `text-2xl sm:text-3xl font-semibold text-[#005A9C]` | `#005A9C` |
| **Page Header Eyebrow** (`OnboardingPageHeader`) | `text-xs sm:text-[13px] font-semibold text-[#005A9C]` | `#005A9C` |
| **Section Heading Title** (`SectionHeading`, `SectionHeader`) | `text-[0.9rem] font-semibold text-black` | `#000000` (Black, `0.9rem`) |
| **Section Icons** (`SectionHeading`, `SectionHeader`) | `text-[#005A9C]` | `#005A9C` |
| **Form Field Labels** (`InputField`, `TextareaField`, `MultiSelect`, `SingleSelectSearch`, etc.) | Clean label text without label icons | Neutral text-slate-700 |
| **Input Focus Ring & Border** | `focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20` | `#005A9C` |
| **Selected Option Background** (`SelectContent`, `CountrySelectSearch`) | `bg-[#EFF6FF] text-[#005A9C] border-[#DBEAFE]` | `#EFF6FF` / `#005A9C` |
| **Active Navigation Step / Sidebar** (`SectionNavSidebar`, `Stepper`) | `bg-[#EFF6FF] text-[#005A9C]` / active indicator `bg-[#005A9C]` | `#005A9C` |
| **Checkbox / Radio Checked** (`CheckboxField`, `RadioField`) | `bg-[#005A9C] border-[#005A9C]` | `#005A9C` |
| **Form Action Buttons** (`StickyFooterActions`) | `bg-gradient-to-r from-[#005A9C] to-cyan-400 hover:from-[#004A82]` | Gradient with `#005A9C` base |
| **Loading Skeletons** (`OnboardingSkeleton`) | Shimmer accents in `bg-[#005A9C]/20` and `bg-[#EFF6FF]` | `#005A9C` tints |

---

## 4. Theme Engine Integration (`app/themes.ts`)
The default `"deep-space"` theme in `themes.ts` sets `--primary` and `--accent-primary` to `#005A9C` and `--accent-primary-hover` to `#004A82`, ensuring theme switching maintains the primary brand blue identity across both SSR and client-side hydration.
