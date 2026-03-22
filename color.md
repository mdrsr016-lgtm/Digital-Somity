# 🎨 Digital-Somiti — Color Palette & Usage Guide

> This document defines the **official brand color palette** for the Digital-Somiti project.  
> All developers and designers must follow this guide to ensure a consistent, professional, and aesthetic UI.

---

## 🖌️ Brand Colors

| Name   | Hex       | RGB               | CMYK           | CSS Variable          |
|--------|-----------|-------------------|----------------|------------------------|
| Black  | `#000000` | RGB 0, 0, 0       | 75, 68, 67, 90 | `--color-black`        |
| Violet | `#7D39EB` | RGB 125, 57, 235  | 67, 77, 0, 0   | `--color-violet`       |
| Lime   | `#C6FF33` | RGB 198, 255, 51  | 27, 0, 100, 0  | `--color-lime`         |
| White  | `#FFFFFF` | RGB 255, 255, 255 | 0, 0, 0, 0     | `--color-white`        |

---

## 🌑 Dark Mode — Color Role Mapping

| Role                  | Value                          | Usage                                      |
|----------------------|--------------------------------|--------------------------------------------|
| `--bg-main`          | `#000000` (Black)              | Page background                            |
| `--bg-sub`           | `#0f172a`                      | Secondary background sections              |
| `--card-bg`          | `rgba(25, 25, 28, 0.6)`        | Glassmorphism cards                        |
| `--sidebar-bg`       | `rgba(18, 18, 20, 0.95)`       | Sidebar panel                              |
| `--border-color`     | `rgba(255, 255, 255, 0.08)`    | Subtle borders on cards/inputs             |
| `--input-bg`         | `rgba(255, 255, 255, 0.03)`    | Input fields background                    |
| `--text-main`        | `#ffffff` (White)              | Primary text                               |
| `--text-sub`         | `rgba(255,255,255, 0.6)`       | Labels, hints, metadata                    |
| `--color-violet`     | `#7D39EB`                      | Brand accent — CTAs, active states, icons  |

---

## ☀️ Light Mode — Color Role Mapping

| Role                  | Value                          | Usage                                      |
|----------------------|--------------------------------|--------------------------------------------|
| `--bg-main`          | `#fcfcfd`                      | Page background                            |
| `--bg-sub`           | `#f8fafc`                      | Section backgrounds                        |
| `--card-bg`          | `rgba(255, 255, 255, 0.45)`    | Glassmorphism cards                        |
| `--sidebar-bg`       | `rgba(255, 255, 255, 0.95)`    | Sidebar panel                              |
| `--border-color`     | `rgba(255, 255, 255, 0.3)`     | Soft card/input borders                    |
| `--text-main`        | `#1a1a1a` (near Black)         | Primary text                               |
| `--text-sub`         | `#64748b`                      | Subtext, placeholders                      |
| `--color-violet`     | `#7D39EB`                      | Brand accent — same in both modes          |

---

## 🔑 Color Usage Rules (Where to Use What)

### ⚫ Black — `#000000`
> *The foundation. Power. Depth.*

- **Dark mode page/app background** — gives the premium OLED-dark feel
- **Text on Lime** — black text on `#C6FF33` buttons/badges for max contrast
- **Text on Violet** — dark overlays or shadows behind violet elements
- **Modal overlays** — `rgba(0,0,0,0.6)` for backdrop behind modals
- **DO NOT use** as text color on dark backgrounds — use `--text-sub` or White instead

---

### 🟣 Violet — `#7D39EB`
> *The soul of the brand. Energy. Innovation. Action.*

- **Primary action buttons** (`.admin-btn-primary`) — all main CTAs
- **Active sidebar/nav items** — gradient `#7D39EB → #6a2cd4`
- **Active input focus rings** — `box-shadow: 0 0 0 4px rgba(125,57,235,0.1)`
- **Logo & brand mark** backgrounds
- **Links and clickable text** — `.admin-btn-text`
- **Activity dots / status indicators** for system events
- **Permission checkboxes** when checked
- **Greeting highlights** — accent on user's name in dashboard greeting
- **Hover color** for topbar icons and profile button
- **Sub-nav hover background** — `rgba(125, 57, 235, 0.1)` tint
- **Avatar backgrounds** — gradient with `#7D39EB`
- **Stat icons for "activity" type** data

---

### 🟢 Lime — `#C6FF33`
> *The spark. Surprise. Energy. Conversion.*

- **Key highlight/accent** for numbers, badges, or "new" tags that must pop
- **Positive KPI accents** — e.g., growth indicators, success count
- **Call-to-action hover effect** — Lime glow on primary button hover
- **Notification badge** background on icon buttons
- **Special event tags** — premium badges, featured labels
- **Chart/graph accent color** for the primary metric line or bar
- ⚠️ **Always pair Lime with Black text** (`#000000`) — never use white text on Lime
- ⚠️ **Use sparingly** — Lime is a power color. Overuse kills its impact. Use for max 1-2 elements per view.

