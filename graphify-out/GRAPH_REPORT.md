# Graph Report - .  (2026-04-18)

## Corpus Check
- Corpus is ~39,445 words - fits in a single context window. You may not need a graph.

## Summary
- 146 nodes · 145 edges · 29 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Endpoints & App Root|API Endpoints & App Root]]
- [[_COMMUNITY_Landing Page UI|Landing Page UI]]
- [[_COMMUNITY_OG Image Brand Badges|OG Image Brand Badges]]
- [[_COMMUNITY_Brand Color System|Brand Color System]]
- [[_COMMUNITY_Scroll & Animation Hooks|Scroll & Animation Hooks]]
- [[_COMMUNITY_Dashboard View|Dashboard View]]
- [[_COMMUNITY_Team Photos|Team Photos]]
- [[_COMMUNITY_Analytics Charts|Analytics Charts]]
- [[_COMMUNITY_SolarNexa Logo Assets|SolarNexa Logo Assets]]
- [[_COMMUNITY_Email API Handler|Email API Handler]]
- [[_COMMUNITY_Installations Page|Installations Page]]
- [[_COMMUNITY_App Router|App Router]]
- [[_COMMUNITY_About Page (Dashboard)|About Page (Dashboard)]]
- [[_COMMUNITY_Legal Pages|Legal Pages]]
- [[_COMMUNITY_Public About Page|Public About Page]]
- [[_COMMUNITY_App Shell Component|App Shell Component]]
- [[_COMMUNITY_Custom Cursor|Custom Cursor]]
- [[_COMMUNITY_Dark Room Reveal Effect|Dark Room Reveal Effect]]
- [[_COMMUNITY_Map Modal|Map Modal]]
- [[_COMMUNITY_Particles Component|Particles Component]]
- [[_COMMUNITY_Preloader Component|Preloader Component]]
- [[_COMMUNITY_Tree Canvas Component|Tree Canvas Component]]
- [[_COMMUNITY_Tree SVG Component|Tree SVG Component]]
- [[_COMMUNITY_Catch-all Email Route|Catch-all Email Route]]
- [[_COMMUNITY_Express Server|Express Server]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Vite Build Config|Vite Build Config]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]

## God Nodes (most connected - your core abstractions)
1. `Frontend Layer (React 18 + Vite + TailwindCSS)` - 10 edges
2. `OG Image SVG (Open Graph Social Card)` - 10 edges
3. `SolarNexa Logo SVG` - 10 edges
4. `Backend Layer (Node.js + Express)` - 7 edges
5. `Solar Tree Concept (Nature + Technology)` - 6 edges
6. `SolarNexa Smart Solar Management Platform` - 5 edges
7. `SolarNexa Brand Identity` - 5 edges
8. `SolarNexa Brand Identity` - 5 edges
9. `SolarNexa Logo / Brand Identity` - 5 edges
10. `handler()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Landing()` --calls--> `useBgWarmth()`  [INFERRED]
  frontend\src\pages\Landing.jsx → frontend\src\hooks\useBgWarmth.js
- `Landing()` --calls--> `useReveal()`  [INFERRED]
  frontend\src\pages\Landing.jsx → frontend\src\hooks\useReveal.js
- `Landing()` --calls--> `useVarFontScroll()`  [INFERRED]
  frontend\src\pages\Landing.jsx → frontend\src\hooks\useVarFontScroll.js
- `SolarNexa Smart Solar Management Platform` --conceptually_related_to--> `SolarNexa Vercel Deployment`  [INFERRED]
  README.md → frontend/public/robots.txt
- `SolarNexa Logo SVG` --implements--> `Brand Color: Highlight Orange (#FF9000)`  [EXTRACTED]
  frontend/public/solarnexa-logo.svg → frontend/src/assets/solarnexa-logo.svg

## Hyperedges (group relationships)
- **Frontend Technology Stack** — readme_react18, readme_vite, readme_tailwindcss, readme_reactrouter, readme_axios [EXTRACTED 1.00]
- **Backend Technology Stack** — readme_nodejs, readme_express, readme_serverjs [EXTRACTED 1.00]
- **SolarNexa Full-Stack Application** — readme_solarnexa, readme_frontend, readme_backend, readme_appjsx, readme_viteconfig [EXTRACTED 1.00]

## Communities

### Community 0 - "API Endpoints & App Root"
Cohesion: 0.11
Nodes (22): API Endpoint: GET /api/health, API Endpoint: GET /api/installations, App.jsx, Axios, Backend Layer (Node.js + Express), CleanTech Operators (Target Users), Shared UI Components (Navbar, â€¦), Express (+14 more)

