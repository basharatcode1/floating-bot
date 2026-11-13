# Architecture Rules & Component Map

> **Purpose:** Structural rules and component locations for AI agents and developers.
> Do NOT hardcode CSS values from this file — always reference the source class/variable in `globals.css`.

---

## 1. Design System & Shared UI (`app/components/ui/`)

### Rules
- All shared UI primitives live in `app/components/ui/`. Never create duplicate button/input/card primitives elsewhere.
- Always use `glass-button.tsx` (indigo) or `glass-button-2.tsx` (indigo+cyan) for glassmorphism buttons — do not create new glass-styled button files.
- Always use `toast.tsx` + `toaster.tsx` for notifications — never add `sonner`, `react-hot-toast`, or any third-party toast library. Use the imperative API (`toast.success()`, `toast.error()`).
- The `Toaster` component is mounted globally in `app/layout.tsx` — never mount it again in any sub-layout.
- Search inputs across dashboards must use `dash-search-input.tsx` — do not create page-specific search components.
- Action buttons across dashboards must use `dash-button.tsx`.

### Component Reference
| Component | Purpose | Key Variants |
|-----------|---------|-------------|
| `glass-button.tsx` | Glassmorphism CTA button | `hero`, `form`, `sm`, `lg` |
| `glass-button-2.tsx` | Indigo+cyan glass button | Used in `/login`, `/get-started` |
| `dash-search-input.tsx` | Unified dashboard search | Shared across all list/filter views |
| `dash-button.tsx` | Dashboard action button | Standard dash action |
| `input.tsx` | Base form input | Height via `--dash-input-height` variable |
| `toast.tsx` / `toaster.tsx` | Toast notification system | `success`, `error`, `warning`, `info` |
| `confirmation-dialog.tsx` | Shared confirm/cancel modal | `destructive` variant for deletes |
| `empty-state.tsx` | Empty data placeholder | — |

### Color & Theme Rules
- Primary color is `#005A9C` — all tokens, gradients, and utilities derive from this. See `docs/THEME_COLOR_GUIDE.md` for the full specification.
- Never hardcode `#005A9C` directly — use the CSS variable (`var(--primary)`) or Tailwind class (`text-primary`, `bg-primary`).
- Brand gradient flows Cyan → Primary Blue (`#06B6D4 → #005A9C`). Use `.text-gradient-heading` or `.bg-gradient-brand` utility classes.
- All color tokens, utility classes, and gradient definitions live in `app/globals.css` under `@theme` and `:root`.
- **Form & Onboarding Typography Tokens:** Standardized in `app/globals.css` with CSS variables (`--form-label-*`, `--form-input-*`, `--form-helper-*`, `--form-error-*`, `--form-section-*`, `--form-page-*`) and utility classes (`.form-label`, `.form-input-text`, `.form-helper-text`, `.form-error-text`, `.form-section-title`, `.form-section-desc`, `.form-page-title`, `.form-page-subtitle`, `.form-chip`).

---

## 2. Skeleton & Loading System

### Rules
- **Every new page MUST have a corresponding skeleton component.** No exceptions.
- All skeletons must use the neutral monochrome shimmer system (`var(--dash-card-border)` / `var(--dash-card-hover)`) — never use colored tints in skeletons.
- Skeleton proportions must match the real component's layout to prevent layout shift on mount.
- Sidebar skeletons must read live collapsed/expanded state from `useSidebar()`.

### Skeleton Locations
| Page | Skeleton Location |
|------|------------------|
| Client Dashboard | `app/client/dashboard/components/DashboardSkeleton.tsx` |
| Client Requirements | `app/client/requirements/components/RequirementsSkeleton.tsx` |
| Client Submissions | `app/client/submissions/components/SubmissionsSkeleton.tsx` |
| Client Billing | `app/client/billing/components/BillingSkeleton.tsx` |
| Client Profile | `app/client/profile/components/ProfileSkeleton.tsx` |
| Vendor Performance | `app/client/vendor-performance/components/VendorPerformanceSkeleton.tsx` |
| Vendor Client Perf | `app/vendor/client-performance/components/ClientPerformanceSkeleton.tsx` |
| Onboarding | `app/onboarding/components/OnboardingSkeleton.tsx` (role-aware: `vendor` / `client`) |
| Shared Primitives | `app/client/shared/skeletons/` (`SkeletonLine`, `SkeletonBlock`, `SkeletonAvatar`, `SkeletonBadge`, `SkeletonContainer`) |

