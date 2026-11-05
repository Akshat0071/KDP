# KDP GreenSource

Procurement and inventory dashboard for local green coffee buyers. The React app is built with Vite and includes inventory, order fulfillment, recommendations, transfers, catalogue, activity, analytics, and a central warehouse concept view.

## Development

```sh
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run lint` for Oxlint.

## Styling

Tailwind CSS v4 is integrated through the official Vite plugin. Use Tailwind utilities for new layout and standard spacing, sizing, and typography. Shared design tokens live in `src/styles/variables.css`; the global stylesheet and focused layout/page styles currently preserve existing domain-specific dashboard components while they are migrated incrementally.

## App Structure

- `src/App.jsx` defines routes; `src/components/layout/` contains the shared sidebar, topbar, and page shell.
- `src/components/ui/` contains reusable badges, KPI cards, filters, and section headers.
- `src/pages/LocalBuyer/` contains buyer workflows; `src/pages/CentralWarehouse/` contains the warehouse concept view.
- `src/data/mockData.js` supplies the simulated inventory and procurement data.