# Project: kmedia-mdb

**Stack:** React 18, Vite 7, Redux Toolkit + Redux-Saga, Tailwind CSS 3, SCSS/Sass, Express (SSR)

**Key dirs:**
- `src/components/` — React components, organized by feature/section
- `src/stylesheets/` — SCSS; main entry `Kmedia.scss`, feature partials in `includes/`
- `src/redux/` — Redux slices and actions
- `src/sagas/` — Redux-Saga side effects
- `e2e/` — Playwright E2E tests (TypeScript), organized by feature
- `server/` — Express dev/SSR server

**Testing:**
- Unit: Jest + React Testing Library (in `src/`)
- E2E: Playwright 4 projects — `desktop-en`, `desktop-he`, `mobile-en`, `mobile-he`; snapshot baseline = production screenshots

**i18n:** i18next, locale files in `public/locales/`

**Tasks contexts: **
@.claude/tailwind-migration.md
@.claude/upgrade_dep.md
@.claude/e2e.md
