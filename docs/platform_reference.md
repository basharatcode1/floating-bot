# Platform Reference Guide

This document stores the configuration, branding, and structural information of the staffing platform. Refer to this file whenever updating branding assets, renaming the platform, or modifying the theme.

---

## 1. Branding & Name Configuration
* **Current Platform Name:** `StaffSync`
* **Core Value Proposition:** Connecting companies with elite developers, engineers, and tech experts, matching and hiring within 48 hours.

### Brand Name Occurrences
If you need to rename the platform, update the name in the following locations:
1. **Metadata & SEO:** [`app/page.tsx`](file:///c:/theme-color/app/page.tsx) and [`app/layout.tsx`](file:///c:/theme-color/app/layout.tsx).
2. **Navigation Header:** [`app/components/Navbar.tsx`](file:///c:/theme-color/app/components/Navbar.tsx).
3. **Hero Section:** [`app/components/Hero.tsx`](file:///c:/theme-color/app/components/Hero.tsx).
4. **Footer:** [`app/components/Footer.tsx`](file:///c:/theme-color/app/components/Footer.tsx).

---

## 2. Technical Architecture & Tech Stack
* **Framework:** Next.js App Router.
* **Language:** TypeScript first, with `.ts` for utilities/data and `.tsx` for components that render JSX.
* **Styling System:** Vanilla CSS custom theme variables in [`app/globals.css`](file:///c:/theme-color/app/globals.css) paired with Tailwind CSS utility classes.
* **Transitions & Animations:** Scroll-linked theme detection, a shared theme provider, and Framer Motion for select animated sections.

---

## 3. Theme & Colors (Deep Space)
The default theme is **Deep Space** with dynamic light-to-dark scrolling behavior:
* **Dark Background:** `#080D17` (`var(--dark-bg)`)
* **Dark Accent Background:** `#0E1524` (`var(--dark-bg-alt)`)
* **Light Background:** `#FAFAFB` (`var(--light-bg)`)
* **Accent Primary (Indigo):** `#6366F1` (`var(--accent-primary)`)
* **Accent Secondary (Cyan):** `#06B6D4` (`var(--accent-secondary)`)
* **Brand Gradient:** `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`

---

## 4. Key Implementation Notes
* The root theme is applied through [`app/themes.ts`](file:///c:/theme-color/app/themes.ts).
* Shared theme state lives in [`app/ThemeContext.tsx`](file:///c:/theme-color/app/ThemeContext.tsx).
* The main landing experience is composed in [`app/page.tsx`](file:///c:/theme-color/app/page.tsx) from shared sections in [`app/components`](file:///c:/theme-color/app/components).
* Carousel and section data live in [`app/data`](file:///c:/theme-color/app/data).

---

## 5. Maintenance Notes
* When adding a new shared section, prefer a typed `.tsx` component and keep its data in a `.ts` module if the content is reused.
* Use `currentTarget` in hover handlers when mutating inline styles.
* Keep browser-only logic behind `"use client"` components.
* After structural changes, verify the app with `npm run build`.

