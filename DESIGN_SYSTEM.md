# Digital-Somiti — Color & Typography Design System

**Version:** 1.3  
**Style:** Premium Fintech | Minimal | Pitch Black & Royal Blue  
**Theme:** Dark Mode + Light Mode  
**Brand Inspiration:** ReTech Blue Palette with OLED Pitch Black

---

## 1. Dark Mode Palette (Pitch Black & Royal Blue)

- **Background:** `#000000` — Main application background (Pure Pitch Black)
- **Surface:** `#09090D` — Cards, top bar, sidebar, modals, bottom sheets, navigation bars (Deep Black)
- **Surface Hover:** `#14141A` — Hover states on cards, menus, and rows
- **Surface Subtle:** `#040406` — Inner table rows, input backgrounds, sub-panels
- **Primary Brand:** `#0F5BE4` — Primary buttons, active tabs, selected navigation items, main accents
- **Brand Variant:** `#6BBCE9` — Hover states, interactive highlights, glowing accents, secondary actions
- **Primary Text:** `#FFFFFF` — Account balances, page titles, headings, important financial information
- **Secondary Text:** `#E5E0E4` — Timestamps, descriptions, subtitles, labels, helper text
- **Muted Text:** `#9CA3AF` — Placeholder text, subtle captions
- **Success / Profit:** `#10B981` — Income, incoming money, profit, positive growth, successful transactions
- **Error / Expense:** `#EF4444` — Expenses, outgoing money, debt, negative growth, errors, alerts
- **Border / Divider:** `rgba(255, 255, 255, 0.10)` — Hairline borders on cards, subtle dividers
- **Active Border:** `#0F5BE4` — Focus rings, active card outlines
- **Input Background:** `#FFFFFF` — Inverted high-contrast white input box in Dark Mode
- **Input Text:** `#000000` — Black input text before and after filled in Dark Mode

---

## 2. Light Mode Palette (Soft White & Royal Blue)

- **Background:** `#FFFDFE` — Main application background (Soft Off-White)
- **Surface:** `#FFFFFF` — Cards, top bar, sidebar, containers, modals, bottom sheets, navigation bars
- **Surface Hover:** `#F6F7F9` — Hover states on cards and interactive elements
- **Surface Subtle:** `#FFFDFE` — Inner table rows, form input backgrounds
- **Primary Brand:** `#0F5BE4` — Primary buttons, active tabs, selected navigation items, main accents
- **Brand Variant:** `#6BBCE9` — Interactive highlights, decorative accents, secondary actions, hover states
- **Primary Text:** `#041B45` — Account balances, page titles, headings, important financial information
- **Secondary Text:** `#64748B` — Timestamps, descriptions, subtitles, labels, helper text
- **Muted Text:** `#94A3B8` — Placeholder text, subtle captions
- **Success / Profit:** `#059669` — Income, incoming money, profit, positive growth, successful transactions
- **Error / Expense:** `#DC2626` — Expenses, outgoing money, debt, negative growth, errors, alerts
- **Border / Divider:** `#E5E0E4` — Card borders, separators, form outlines, subtle dividers
- **Input Background:** `#09090D` — Inverted high-contrast black input box in Light Mode
- **Input Text:** `#FFFFFF` — White input text before and after filled in Light Mode

---

## 3. Brand Logo & SVG System

- **Logo Font:** `Caviler` (`src/assets/fonts/caviler.otf`) — Application Logo / Brand Wordmark Only
- **Logo Wordmark Color (Dark Mode):** `#FFFFFF` (Pure White)
- **Logo Wordmark Color (Light Mode):** `#041B45` (Deep Navy)
- **Vector Logo Mark (Dark Mode):** Dynamic Linear Gradient (`#0F5BE4` &rarr; `#6BBCE9`) with neon blue drop-shadow (`rgba(15, 91, 228, 0.55)`)
- **Vector Logo Mark (Light Mode):** Dynamic Linear Gradient (`#0F5BE4` &rarr; `#38BDF8`) with elevation shadow (`rgba(15, 91, 228, 0.25)`)
- **Favicon & Raw Asset:** `src/assets/images/logo.svg` (Filled with Royal Blue `#0F5BE4`)

---

## 4. Font Family System

- **Logo Font:** `Caviler` (`src/assets/fonts/caviler.otf`) — Application Logo / Brand Wordmark Only
- **Heading Font:** `Sora` (Weights: 600, 700) — Page Titles, Section Headings, Dashboard Headings
- **Primary UI Font:** `Inter` (Weights: 400, 500, 600, 700) — Account Balances, Financial Numbers, Tables, Cards, Navigation, Inputs
- **Bangla Font:** `Hind Siliguri` (Weights: 400, 500, 600, 700) — All Bengali UI text, headings, amounts, labels

---

## 5. Typography Scale

