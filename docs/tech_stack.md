# [PROJECT_NAME] — Technology Stack & Architecture Documentation

> Replace `[PROJECT_NAME]` with the final project/product name.

## 1. Core Framework & Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.7 | Full-stack React framework with App Router, Server Components, and built-in optimizations |
| **React** | 19.2.4 | UI library for building component-based interfaces |
| **TypeScript** | 6.0.3 | Static type checking and enhanced developer experience |

**Key Next.js Config Notes:**
- Uses `next.config.mjs` with `next-video/process` wrapper for video asset processing
- App Router architecture (`app/` directory)
- Path alias configured: `@/*` maps to project root (`tsconfig.json` paths)

---

## 2. Styling & Design System

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | v4 | Utility-first CSS framework |
| **@tailwindcss/postcss** | ^4 | PostCSS plugin for Tailwind v4 |
| **PostCSS** | Built-in | CSS transformation pipeline |

**Design System Characteristics:**
- **Primary Color Standard**: `#005A9C` (Deep Ocean Blue) is designated as the core primary color across all UI themes, input focus rings, headings, icons, and `@theme` tokens. See `docs/THEME_COLOR_GUIDE.md` for full specifications.
- **Theming via CSS Custom Properties**: Global theme variables defined in `globals.css` under `:root`
- **Theme Context**: `ThemeContext.tsx` + `themes.ts` manage dynamic theme switching (e.g., "deep-space")
- **CSS Variables Used**:
  - Primary: `--primary` (`#005A9C`), `--primary-hover` (`#004A82`), `--primary-light` (`#DBEAFE`), `--primary-lighter` (`#EFF6FF`)
  - Backgrounds: `--dark-bg`, `--dark-bg-alt`, `--light-bg`, `--light-bg-alt`
  - Accents: `--accent-primary` (`#005A9C`), `--accent-secondary`, `--accent-success`
  - Text: `--text-on-dark`, `--text-on-dark-muted`, `--text-on-light`, `--text-on-light-muted`
  - Cards: `--card-dark`, `--card-dark-border`, `--card-light`, `--card-light-border`
  - Gradients: `--gradient-from` (`#005A9C`), `--gradient-to` (`#06B6D4`)
  - Brand: `--brand-blue` (`#005A9C`), `--brand-cyan` (`#06B6D4`)
- **Smooth Transitions**: `.theme-transition` utility class applies 0.8s cubic-bezier transitions to theme changes
- **Typography**: Inter font family (weights 300–900) loaded from Google Fonts
- **Scrollbar**: Custom webkit scrollbar styled with accent colors
- **Animations**: Keyframes for `marquee` (infinite scroll) and `fadeInUp` (entrance animations)

**Utility Functions:**
- `cn()` in `lib/utils.ts` combines `clsx` (conditional classes) + `tailwind-merge` (conflict resolution)

---

## 3. UI Component Library

### 3.1 Base Components (`app/components/ui/`)

Built on **Radix UI** primitives for accessibility and unstyled behavior:

| Component | Radix Primitive | Tailwind Styling |
|-----------|----------------|------------------|
| `button.tsx` | `@radix-ui/react-slot` | CVA variants: default, outline, ghost; sizes: sm, default, lg, icon |
| `card.tsx` | — | Container with dark/light theme support |
| `dialog.tsx` | `@radix-ui/react-dialog` | Modal dialogs with overlay, header, footer |
| `accordion.tsx` | `@radix-ui/react-accordion` | Collapsible content sections |
| `collapsible.tsx` | `@radix-ui/react-collapsible` | Generic collapsible wrapper |
| `select.tsx` | `@radix-ui/react-select` | Dropdown select with custom styling |
| `input.tsx` | — | Form input with theme-aware borders |
| `textarea.tsx` | — | Multi-line text input |
| `table.tsx` | — | Data table component |
| `confirmation-dialog.tsx` | — | Reusable confirm/cancel dialog |
| `empty-state.tsx` | — | Placeholder for empty data sets |
| `HeroCursor.tsx` | — | Custom cursor effect for hero section |
| `toast.tsx` & `toaster.tsx` | — | Global custom toast notification system with progress bar and Framer Motion |

**Styling Pattern**: All components use `cn()` for class merging and support theme transitions via CSS variables.

