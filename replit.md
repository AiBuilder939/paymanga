# Shar Institute

A full-stack course registration web application for Shar Institute.

## Stack

- **Frontend:** React 19 + Vite 7, Tailwind CSS 4, TanStack Query, Wouter — `artifacts/shar-institute/`
- **API Server:** Express 5, TypeScript, esbuild — `artifacts/api-server/`
- **Database:** PostgreSQL (Replit built-in) + Drizzle ORM — `lib/db/`
- **API contract:** OpenAPI spec in `lib/api-spec/openapi.yaml`; client generated via Orval into `lib/api-client-react/`
- **Package manager:** pnpm workspaces (Node 24)

## Running locally

Two workflows must be running:

| Workflow | Command | Port |
|---|---|---|
| `API Server` | `PORT=8080 pnpm --filter @workspace/api-server run dev` | 8080 |
| `Shar Institute` | `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/shar-institute run dev` | 5173 |

## Required secrets

| Key | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Protects admin routes on the API server |
| `DATABASE_URL` | Injected automatically by Replit (do not set manually) |

## Schema

Push schema changes to the dev database:

```bash
pnpm --filter @workspace/db push
```

## API codegen

After editing `lib/api-spec/openapi.yaml`, regenerate the client:

```bash
pnpm run --filter @workspace/api-spec codegen
```

## User preferences

- Use pnpm for all package management (npm/yarn are blocked by a preinstall guard).
