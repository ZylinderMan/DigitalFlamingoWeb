# Demo site (TypeScript + Vite)

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production files in dist/
    npm run typecheck  # also catches missing translations

- Colours / fonts / spacing: `src/styles/theme.css`
- Sections and their order: `src/sections/` (order in `src/sections/index.ts`)
- Languages: `src/i18n/locales/` (register new ones in `locales/index.ts`)
- Live demo: sector list in `src/demo/sectors.ts`, one layout per sector in `src/demo/templates/`,
  one stylesheet per sector in `src/styles/templates/`, texts under `sectors.*` and `templates.*` in each dictionary
- Demo links: `/#demo-building`, `/#demo-restaurant`, `/#demo-health` open the demo on that sector
- Contact email (footer): `src/config.ts`
