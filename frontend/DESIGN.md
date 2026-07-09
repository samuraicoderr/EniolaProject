# DESIGN.md

**Last Updated:** May 2026  
**Purpose:** Single source of truth for visual and interaction patterns. This update aligns the design doc with the `app/testpages/login/page.tsx` implementation.

---

## 1. Color Palette

### Primary Theme
- **Primary**: #7e91a2 (main brand color)
- **Primary Hover**: #6f8292 (used for hover states in the login page)
- **Left Panel Overlay**: `bg-primary/50` with `mix-blend-multiply`

### Neutral Colors
- **Background**: #ffffff
- **Surface**: #f9fafb
- **Border / Divider**: #e5e7eb / border-gray-200

### Text Colors
- **Primary Text**: #374151
- **Secondary / Muted**: #6b6b6b / #9ca3af
- **Label Text (forms)**: #7e91a2
- **Left Panel Text**: white (text-white / text-white/90)

### Status / Accent
- Google Button: keep standard Google colors for brand sign-in
- Focus ring and input focus border: use `--primary-color` (#7e91a2)

---

## 2. Typography

### Font Stack
- Body: `var(--font-geist-sans)`
- Monospace: `var(--font-geist-mono)`
- Brand / Logo font: `var(--font-logo)` (used via `.cook-font`, `.cook-font-only`)

### Font Classes
- `.cook-font-only` — brand headings (bold, logo font)
- `.cook-font` / `.logo-font` — logo/brand variants

### Sizes (as used on login)
- App name / Hero brand: `text-[42px]` (login h1)
- Page subtitle / lead: `text-[18px]` / `text-[15px]` for body copy
- Form labels: `text-[13px]`
- Inputs: `text-[16px]`

**Rule:** Use CSS variables or Tailwind utilities (`font-sans`, `font-mono`) — do not substitute arbitrary fonts.

---

## 3. Layout & Structure

### Auth Pages (Login, Register, Forgot Password)
- Overall: two-column layout on `lg` and above; single-column on mobile (left panel hidden).

- Left Panel (desktop):
  - Implemented as `hidden lg:flex` with `w-[45%]` and `xl:w-[42%]`.
  - Static background image (`appConfig.backgrounds.bg2`) rendered with Next `Image` (fill + `object-cover`).
  - Overlay: `absolute inset-0 bg-primary/50 mix-blend-multiply`.
  - Decorative illustration exists but is hidden (`invisible`) in current implementation.
  - Bottom text carousel: white title and copy, auto-advances every 5s.

- Right Panel (form):
  - Width on desktop: `lg:w-[55%]` / `xl:w-[58%]`; mobile: full width.
  - Form container: centered, `max-w-[400px]`.
  - Logo + app name shown side-by-side above form (see Components → Logo).
  - Spacing: Tailwind spacing utilities (`px-6`, `py-12`, `mb-12`, `space-y-6`, etc.).

---

## 4. Components (login-specific notes)

### Logo
- Layout: container uses `flex items-center gap-3` and additional classes in the login page: `mx-auto px-5 py-2 rounded-full` with a hover gap/overlay transition.
- Image: `appConfig.logos.main` displayed at `48x48` (Next `Image` width/height = 48).
- Text: `text-[42px] cook-font` (logo text uses the cook font class and primary color).

### Form Inputs
- Style: underline-only inputs implemented with `border-0 border-b border-gray-300`.
- Focus: `focus:border-primary` and `focus:ring-0` to avoid default focus ring.
- Sizes: inputs use `h-11` and `text-[16px]`.
- Labels: `text-[13px]` and colored `text-primary`.

### Password Field
- Toggle visibility via an inline button; uses `lucide-react` icons `Eye` / `EyeOff` sized 18.
- Toggle button positioned using `relative` parent and `absolute right-0 top-1/2 -translate-y-1/2`.

### Primary Button
- `h-[48px] w-full rounded-full bg-primary text-[15px] font-medium text-white shadow-sm`
- Hover: `hover:bg-[#6f8292] hover:shadow-md`
- Active: `active:scale-[0.98]`

### Google Sign-in Button
- White bordered button: `h-[44px] w-full rounded-lg border border-gray-200 bg-white text-[14px]` with `gap-3` for icon + text.

### Divider
- Visual centered divider with text `or` implemented by an absolute top/bottom border and a centered label with `bg-white px-4`.

### Carousel (Left Panel)
- Text-only carousel; background image stays static.
- 4 slides; auto-advance interval = 5000ms.
- Pagination dots: active `w-8 bg-white`, inactive `w-2.5 bg-white/40` with `transition-all duration-300`.

### Icons
- Use `lucide-react` with a consistent icon size near `18px` for form controls.

---

## 5. Effects & Interaction
- Use `transition-all duration-300` frequently for hover/focus transitions.
- Subtle shadow: `shadow-sm` and `hover:shadow-md` on prominent buttons.
- Button active scale: `active:scale-[0.98]`.
- Carousel transitions: smooth text transitions while keeping the background fixed.

---

## 6. Assets & Configuration
- All runtime config in `@/lib/appconfig`:
  - `appConfig.logos.main` — logo image
  - `appConfig.backgrounds.bg1`, `bg2` — auth backgrounds; login pins `bg2` to the left panel
  - `appConfig.appName`

---

## 7. Design Rules (Do's and Don'ts)

### Do:
- Keep the left panel background static during carousel text changes.
- Keep logo image and brand text side-by-side on auth pages.
- Use `#7e91a2` for primary accents and `--primary-color` for focus states.
- Use Tailwind utilities for spacing and sizing.

### Don't:
- Do not change the left-panel background when carousel slides advance.
- Do not introduce new arbitrary colors or fonts.

---

## 8. Implementation Notes / Small details extracted from `page.tsx`
- Left panel visibility: `hidden lg:flex` (desktop-only panel).
- Left panel sizes: `w-[45%]` (lg) and `xl:w-[42%]`.
- Right panel sizes: `lg:w-[55%]` / `xl:w-[58%]`.
- Logo wrapper classes: `mb-12 w-fit rounded-full mx-auto px-5 py-2 flex items-center justify-center gap-3 hover:gap-4 hover:bg-primary/10 transition-all duration-300 cursor-pointer`.
- Email label text: "Users name or Email" (as implemented) — keep copy consistency with the component.

---

**This document is the single source of truth for the design system.**

If future implementations diverge from these details, update this file to keep design and code in sync.

---

## 9. Operations Dashboard Patterns

The MVP operations dashboard extends the same brand system for protected workspace screens.

- Shell: white sidebar and top header on `#f9fafb`, with `#e5e7eb` dividers and `#7e91a2` active navigation.
- Panels: use square or very low-radius bordered white surfaces, `p-5`, and no nested card-in-card layouts.
- Primary actions: rounded-full `#7e91a2` buttons with `#6f8292` hover, `shadow-sm`, and `active:scale-[0.98]`.
- Tables: compact, scan-first rows with muted uppercase headers, status badges, and direct text links for row actions.
- Forms: labels use `text-[13px]` and `#7e91a2`; controls use 44px height, white background, `#e5e7eb` border, and primary focus ring.
- Charts: use Recharts with primary stroke/fill `#7e91a2`, light grid `#e5e7eb`, and restrained heights between 250px and 320px.
- Status accents: use small semantic badges only; avoid changing the dominant neutral/primary palette.
