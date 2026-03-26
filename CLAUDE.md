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

## Frontend Work Rules
- **Always use GSAP** for entrance animations (ScrollTrigger, `once: true`, start `top 70-90%`)
- **Use Spline** for any 3D elements or visual flair
- **Check 21st.dev first** before building components from scratch
- **No Framer Motion** — GSAP is the animation standard here
- Stagger: 0.1–0.15s between animated items
- Easing: `expo.out` primary, `power3.out` fast

## Design Tokens
- BG: `#fff` (light) / `#1a1a1a` (dark: About, CTA, Footer)
- Text: `#000` primary / `#666666` secondary
- Font: Inter, weights 300–700
- All styles live in `src/index.css` (~2000+ lines) — use CSS vars, no inline styles

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
- WhatsApp: +973 3384 3915
- Budget currency: BHD
- Copyright: © 2026