---

## 3. Navigation & Layout System

### Rules
- Layout dimensions and transitions are defined via CSS classes in `globals.css` (`.dash-sidebar`, `.dash-sidebar-brand-fixed`, `.dash-header`, `.dash-main`). Never hardcode pixel values in component files — always reference the CSS class.
- The brand header is fixed at top-left across both Client and Vendor dashboards. Do not move it or change its z-index stacking without updating both sidebars.
- The sidebar is a hover-collapsible rail (collapsed icon-only → expanded with labels). Labels, badges, and card elements stay mounted in DOM at all times — they are shown/hidden via CSS, not conditional rendering.
- When the sidebar expands, `.dash-main` must push its left margin in sync — never let content overlap with the sidebar.
- Mobile (≤768px) degrades to a full-width header with an off-canvas mobile drawer. The sidebar rail is hidden.

### Component Locations
| Component | Client | Vendor |
|-----------|--------|--------|
| Sidebar | `app/client/dashboard/components/Sidebar.tsx` | `app/vendor/dashboard/components/VendorSidebar.tsx` |
| Top Bar Header | Shared via `.dash-header` class | Same |
| Brand Header | Shared via `.dash-sidebar-brand-fixed` class | Same |

---

## 4. Profile Page Architecture

### Rules
- Both Client and Vendor profile pages use a unified 3-column grid layout (`.profile-three-col`): **Social Media**, **Account Information**, **Account Actions**.
- On tablet/mobile (≤1024px), the grid collapses to a single column.
- Profile skeleton must mirror this layout using `.sk-info-grid-3`.

### Locations
- Client: `app/client/profile/`
- Vendor: `app/vendor/profile/`

---

## 5. Auth & Background System

### Rules
- Login and Get Started pages each have their own full-viewport background components. Do not share or merge them.
- Background components must suppress scrollbars and provide deep contrast overlays for text legibility.
- The Get Started page uses `next/image` with `fill`, `priority`, and `object-cover` — never use raw `<img>` tags for full-bleed backgrounds.

### Locations
| Page | Background Component | Type |
|------|---------------------|------|
| `/login` | `app/login/VideoBackground.tsx` | Looping video + vignettes |
| `/get-started` | `app/get-started/ImageBackground.tsx` | Static image + overlays |
| `/get-started` | `app/get-started/GetStartedClient.tsx` | Left-side value proposition |

---

## 6. Onboarding Route Architecture

### Rules
- Onboarding uses **dedicated role-based routes** — `/onboarding/client` and `/onboarding/vendor`. Never use query parameters for role selection.
- Both routes render a single unified page (not multi-step tabs) within a shared layout shell.
- The shared layout (`app/onboarding/layout.tsx`) wraps all segments in `AuthModalProvider` and `SignupProvider`. Do not duplicate these providers in child routes.
- The section navigation sidebar (`SectionNavSidebar`) is sticky and must show validation error badges (red `!`) when a section has errors.
- The form card actions footer (`StickyFooterActions`) must be placed inside the form card container to match the width of `<FormCard>` sections.
- Onboarding form fields are accompanied by `OnboardingGuideMascot` (powered by `StrobiAvatar` / `@bible-strong/avatar-react`, `app/onboarding/data/strobi.avatar.json`, and `app/onboarding/data/field-guidance.ts`), which tracks field focus (`focusin`/`pointerdown`), rests vertically on top of the contextual guidance speech bubble, points its head and eyes directly toward the focused field (`guide-right`/`guide-left` directional gaze), dynamically switches to an angry reaction (`angry-field-right`/`angry-field-left` turning crimson `#ba3636` with furrowed brows and head shudder) whenever validation errors occur at the active field, persists at the invalid field on blur instead of retreating to the corner until the error is resolved, displays concise filling guidance, and returns to `idle` in the bottom-right corner when unfocused without errors while respecting `prefers-reduced-motion`.