- **App Logo / Brand:** `Caviler` | 24px–32px | Regular
- **Page Title:** `Sora` | 22px | 600 (SemiBold)
- **Section Heading:** `Sora` | 18px | 600 (SemiBold)
- **Account Balance:** `Inter` | 32px | 700 (Bold)
- **Financial Amount:** `Inter` | 18px–24px | 600–700
- **Card Heading:** `Inter` | 16px | 600 (SemiBold)
- **Body Text:** `Inter` | 14px | 400 (Regular)
- **Button Text:** `Inter` | 14px | 600 (SemiBold)
- **Input Text:** `Inter` | 14px–16px | 400–500
- **Secondary Text:** `Inter` | 12px–14px | 400
- **Caption / Timestamp:** `Inter` | 12px | 400
- **Bottom Navigation:** `Inter` | 11px | 500 (Medium)
- **Bangla Text:** `Hind Siliguri` | 14px–16px | 400–600

---

## 6. Color & Component Usage Guidelines

- **Dark Mode Surfaces:** Always use Deep Black (`#09090D`) with fine hairline borders for top bar, sidebar, and cards to keep the pitch-black OLED aesthetic without blue tinting.
- **Backgrounds:** Use Pure Black (`#000000`) in dark mode, and Soft Off-White (`#FFFDFE`) in light mode.
- **Primary Actions:** Use Royal Blue (`#0F5BE4`) for main CTAs, active navigation items, and important badges.
- **Accents:** Use Light Blue (`#6BBCE9`) for hover glows, secondary highlights, and interactive cues.
- **Financial Balances:** Format numbers with tabular numerals (`Inter` 600/700) for clean mathematical alignment.
- **Income / Profit:** Always use emerald green (`#10B981` in dark, `#059669` in light).
- **Expenses / Loans Due:** Always use red (`#EF4444` in dark, `#DC2626` in light).

---

## 7. Final Design Reference

### Dark Mode

| Element | Color | Notes |
|---|---|---|
| Background | `#000000` | Pure Pitch Black |
| Top Bar / Header | `#09090D` | Deep Black surface |
| Sidebar Panel | `#09090D` | Deep Black surface |
| Cards & Modals | `#09090D` | Deep Black with hairline border |
| Inner Table Rows | `#040406` | Subtle contrast inside cards |
| Primary Brand | `#0F5BE4` | Royal Blue |
| Brand Variant | `#6BBCE9` | Light Blue / Cyan Accent |
| Logo SVG Mark | `#0F5BE4` &rarr; `#6BBCE9` | Neon blue gradient glow |
| Brand Wordmark Text | `#FFFFFF` | Caviler font |
| Primary Text | `#FFFFFF` | High-contrast white |
| Secondary Text | `#E5E0E4` | Soft light gray |
| Success / Profit | `#10B981` | Emerald Green |
| Error / Expense | `#EF4444` | Red |
| Border / Divider | `rgba(255, 255, 255, 0.10)` | Hairline border |

### Light Mode

| Element | Color | Notes |
|---|---|---|
| Background | `#FFFDFE` | Soft Off-White |
| Top Bar / Header | `#FFFFFF` | Clean White surface |
| Sidebar Panel | `#FFFFFF` | Clean White surface |
| Cards & Modals | `#FFFFFF` | Pure White with subtle border |
| Inner Table Rows | `#FFFDFE` | Soft off-white row background |
| Primary Brand | `#0F5BE4` | Royal Blue |
| Brand Variant | `#6BBCE9` | Light Blue Accent |
| Logo SVG Mark | `#0F5BE4` &rarr; `#38BDF8` | Crisp sky-blue gradient |
| Brand Wordmark Text | `#041B45` | Deep Navy, Caviler font |
| Primary Text | `#041B45` | Deep Navy |
| Secondary Text | `#64748B` | Slate Gray |
| Success / Profit | `#059669` | Emerald Green |
| Error / Expense | `#DC2626` | Deep Red |
| Border / Divider | `#E5E0E4` | Soft Gray Divider |

### Font Assignments

| Element | Font | Weights |
|---|---|---|
| App Logo / Wordmark | Caviler | Regular |
| Page Headings | Sora | 600, 700 |
| Section Headings | Sora | 600 |
| UI & Body Text | Inter | 400, 500, 600 |
| Financial Data & Balances | Inter | 600, 700 (Tabular) |
| Buttons & Navigation | Inter | 500, 600 |
| Bangla Text & Numerals | Hind Siliguri | 400, 500, 600, 700 |

### Mobile-First Architectural Principles

- **Primary Viewport:** 360px – 440px mobile phone screens with desktop centering (`.mobile-shell`).
- **Touch Target Minimum:** 48px height on buttons and inputs for thumb ergonomics.
- **iOS Zoom Prevention:** Strict `16px` font size on all input fields.
- **Dynamic Viewport Height:** `100dvh` to handle mobile browser address bars without layout shift.
- **Safe Area Insets:** Full support for `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Tap Highlight Reset:** `-webkit-tap-highlight-color: transparent` for a native app feel.

---

**End of Digital-Somiti Design System v1.3**
