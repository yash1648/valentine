# Proposal App 💕

The interactive Valentine's proposal experience — powered by React, Framer Motion, Tailwind CSS, and Vite.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # → dist/
npm run preview
```

## Stack

- **React 19** — UI framework
- **Framer Motion 12** — Animations
- **Tailwind CSS v4** — Utility-first styling
- **Vite 8** — Build tool
- **Lucide React** — Icons

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Project Structure

```
src/
├── components/
│   ├── ProposalHero.jsx      # Main proposal card
│   ├── Confetti.jsx          # Celebration confetti burst
│   └── FloatingParticles.jsx # Ambient background particles
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
└── index.css                 # Global styles + Tailwind
```
