---
trigger: always_on
---

---

## trigger: always_on

# Coding Styles

## CLI & Tooling

- **Package Manager**: Always use **`pnpm`** (e.g., `pnpm install`, `pnpm <script>`). Do not use `npm` or `yarn`.
- **TypeScript Execution**: Use **`tsx`** for running script files directly. Do not use `ts-node`.
- **Project Scripts**: Prefer running predefined scripts from `package.json` (e.g., `pnpm fix`, `pnpm check`).

## General Formatting

Common standards are governed by:

- **Prettier**: Rules in `.prettierrc`. Apply via `pnpm format`.
- **ESLint Stylistic**: Rules in `eslint.config.mjs`.
  - Use `pnpm lint` for static analysis.
  - Use `pnpm fix` for automated fixes.
- **Imports**: Use the `@/` alias for absolute project root imports.

## TypeScript Standard

- **Strict Typing**: No `any` (use `unknown` if the type is truly dynamic or unknown). Use strongly typed structures for mappings and events.
- **Declarations**: Prefer `type` over `interface`.
- **Returns**: Always explicitly define return types for functions.