---

## 4. Animation & Motion

| Technology | Version | Usage |
|------------|---------|-------|
| **Framer Motion** | 12.40.0 | Declarative animations, gestures, layout animations |

**Usage Patterns:**
- `motion.button` for animated buttons with spring physics
- `whileTap`, `animate`, `transition` for interactive states
- Page transitions and scroll-triggered animations
- Used in: `FluidButton.tsx`, `Hero.tsx`, onboarding stepper, dashboard cards

---

## 5. Icons & Graphics

| Technology | Version | Purpose |
|------------|---------|---------|
| **lucide-react** | 1.21.0 | Consistent icon system (300+ icons) |

Used extensively across navigation, dashboard, forms, and marketing components.

---

## 6. Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Formik** | 2.4.9 | Form state management, validation, submission |
| **Zod** | 4.4.3 | Schema-based validation |
| **react-phone-number-input** | ^3.4.12 | International phone input component with country dropdown & flags |
| **libphonenumber-js** | ^1.11.20 | Phone number parsing, formatting, and country-specific E.164 validation |

**Onboarding Form Architecture** (`app/onboarding/`):
- Custom `useMultiStepForm` hook wraps Formik + Zod for multi-step wizards
- Step schemas validated independently
- Auto-save via `useAutoSave` hook
- Unsaved changes detection via `useUnsavedChanges`
- Client and vendor onboarding have separate schemas (`client.schema.ts`, `vendor.schema.ts`)

---

## 7. Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Highcharts** | 13.0.0 | Interactive charts |
| **highcharts-react-official** | 3.2.3 | React wrapper for Highcharts |

**Initialization**: Custom `highcharts-init.ts` configures global Highcharts options and theme settings.

---

## 8. 3D & Advanced Visuals

| Technology | Version | Purpose |
|------------|---------|---------|
| **Three.js** | 0.185.1 | 3D graphics and WebGL rendering |
| **@bible-strong/avatar-react** | 0.1.0 | Procedural pseudo-3D SVG avatar runtime (`Strobi`) used in onboarding focus-driven field guidance |

Used in `HeroThree.tsx` for immersive 3D hero backgrounds and in `app/client/requirements/components/hiring-studio/RobotScene.tsx` (`GLTFLoader` + `OrbitControls` + `RoomEnvironment`) for the interactive 360°-rotatable Hiring Studio Step 1 welcome modal. `@bible-strong/avatar-react` powers `StrobiAvatar` / `OnboardingGuideMascot` (`app/onboarding/components/`) to glide toward whichever onboarding field the user focuses and show contextual filling tips (`idle`, `listening`, `curious`).

---

## 9. Smooth Scrolling & Carousel

| Technology | Version | Purpose |
|------------|---------|---------|
| **Lenis** | 1.3.23 | Smooth inertia scrolling |
| **Embla Carousel React** | 8.6.0 | Accessible carousel/slider |

`SmoothScroll` wraps the app to provide buttery-smooth scrolling. `HeroCarousel.tsx` uses Embla for testimonial/content carousels.

---

## 10. Media & Asset Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **next-video** | 2.8.1 | Optimized video loading and processing |
| **file-saver** | 2.0.5 | Client-side file download utility |
| **jspdf** | ^4.2.1 | Client-side PDF document generation |

**Video Strategy**: Hero section conditionally loads video backgrounds based on device capability (mobile, reduced motion, low-power detection).

---

## 11. State Management

| Pattern | Implementation |
|---------|---------------|
| **Global Theme** | React Context (`ThemeContext`) + CSS variables |
| **Dashboard Theme** | Separate `DashboardThemeContext` for dark/light mode toggle with localStorage persistence |
| **Local State** | React `useState` / `useReducer` for component-level state |
| **Form State** | Formik handles complex multi-step form state |

**No Redux/Zustand/Recoil** — state is managed via Context + hooks.

---

## 12. Routing & Navigation

| Feature | Implementation |
|---------|---------------|
| **Router** | Next.js App Router (`next/navigation`) |
| **Navigation Links** | `next/link` for client-side routing |
| **Active Route Detection** | `usePathname()` hook in dashboard Sidebar |
| **Route Groups** | `(client)` layout groups for authenticated sections |

