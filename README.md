# Shadcn Vite Starter

React + TypeScript + Vite starter aligned with the latest npm releases of the stack:

- Vite `7.1.12` with the React SWC plugin `4.2.0`
- React `19.2.0` + React DOM `19.2.0`
- Tailwind CSS `3.4.18`, Tailwind CSS Animate `1.0.7`, PostCSS `8.5.6`, Autoprefixer `10.4.21`
- shadcn/ui CLI `3.5.0` with preinstalled `button` component and Tailwind tokens
- Biome `2.3.2` for formatting and linting (`pnpm run lint`, `pnpm run format`)
- Class Variance Authority `0.7.1`, Tailwind Merge `3.3.1`, clsx `2.1.1`
- Phosphor Icons React `2.1.10`

> **Note:** Tailwind CSS `4.x` is tagged as `latest` on npm, but shadcn/ui currently targets the Tailwind `3.x` configuration API. To stay compatible we install the most recent `3.4.18` release and document this choice in `package.json`.

## Getting Started

```bash
# install dependencies
pnpm install

# start the dev server
pnpm dev

# run the Biome linter / formatter
pnpm lint
pnpm format

# create a production build
pnpm build
```

## Project Structure

- `src/index.css` contains Tailwind directives and design tokens used across shadcn/ui components.
- `src/lib/utils.ts` exposes a `cn` helper (clsx + tailwind-merge) shared by components.
- `src/components/ui/button.tsx` is scaffolded via `pnpm dlx shadcn@3.5.0 add button`.
- `biome.json` configures Biome with Tailwind-aware parsing and stylistic preferences.
- `components.json` keeps the shadcn/ui CLI pointed at Vite + `@/` aliases and the Phosphor icon set.
- `vite.config.ts` resolves the `@` alias and enables React SWC.

Add more shadcn components with:

```bash
pnpm dlx shadcn@3.5.0 add <component-name>
```

Components render under `src/components/ui` and respect the shared Tailwind token system.

## What’s Included

- Dark/light theme toggle with persisted preference.
- Landing hero showcasing Button usage and Phosphor icons.
- Strict TypeScript configuration and `@/` import alias across the app and build tooling.
- Biome-enforced formatting/linting with Tailwind directives enabled.

Feel free to extend the starter or adapt it to your design system by adjusting the CSS variables inside `src/index.css` and the Tailwind theme in `tailwind.config.js`.
