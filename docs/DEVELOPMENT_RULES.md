# Frontend Development Rules & Engineering Standards

This document outlines the mandatory engineering rules, architectural standards, and UI/form constraints for developing this staffing platform. All developers and AI agents must strictly adhere to these rules.

---

## 1. Feature-Based Architecture

To keep the codebase maintainable and scalable as the project grows, organize code by business feature or shared concern rather than by framework layer.

### Directory Structure

```text
app/
├── layout.tsx            # Root layout
├── page.tsx              # Landing page
├── components/           # Shared UI sections and widgets
├── data/                 # Static configuration and slide content
├── hooks/                # Reusable React hooks
└── themes.ts             # Theme config and DOM theme application
```

### Feature Rules

1. Keep data and behavior close together when it improves readability.
2. Promote code into shared folders only when multiple sections actually reuse it.
3. Prefer typed data modules in `.ts` files over ad hoc inline objects when content is reused.

---

## 2. Next.js Best Practices

- **Server Components by Default:** Keep components as React Server Components to minimize the client-side JavaScript bundle. Only use `"use client"` when you need hooks, event listeners, or browser-only APIs.
- **TypeScript First:** Use `.ts` for utilities, config, and static data, and `.tsx` for any file that returns JSX.
- **App Router Structure:** Use `app/` for routing, layouts, shared sections, and route composition. Keep page-specific UI colocated with the route when it is not reused elsewhere.
- **Root Layout:** Keep `<html>` and `<body>` in [`app/layout.tsx`](file:///c:/theme-color/app/layout.tsx) and use the Metadata API instead of manually managing head tags.
- **Avoid Standard `<a>` Anchor Tags:** Use the Next.js `Link` component (`next/link`) instead of plain `<a>` tags for internal navigation. Standard anchor tags cause full-page reloads, losing client-side state and slowing down transitions. Only use `<a>` for external links, anchor hashes, or communication protocols like `mailto:` and `tel:`.
- **Tech Stack Documentation:** Whenever any technology, framework, library, or dependency is added to or removed from the project, you must immediately update the [tech_stack.md](file:///c:/theme-color/docs/tech_stack.md) file to keep the architecture documentation accurate and up-to-date.
- **Vendor Dashboard & Theme Providers:** Vendor pages utilizing shared sub-components (such as `VendorDashboardHeader` or `VendorSidebar`) require `VendorDashboardThemeProvider`. Ensure each vendor route segment has a `layout.tsx` wrapping `{children}` inside `<VendorDashboardThemeProvider>`. For instance, when adding `/app/vendor/bench`, a `layout.tsx` must be created within that route folder to provide context and prevent the runtime error: `useVendorDashboardTheme must be used within VendorDashboardThemeProvider`.

---

## 3. Shared Data and State

The current application uses local component state, shared React context, and static data modules instead of a global Redux store.

### Shared State

- Use local `useState` for component-scoped UI state.
- Use React context only when multiple unrelated components need the same value, as with [`app/ThemeContext.tsx`](file:///c:/theme-color/app/ThemeContext.tsx).
- Keep context values narrow and typed.

### Static Data Modules

- Store repeatable slide and content configuration in `app/data/*.ts`.
- Export plain typed objects and arrays rather than rebuilding the same content in multiple components.

---

## 4. Styling and UI Patterns

- **Global Tokens:** Use CSS custom properties in [`app/globals.css`](file:///c:/theme-color/app/globals.css) for theme colors, spacing, and cross-section design tokens.
- **Icon Library:** Always use `lucide-react` icons in the application for consistency and visual coherence. Avoid custom inline SVG icons or other icon libraries unless absolutely necessary.
- **No Icon Boxes:** We will never use an icon in a box. Icons must be used plainly and clearly without solid background wrappers or container boxes (e.g., colored squares or circles enclosing an icon). Apply colors directly to the icon element itself.
- **Shared Components:** Put shared layouts like navbar, footer, hero sections, and theme controls in `app/components/`.
- **Client Directives:** Mark only interactive components with `"use client"`.
- **Event Handlers:** Prefer `e.currentTarget` over `e.target` when mutating styles in event handlers.
- **No Landing Page Pill Badges:** Do not use pill badges (section tags/labels with or without live indicator status dots) anywhere on the landing page layout.
- **Standardized Page Heading & Subheading (All Pages):** Every application page heading (`<h1>`) and subheading must strictly use the standardized Client Dashboard / Onboarding header typography and CSS rather than ad-hoc sizes or weights (e.g., never use `text-xl`, `text-3xl font-bold`, or custom subtitle font sizes):
  - **Component & Class Usage:** Prefer [`DashPageHeader`](file:///c:/theme-color/app/components/ui/dash-page-header.tsx) (`dash-page-header`, `dash-page-title`, and `page-subtitle dash-page-subtitle`). On standalone pages outside `DashPageHeader` (such as [`OnboardingPageHeader`](file:///c:/theme-color/app/onboarding/components/OnboardingPageHeader.tsx)), apply the exact `.dash-page-title` / Tailwind utilities (`text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-[var(--dash-brand-title,#005A9C)]`) for the `<h1>` and the global `.page-subtitle` class from [`app/globals.css`](file:///c:/theme-color/app/globals.css) for the subheading.
  - **Exact Standardized CSS** (matching [`app/client/dashboard/dashboard.css`](file:///c:/theme-color/app/client/dashboard/dashboard.css) and [`app/globals.css`](file:///c:/theme-color/app/globals.css)):

    ```css
    /* Page Heading (<h1> / .dash-page-title) */
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 1.5rem;      /* 24px on mobile (text-2xl); 1.875rem / 30px at min-width: 640px (sm:text-3xl) */
    font-weight: 600;       /* font-semibold */
    letter-spacing: -0.025em; /* tracking-tight */
    line-height: 1.25;      /* leading-tight */
    color: var(--dash-brand-title, #005A9C); /* #005A9C light mode, #38BDF8 dark mode */
    display: flex;
    align-items: center;
    gap: 10px;

    /* Page Subheading (.page-subtitle / .dash-page-subtitle) */
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 0.75rem;     /* 12px on mobile; 0.875rem / 14px at min-width: 640px */
    font-weight: 400;
    line-height: 1.5;
    color: var(--dash-text-muted, #64748B);
    margin-top: 4px;        /* 6px at min-width: 640px */
    ```

---

## 5. Animation and Motion

- Use `framer-motion` sparingly and intentionally.
- Keep animation variants local to the component that owns them.
- When TypeScript is stricter than the runtime needs, type the smallest affected animation object instead of widening the entire component.
- Prefer graceful fallbacks for expensive effects on mobile or reduced-motion devices.

---

## 6. Type Safety

- **Type Storage Guidelines (Feature-Based):**
  - **UI & Component Props (Ephemeral):**
    - **Inlined:** Define types at the top of the file if they are only used within that specific component or hook.
    - **Sibling `*.types.ts` Files:** For complex components, keep types in a sibling file (e.g., `Hero.types.ts` next to `Hero.tsx`) and import using `import type`.
  - **Domain & Data Entities (Persistent):**
    - **Feature-Scoped Shared Types:** If schemas/entities are shared _within a specific feature_ (e.g., Job posts, Talent profiles), store them in a feature-level `types.ts` file or `types/` sub-directory within that feature's folder.
    - **Global Shared Types:** Use a global folder (`app/types/`) only for genuinely project-wide models, API response schemas, or cross-cutting utility types.
- Keep business data typed at the source.
- Type component props explicitly, especially for interactive components.
- Use `ReactNode`, `MouseEventHandler`, and DOM element refs where appropriate.
- Prefer small, local casts only when a third-party typing quirk blocks an otherwise safe pattern.

---

## 7. UI Library Guidance

- **Use shadcn/ui:** Always use `shadcn` components for standard UI primitives (e.g., Table, Cards, Menu, Button, Input, Dropdown, Dialog/Modal, etc.) in the application rather than custom HTML elements or bespoke CSS implementations.
- **Prohibit Raw HTML UI Tags:** Do not use raw HTML tags (such as `<button>`, `<input>`, `<select>`, `<table>`, etc.) for form controls, buttons, tables, or filters. You must always use the corresponding Shadcn component (e.g., `Button`, `Input`, `Select`, `Table`) to ensure consistent visual aesthetics, keyboard navigation, transition states, and theme compatibility.
- **Shadcn Calendar Component:** Always use the `shadcn` Calendar or DatePicker component for date selection instead of native HTML `<input type="date">` inputs. This guarantees consistent date picker styling, theme styling compatibility, and custom event/interaction controls across all browsers.
- **Clear Filters Action:** Whenever page filters (like search queries, dropdown select filters, tags, etc.) are active and differ from the default state, a clear/reset button must be visible to allow the user to reset all filters to their default values with a single click.
- Keep low-level primitives isolated and reusable.
- Compose feature-specific UI from those primitives instead of hard-coding duplicate patterns.
- Wrap browser-dependent widgets in client components when needed.
- **Confirmation Modals:** For actions requiring user confirmation (e.g., delete, reset, key updates), use the shared `ConfirmationDialog` component located at [`app/components/ui/confirmation-dialog.tsx`](file:///c:/theme-color/app/components/ui/confirmation-dialog.tsx) rather than creating separate ad-hoc dialogs.
- **Modal Transitions & Centering:** When creating or customizing modal/dialog animations:
  - Ensure the modal opens from the center with a smooth transition (e.g., using `scale` and `opacity` transitions).
  - **Critical:** Never animate the CSS `transform` property directly (e.g., `transform: translate(...)`) within keyframes. Modals rely on Tailwind's `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` for absolute centering. Overriding `transform` in keyframes breaks centering.
  - Instead, animate the standalone CSS properties **`scale`** and **`opacity`**, which compose independently with the element's positioning `transform`.
- **Accordion & Collapsible Transitions:** Always use the custom Accordion components (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) located at [`app/components/ui/accordion.tsx`](file:///c:/theme-color/app/components/ui/accordion.tsx) to implement collapsible details or expand/collapse sections. This utilizes the Radix UI transitions for smooth expand/collapse height animations, preventing sudden layout shifts.

  ```tsx
  import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";

  // Usage
  <ConfirmationDialog
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Delete Item"
    description="Are you sure you want to delete this item? This action cannot be undone."
    confirmText="Delete"
    variant="destructive"
    onConfirm={handleDelete}
  />;
  ```

- **CRM & Vendor-Side Loading Skeletons:** To guarantee smooth transitions, always implement a loading skeleton system for every client-facing CRM dashboard page and vendor-facing page (e.g., Dashboard, Profile, My Bench, and My Requirements). Use a reusable common skeleton library for primitives and sections, and defer rendering of interactive content until mock fetching or client-side loading finishes. Whenever a new page is created, you must also create its corresponding loading skeleton component and integrate it.

---

## 8. Form Management

- **Use Formik:** Always use `formik` for managing form state, values, validation, and submission in client-side forms. Do not use `react-hook-form` or standard unmanaged HTML inputs.
- **Schema Validation with Zod:** Combine Formik with `zod` for declarative schema-based validation. Create a validation helper that parses values with the Zod schema and maps the validation errors back to Formik's error format:
  ```typescript
  const validateWithZod = (schema: z.ZodSchema) => (values: any) => {
    const result = schema.safeParse(values);
    if (result.success) return {};
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
    return errors;
  };
  ```
- **Step-by-Step Validation:** In multi-step forms, validate only the schema corresponding to the current step using the custom `useMultiStepForm` hook before advancing.
- **Error Border Highlighting:** When an input field, select trigger, or other form control has validation errors and has been touched, you must conditionally apply a red border (e.g., `border-red-500`) and a red focus ring (e.g., `focus-visible:ring-red-500` / `focus:ring-red-500`) to visually highlight the error state, rather than showing a normal state border.

---

## 9. Engagement Model Policy

- **Only C-C & C-H Engagement Models:** The platform must only support C-C (Contract to Contract) and C-H (Contract to Hire) engagement models.
- **Prohibit FTE (Full-Time Employment) References:** Do not include or introduce FTE or Full-Time Employment options anywhere in the application code, including:
  - Form validation schemas and values (such as Select dropdown items).
  - Mock data arrays or initial state arrays.
  - User onboarding stages and configuration card choices.
  - Landing pages, FAQs, headers, features, or sign-up page copy.
- **Default State Rule:** Any state or component selecting a default engagement type must fallback to C-C or C-H.
