# RAL Agency Website — CLAUDE.md

## Project Overview
Premium portfolio SPA for **Revenue Automation Lab (RAL)**, Bahrain-based digital agency.
Single page app with anchor navigation, deployed on Netlify.

## Tech Stack
- React 18 + TypeScript + Vite
- GSAP + ScrollTrigger (primary animations)
- Lenis (smooth scroll)
- Pure vanilla CSS + CSS variables (no Tailwind/framework)
- Netlify forms (built-in form handling, no backend)

## Installed Frontend Design Tools
All of the following are installed and should be used for any frontend work:

| Tool | Purpose | How to use |
|---|---|---|
| **GSAP + ScrollTrigger** | Scroll animations, timelines, entrance effects | `import gsap from 'gsap'; import ScrollTrigger from 'gsap/ScrollTrigger'` |
| **Lenis** | Smooth scroll | Already configured in App.tsx |
| **@splinetool/react-spline** | 3D scenes/objects | `import Spline from '@splinetool/react-spline'` |
| **@splinetool/runtime** | Spline runtime (loaded by react-spline) | Auto |
| **Three.js + @types/three** | Custom 3D, WebGL | `import * as THREE from 'three'` |
| **21st.dev** | Pre-built animated components | Browse https://21st.dev — no install needed |
| **shadcn MCP** | Component search & examples via MCP | Auto-available via `.mcp.json` |

## MCP Servers
- **shadcn** — configured in `.mcp.json` (project root). Initialized via `npx shadcn@latest mcp init --client claude`. Use for component search, examples, and shadcn/ui integration guidance.

### Still needs one-time setup (run in project root):
```bash
npm install -g uipro-cli && uipro init --ai claude
claude plugin install frontend-design@claude-plugins-official
```

## Design Context

The full design intent — users, brand personality, aesthetic direction, principles — lives in [`.impeccable.md`](./.impeccable.md). Read it before any design or frontend work. Quick summary:

- **Audience**: GCC founders/SMBs **and** enterprise procurement, equally weighted. Warmth + clarity is the baseline; depth is optional.
- **Voice**: confident, founder-led, technically serious. First-person, conversational. Avoid corporate passive voice and hype words.
- **Aesthetic**: dark-only, purple/violet atmosphere with Spline 3D centerpiece. Visual density is at ceiling — new work should add personality (copy, micro-interactions), not more polish (glows, gradients, scroll-pins).
- **Lean warm**: when pulled between elite-futuristic and warm-founder-led, lean warm.
- **Anti-aesthetics to kill**: generic dev-shop templates, AI-slop landing pages, corporate consulting sterility, crypto/web3 hype.
- **Accessibility**: not currently addressed; explicitly deprioritized for now.

## Frontend Work Rules
- **Always use GSAP** for entrance animations (ScrollTrigger, `once: true`, start `top 70-90%`)
- **Use Spline** for any 3D elements or visual flair
- **Check 21st.dev first** before building components from scratch
- **No Framer Motion** — GSAP is the animation standard here
- Stagger: 0.1–0.15s between animated items
- Easing: `expo.out` primary, `power3.out` fast

## Design Tokens
CSS variables defined in `src/index.css` (`:root`). Per-component styles live in their own `.css` files (e.g. `Hero.css`, `Contact.css`) — `index.css` is just tokens + base resets.

**Core palette** (dark only — no light mode):
- `--color-bg: #0c0715` (near-black with violet cast)
- `--color-surface: #160e27` (used for About, CTA, Footer, Contact sidebar)
- `--color-surface-2: #2b1b3d`
- `--color-text: #f8f8f8` / `--color-text-secondary: #d1c4e9` (lavender)
- `--color-border: rgba(209, 196, 233, 0.1)` / `--color-border-active: rgba(209, 196, 233, 0.22)`

**Accents** (used inline, not tokenized):
- `#a78bfa` — lavender purple, focus rings / active states
- `rgba(180, 80, 255, …)` — vivid purple glows (radial gradients, text-shadow halos)
- `#4af5c0` — mint, reserved for "live" pulses (`.label-pulse` only)

**Type**:
- Font: Inter, weights 300–700, fluid `clamp()` sizing
- Letter-spacing: tight on display (-0.02 to -0.04em), loose on eyebrows (0.1 to 0.28em)

**Easing**:
- `--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)` (primary)
- `--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94)`

## Architecture
- State: `useState` only. `isContactOpen` lifted to App level, passed as props
- No router — anchor link navigation
- All components in `src/components/`
- Modals: body overflow hidden, GSAP timeline for open/close

## Sections (top → bottom)
Navbar → Hero → About (dark) → Services → Portfolio → CTA (dark) → Footer (dark)

## Currently Commented Out
- `<Featured />` and `<Showreel />` in App.tsx (components exist, not rendered)

## Business Details
- Email: info@revenueautomationlab.com
- WhatsApp: +973 6638 6602
- Budget currency: BHD
- Copyright: © 2026