### Component Map
| Component | Location | Purpose |
|-----------|----------|---------|
| Client Form | `ClientOnboardingForm.tsx` | All client registration sections |
| Vendor Form | `VendorOnboardingForm.tsx` | All vendor registration sections |
| Layout Shell | `app/onboarding/components/OnboardingLayoutShell.tsx` | Full-width wrapper + compliance footer |
| Page Header | `app/onboarding/components/OnboardingPageHeader.tsx` | Full-width title + eyebrow + auto-fetch banner |
| Section Nav | `app/onboarding/components/SectionNavSidebar.tsx` | Sticky left nav with validation badges |
| Footer Actions | `app/onboarding/components/StickyFooterActions.tsx` | Form submit/save buttons |
| Guide Mascot | `app/onboarding/components/OnboardingGuideMascot.tsx` | Floating Strobi assistant that follows focused fields and displays contextual filling tips |
| Field Guidance | `app/onboarding/data/field-guidance.ts` | Per-field guidance titles, tips, and examples for Client & Vendor onboarding |
| Strobi Avatar | `app/onboarding/components/StrobiAvatar.tsx` | Client wrapper for `@bible-strong/avatar-react` with `prefers-reduced-motion` fallback |
| Tag Input | `app/onboarding/components/TagInputField.tsx` | Multi-chip input (Certifications, Tech Stack) |
| Borderless Input | `app/onboarding/components/BorderlessInput.tsx` | Underline input for URLs |
| Social Card | `app/onboarding/components/SocialCard.tsx` | Social profile inputs (LinkedIn, X, Instagram) |
| Skeleton | `app/onboarding/components/OnboardingSkeleton.tsx` | Role-aware loading skeleton |

---

## 7. Shared Modal (`JobDescriptionModal`)

### Rules
- There is ONE centralized Job Description modal: `app/components/JobDescriptionModal.tsx`. Never create per-page JD modals.
- It supports contextual variants via a `variant` prop: `client`, `client-submissions`, `vendor-opportunity`, `vendor-submission`.
- The variant controls which page-specific actions appear (e.g., Propose Candidate, PDF download).
- All UI sections (Metadata Header, Skills, Details Grid, Compliance Check, JD Attachment) are preserved across all variants.

---

## 8. Route Map

| Category | Route | Key Files |
|----------|-------|-----------|
| **Public** | `/` | `app/page.tsx` |
| **Public** | `/about` | `app/about/page.tsx` |
| **Public** | `/pricing` | `app/pricing/page.tsx` |
| **Auth** | `/login` | `app/login/` |
| **Auth** | `/login-2` | `app/login2/` |
| **Auth** | `/get-started` | `app/get-started/` |
| **Onboarding** | `/onboarding/client` | `app/onboarding/client/` |
| **Onboarding** | `/onboarding/vendor` | `app/onboarding/vendor/` |
| **Client** | `/client/dashboard` | `app/client/dashboard/` |
| **Client** | `/client/requirements` | `app/client/requirements/` |
| **Client** | `/client/submissions` | `app/client/submissions/` |
| **Client** | `/client/vendor-performance` | `app/client/vendor-performance/` |
| **Client** | `/client/billing` | `app/client/billing/` |
| **Client** | `/client/notifications` | `app/client/notifications/` |
| **Client** | `/client/profile` | `app/client/profile/` |
| **Client** | `/client/support` | `app/client/support/` |
| **Vendor** | `/vendor/dashboard` | `app/vendor/dashboard/` |
| **Vendor** | `/vendor/bench` | `app/vendor/bench/` |
| **Vendor** | `/vendor/opportunities` | `app/vendor/opportunities/` |
| **Vendor** | `/vendor/submissions` | `app/vendor/submissions/` |
| **Vendor** | `/vendor/client-performance` | `app/vendor/client-performance/` |
| **Vendor** | `/vendor/billing` | `app/vendor/billing/` |
| **Vendor** | `/vendor/subscription` | `app/vendor/subscription/` |
| **Vendor** | `/vendor/notifications` | `app/vendor/notifications/` |
| **Vendor** | `/vendor/profile` | `app/vendor/profile/` |
| **Vendor** | `/vendor/support` | `app/vendor/support/` |