**Route Structure:**
- `/` — Public marketing pages (Hero, Features, Pricing, etc.)
- `/login`, `/login2` — Authentication pages
- `/onboarding/client` — Client multi-step onboarding wizard
- `/onboarding/vendor` — Vendor multi-step onboarding wizard
- `/client/dashboard` — Client dashboard
- `/client/profile` — Client profile
- `/client/requirements` — Requirement management
- `/client/submissions` — Candidate submissions

---

## 13. Custom Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useIsMobile` | `hooks/use-mobile.ts` | Responsive breakpoint detection (<768px) |
| `useMouseParallax` | `hooks/useMouseParallax.ts` | Mouse-tracking parallax effects |
| `useMultiStepForm` | `onboarding/hooks/` | Multi-step form orchestration with Formik + Zod |
| `useAutoSave` | `onboarding/hooks/` | Debounced auto-save to localStorage |
| `useCompanyVerification` | `onboarding/hooks/` | Company verification logic |
| `useUnsavedChanges` | `onboarding/hooks/` | Warn before navigation with dirty forms |

---

## 14. Code Quality & Linting

| Tool | Configuration |
|------|--------------|
| **ESLint** | 9.x with `eslint-config-next/core-web-vitals` |
| **TypeScript** | Strict mode disabled (`strict: false`), noEmit, incremental builds |
| **Path Mapping** | `@/*` alias for cleaner imports |

---

## 15. External Integrations

| Service / Library | Purpose |
|-------------------|---------|
| **Google Fonts** | Inter font family |
| **YouTube / Video** | Hero video background (conditional loading) |
| **Mux (via next-video)** | Video processing and optimization (configured but conditionally used) |
| **NextAuth.js** | Google OAuth authentication integration |

---

## 16. Project Architecture Summary

```
theme-color/
+-- app/                          # Next.js App Router
¦   +-- layout.tsx                # Root layout + ThemeProvider + SmoothScroll
¦   +-- page.tsx                  # Landing page
¦   +-- globals.css               # Tailwind v4 + theme variables + animations
¦   +-- ThemeContext.tsx           # Global theme state
¦   +-- themes.ts                 # Theme definitions & applyTheme()
¦   +-- components/               # Shared marketing + UI components
¦   ¦   +-- ui/                   # Radix-based design system
¦   ¦   +-- Hero.tsx, Navbar.tsx  # Marketing sections
¦   ¦   +-- ...
¦   +-- client/                   # Authenticated client area
¦   ¦   +-- dashboard/            # Dashboard with charts, sidebar, stats
¦   ¦   +-- profile/              # Profile management
¦   ¦   +-- requirements/         # Requirement CRUD
¦   ¦   +-- submissions/          # Candidate submissions
¦   ¦   +-- shared/skeletons/     # Loading skeletons
¦   +-- onboarding/               # Multi-step onboarding
¦   ¦   +-- client/ + vendor/     # Role-specific flows
¦   ¦   +-- components/           # Reusable form components
¦   ¦   +-- hooks/                # Form logic, auto-save
¦   ¦   +-- schemas/              # Zod validation schemas
¦   +-- login/, login2/           # Authentication pages
¦   +-- hooks/                    # Global custom hooks
¦   +-- lib/                      # Utilities (cn(), etc.)
+-- docs/                         # Project documentation
+-- public/                       # Static assets
+-- videos/                       # Video assets
+-- package.json                  # Dependencies & scripts
+-- tsconfig.json                 # TypeScript config
+-- next.config.mjs               # Next.js config + next-video
+-- postcss.config.mjs            # Tailwind v4 PostCSS plugin
```

---

## 17. Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 18. Key Architectural Decisions

1. **Theme System**: CSS custom properties + React Context enables instant theme switching without style recalculation
2. **No Global State Library**: Context + hooks keep bundle size minimal
3. **Component Composition**: Radix primitives + CVA (class-variance-authority) for type-safe, variant-aware components
4. **Performance**: Conditional video loading, `prefers-reduced-motion` support, hardware concurrency heuristics
5. **Type Safety**: Full TypeScript coverage with Zod runtime validation on forms
6. **Accessibility**: Radix UI ensures ARIA compliance; keyboard navigation supported
7. **Responsive**: Mobile-first with `useIsMobile` hook and Tailwind responsive prefixes