### Community 1 - "Landing Page UI"
Cohesion: 0.11
Nodes (0): 

### Community 2 - "OG Image Brand Badges"
Cohesion: 0.22
Nodes (13): Badge: CleanTech, Domain Badge: solarnexa.vercel.app, EV Charging Station Visual Element, Badge: Bengaluru Â· 2023, OG Image SVG (Open Graph Social Card), Solar Panel Visual Elements on Tree Branches, SolarNexa Brand Identity, SolarTree Logomark (Sun + Tree + Panels) (+5 more)

### Community 3 - "Brand Color System"
Cohesion: 0.38
Nodes (11): Brand Color: Deep Charcoal (#1C1814), Brand Color: Highlight Orange (#FF9000), Brand Color: Solar Red (#D93B2B), SolarNexa Brand Identity, EV Charging / Clean Energy Delivery, Solar Tree Concept (Nature + Technology), EV Charge Station at Base, Solar Panels on Branches (+3 more)

### Community 4 - "Scroll & Animation Hooks"
Cohesion: 0.25
Nodes (4): Landing(), useBgWarmth(), useReveal(), useVarFontScroll()

### Community 5 - "Dashboard View"
Cohesion: 0.29
Nodes (2): Dashboard(), getGreeting()

### Community 6 - "Team Photos"
Cohesion: 0.29
Nodes (7): cv Team Member, hn Team Member, lc Team Member, sg Team Member, sk Team Member, SolarNexa Team, Siddharth P J - Team Photo

### Community 7 - "Analytics Charts"
Cohesion: 0.33
Nodes (0): 

### Community 8 - "SolarNexa Logo Assets"
Cohesion: 0.53
Nodes (6): Battery / Energy Storage Icon, SolarNexa Logo / Brand Identity, Brand Color Palette (Dark Charcoal, Red-Orange, White), Solar Panel Array on Tree Branches, Solar Tree Visual Motif, Stylized Sun Icon

### Community 9 - "Email API Handler"
Cohesion: 0.7
Nodes (4): getProviderErrorDetail(), handler(), isResendTestingRecipientError(), json()

### Community 10 - "Installations Page"
Cohesion: 0.4
Nodes (0): 

### Community 11 - "App Router"
Cohesion: 0.5
Nodes (0): 

### Community 12 - "About Page (Dashboard)"
Cohesion: 0.5
Nodes (0): 

### Community 13 - "Legal Pages"
Cohesion: 0.5
Nodes (0): 

### Community 14 - "Public About Page"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "App Shell Component"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Custom Cursor"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Dark Room Reveal Effect"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Map Modal"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Particles Component"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Preloader Component"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Tree Canvas Component"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Tree SVG Component"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Catch-all Email Route"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Express Server"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Tailwind Config"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Vite Build Config"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **25 isolated node(s):** `React 18`, `Vite`, `TailwindCSS`, `Node.js`, `Express` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Shell Component`** (2 nodes): `AppShell()`, `AppShell.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Custom Cursor`** (2 nodes): `SNCursor.jsx`, `SNCursor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dark Room Reveal Effect`** (2 nodes): `SNDarkRoom.jsx`, `SNDarkRoom()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Map Modal`** (2 nodes): `SNMapModal.jsx`, `SNMapModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Particles Component`** (2 nodes): `SNParticles.jsx`, `SNParticles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Preloader Component`** (2 nodes): `SNPreloader.jsx`, `SNPreloader()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tree Canvas Component`** (2 nodes): `SNTreeCanvas.jsx`, `SNTreeCanvas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tree SVG Component`** (2 nodes): `SNTreeSVG.jsx`, `SNTreeSVG()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Catch-all Email Route`** (1 nodes): `[...route].js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Express Server`** (1 nodes): `server.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Build Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Landing()` connect `Scroll & Animation Hooks` to `Landing Page UI`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `SolarNexa Logo SVG` (e.g. with `SolarNexa Brand Identity` and `Solar Tree Concept (Nature + Technology)`) actually correct?**
  _`SolarNexa Logo SVG` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Solar Tree Concept (Nature + Technology)` (e.g. with `Sun Icon (Corona + Rays + Core)` and `Tree Trunk and Branches`) actually correct?**
  _`Solar Tree Concept (Nature + Technology)` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `React 18`, `Vite`, `TailwindCSS` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Endpoints & App Root` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Landing Page UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._