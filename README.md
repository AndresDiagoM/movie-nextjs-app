This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server, with the command `npm run dev` or `yarn dev`, `pnpm dev`, `bun dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Install tailwindcss

You can visit the [tailwindcss](https://tailwindcss.com/docs/guides/nextjs) website to install tailwindcss.

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

This will install the latest version of Tailwind CSS, PostCSS, and Autoprefixer.

## Technologies used in this project

- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) Next.js
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) TypeScript
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) Tailwind CSS
- ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) NextAuth.js
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) Prisma
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) Supabase
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL
- ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) Vercel

## Folder Structure

A scalable folder structure for a Next.js project should be organized in a way that promotes modularity, reusability, and maintainability. Here is a recommended folder structure:

```bash
/my-nextjs-app
|-- /public
|   |-- /images
|   |-- /fonts
|   |-- favicon.ico
|
|-- /src
|   |-- /app
|   |   |-- /components
|   |   |   |-- /common
|   |   |   |-- /layout
|   |   |   |-- /pages
|   |   |-- /hooks
|   |   |-- /services
|   |   |-- /styles
|   |   |-- /utils
|   |   |-- /pages
|   |       |-- /api
|   |       |-- /auth
|   |       |-- /dashboard
|   |       |-- _app.tsx
|   |       |-- _document.tsx
|   |       |-- index.tsx
|
|-- /tests
|   |-- /unit
|   |-- /integration
|
|-- .env
|-- .eslintrc.json
|-- .gitignore
|-- next.config.js
|-- package.json
|-- README.md
|-- tailwind.config.js
|-- tsconfig.json
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Streaming services used in this project

- Vidsrc (https://vidsrc.cc/)
- Vidsrc (https://vidsrc.xyz/)

The way to send the season and episode number to the video player is to use the following format:

```bash
https://vidsrc.cc/v2/embed/type/season/episode

https://vidsrc.cc/v2/embed/tv/tt0944947/1/5
```

## Wiki pages

For detailed information on authentication and using NextAuth.js, please refer to the [Wiki](https://github.com/AndresDiagoM/movie-nextjs-app/wiki) pages.

<!--
    VSCODE PROBLEM WITH TYPESCRIPT AND JAVASCRIPT, go to settings and search typescript.disableAutomaticTypeAcquisition and check

 -->

## DeepWiki

See the project documentation at [DeepWiki](https://deepwiki.com/AndresDiagoM/movie-nextjs-app/1-overview) for more information on how to use the project and its features.

## Code Quality & Formatting (Biome)

This project uses [Biome](https://biomejs.dev) for fast formatting, linting, and import organizing.

### Install (if not already installed globally)

Biome is a dev dependency when you first add it. If you haven't yet:

```bash
pnpm add -D @biomejs/biome
```

### VS Code Extension

1. Install the "Biome" extension (you already did this).
2. Open the command palette and run: `Biome: Restart Language Server` after changing `biome.json`.
3. Disable overlapping formatters to avoid conflicts:
   - Settings > search "Format On Save" keep enabled.
   - Set `"editor.defaultFormatter": "biomejs.biome"` for `typescript`, `typescriptreact`, `javascript`, `javascriptreact`.
   - Optionally disable ESLint's format capability (keep it only for rules not yet covered by Biome).

### Scripts

```bash
pnpm run biome:check   # Show diagnostics (lint + format issues)
pnpm run biome:fix     # Auto-fix + format everything
pnpm run lint:all      # Run Biome check then ESLint (framework/react specific rules)
```

### Recommended Workflow

- Rely on Biome for formatting & basic lint rules.
- Keep ESLint for Next.js / React specific rules not yet covered by Biome (e.g. `react-hooks/exhaustive-deps`).
- Gradually migrate rules: if Biome covers a rule, remove its ESLint counterpart to speed up dev.

### Pre-commit (Optional)

Add a simple pre-commit hook using `simple-git-hooks` or `husky` later:

```bash
pnpm add -D simple-git-hooks
```

In `package.json`:

```jsonc
"simple-git-hooks": {
    "pre-commit": "pnpm biome:fix"
}
```

Then enable:

```bash
pnpm dlx simple-git-hooks
```

### Config Overview

`biome.json` currently enforces:

- Line width: 100
- 2-space indentation
- Single quotes (JS/TS), double quotes for JSX
- Trailing commas where valid
- Organizes imports automatically

Adjust any of these in `biome.json` as needed.

### Disable a Rule Inline

```ts
// biome-ignore lint/suspicious/noExplicitAny: library typings require any here
function example(param: any) {}
```

Let me know if you want a full ESLint → Biome migration plan or to add a pre-commit hook automatically.