---

## 9. StaffSync AI Hiring Studio (`app/client/requirements/components/hiring-studio/`)

### Purpose & Architecture
Replaces the legacy upload form with an intelligent, AI-assisted hiring requirement builder. Step 1 ("Build Job Description") is rendered in a focused modal dialog for AI conversation and document ingestion. Step 2 ("Review & Publish") transitions into a native, full-page view within `dash-content` (under the dashboard header and alongside the sidebar) featuring the Onboarding-aligned 2-column layout (sticky navigation sidebar + stacked form cards), preserving all user draft state across steps.

### Rules
- **No External Coupling:** All studio components, types, services, and assets reside natively in the main repository. Never import from or depend on prototype/reference sandboxes.
- **Engagement Model Compliance:** Strictly adheres to platform policy—supporting only **C-C (Contract to Contract)** and **C-H (Contract to Hire)** engagement models.
- **Typography:** Strictly utilizes the project font family (`Inter`) rather than external fonts.
- **Mascot Assets:** Step 1 welcome modal renders the interactive Three.js 3D mascot loaded dynamically (`ssr: false`) from `public/models/welcome-mascot.glb` with articulated/gesture animation support and falls back gracefully to `public/images/robot-mascot.png` when WebGL or the model is unavailable; sub-views (`CreateChat`, busy state) use `Robot.tsx` (`public/images/robot-mascot.png`).

### Component Map
| Component | Location | Purpose |
|-----------|----------|---------|
| Studio Orchestrator | `HiringStudio.tsx` | State machine coordinating steps, views, drafts, and publishing |
| Assistant Intro | `AssistantIntro.tsx` | Immediate Step 1 modal landing with 3D mascot stage, greeting speech bubble, and both choice cards |
| Welcome Mascot Wrapper | `WelcomeRobot.tsx` | Client WebGL wrapper (`ssr: false` dynamic load), error boundary, and `robot-mascot.png` fallback |
| Three.js 3D Scene | `RobotScene.tsx` | Native Three.js (`GLTFLoader`, `OrbitControls`, `RoomEnvironment`) 360°-rotatable 3D mascot renderer using preloaded GLB buffer and `prefers-reduced-motion` support |
| Welcome Sequence, Preload & Rig | `mascot-preload.ts`, `welcome-sequence.ts`, `mascot-rig.ts`, `mascot-motion.ts`, `mascot-gesture.ts` | Preloader (`RobotScene` chunk + `.glb` buffer cache), timing, pose, gesture, and adaptive rig helpers |
| Conversational Chat | `CreateChat.tsx` | 12-question guided AI conversational JD questionnaire |
| Document Source Input | `SourceInput.tsx` | Drag-and-drop file uploader (PDF/TXT) and paste fallback |
| Section Cards Editor | `JDEditor.tsx` | Reusable section cards with inline editing and AI source tags (used in Review & Publish) |
| AI Gap Analysis | `Suggestions.tsx` | Heuristic recommendations with accept/edit/dismiss controls |
| Review & Completeness | `ReviewPublish.tsx` | Onboarding-aligned 8-section structured form with sticky section navigation sidebar, completeness progress, draft saving, Zod error indicators, and direct publish |
| Review Types & Presets | `review-publish.types.ts` | Form data models, initial value builders, and preset constants for the 8 review sections |
| Form Validation Schema | `review-publish.schema.ts` | Zod schema validation enforcing required vs optional fields with DOM scroll target mapping |
| Mascot & Badges | `Robot.tsx` | Static mascot renderer, typing animation dots, and status badges |
| Stepper | `Stepper.tsx` | Responsive 2-step wizard ("Build Job Description" -> "Review & Publish") |
| NLP & Heuristics Service | `demo-service.ts` | Section chunking, draft assembly, gap analysis, and skill chips |