---

### ⚪ White — `#FFFFFF`
> *Clarity. Space. Elegance.*

- **Primary text color in dark mode** (`--text-main: #ffffff`)
- **Icon color on active/hover states** (icons inside violet buttons)
- **Text inside color-filled buttons** (Violet buttons, Red danger buttons)
- **Light mode backgrounds** — near-white `#fcfcfd` for page, `#f8fafc` for sections
- **Glassmorphism card text** — readable on dark glass backgrounds
- **Dividers / borders** — very-low-opacity white `rgba(255,255,255,0.08)` for dark mode borders

---

## 🎯 Semantic / Utility Colors (Supporting Palette)

These are NOT brand colors but are used as supporting semantics:

| Purpose        | Color      | Hex       | Usage                                     |
|----------------|------------|-----------|-------------------------------------------|
| Success/Green  | Emerald    | `#10b981` | Active user status, positive change stats |
| Info/Blue      | Blue       | `#3b82f6` | User count stats, info activity dots      |
| Revenue/Green  | Green      | `#22c55e` | Revenue stats, payment activity           |
| Danger/Red     | Red        | `#ef4444` | Logout button, delete actions, errors     |
| Orange         | Orange     | `#f97316` | Transaction avatars, warm accents         |
| Pink           | Pink       | `#ec4899` | Transaction avatars, diverse accents      |

---

## 💡 Pro Design Principles

### 1. Violet is the Anchor
Every page should visually route the eye toward at least one **Violet** element. It's the brand. If a page has no Violet, something is missing.

### 2. Lime is the Exclamation Mark
Use Lime only when you want the user to go **"wow"** or take action immediately. One Lime element per screen — maximum two.

### 3. Black + White = Professionalism
The dark base (`#000000`) with crisp white text gives the **premium SaaS** look. Don't clutter — let negative (dark) space breathe.

### 4. Glassmorphism Rules
Cards and sidebars use **blur + semi-transparent backgrounds**:
- Dark mode: `rgba(25, 25, 28, 0.6)` + `backdrop-filter: blur(24px)`
- Light mode: `rgba(255, 255, 255, 0.45)` + `backdrop-filter: blur(24px)`
- Always add a `border: 1px solid var(--border-color)` for depth

### 5. Gradient Strategy
- Primary gradient: `linear-gradient(135deg, #7D39EB, #6a2cd4)`
- Lime accent gradient: `linear-gradient(135deg, #C6FF33, #a8e620)` (hover only)
- Background gradient (light): `radial-gradient(circle at 10% 20%, rgb(224,242,254), rgb(255,255,255), rgb(241,245,249))`
- Never use rainbow gradients — keep it purple-forward

### 6. Typography Colors
- Headings → `var(--text-main)` with Outfit font, weight 700
- Body → `var(--text-main)` with Questrial font
- Labels/hints → `var(--text-sub)`
- Active/accent → `var(--color-violet)`

---

## 🧬 CSS Variable Declaration (index.css)

```css
:root {
  /* Brand Palette */
  --color-black:  #000000;
  --color-violet: #7D39EB;
  --color-lime:   #C6FF33;
  --color-white:  #FFFFFF;

  /* Lime tints */
  --color-lime-glow: rgba(198, 255, 51, 0.15);
  --color-lime-soft: rgba(198, 255, 51, 0.08);

  /* Violet tints */
  --color-violet-glow: rgba(125, 57, 235, 0.3);
  --color-violet-soft: rgba(125, 57, 235, 0.1);
  --color-violet-xsoft: rgba(125, 57, 235, 0.05);
}
```

---

## ✅ Quick Reference Cheat Sheet

| Element                  | Color to Use              |
|--------------------------|---------------------------|
| Page background (dark)   | `#000000` (Black)         |
| Page background (light)  | `#fcfcfd` (near White)    |
| Primary button           | `#7D39EB` (Violet)        |
| Button text              | `#FFFFFF` (White)         |
| Highlight / badge        | `#C6FF33` (Lime)          |
| Badge text               | `#000000` (Black on Lime) |
| Primary text (dark)      | `#FFFFFF` (White)         |
| Primary text (light)     | `#1a1a1a` (near Black)    |
| Sub-text                 | `rgba(255,255,255,0.6)`   |
| Icon hover               | `#7D39EB` (Violet)        |
| Active nav item          | Violet gradient           |
| Error / danger           | `#ef4444` (Red)           |
| Success / positive       | `#10b981` (Emerald)       |
| Card/panel background    | Glassmorphism (see above) |
| Input focus ring         | Violet soft glow          |
