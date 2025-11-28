# Icon Generator Atelier

A React + Fastify workspace that turns a single prompt into a quartet of stylistically aligned 512×512 icons using Replicate's `black-forest-labs/flux-schnell` model.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Zustand, Framer Motion, custom glassmorphic design system.
- **Backend:** Fastify 5, TypeScript, Zod validation, Axios client for Replicate.
- **Testing:** Vitest unit + integration tests.

## Getting Started

```bash
cp .env.example .env
# populate REPLICATE_API_TOKEN
npm install
```

### Backend

```bash
npm run dev:backend   # Fastify dev server on http://localhost:4000
npm run build --workspace backend
npm run test  --workspace backend
```

Environment variables:

| Key | Description |
| --- | --- |
| `REPLICATE_API_TOKEN` | Required, token for Replicate flux-schnell model |
| `PORT` | Optional, defaults to 4000 |
| `ALLOWED_ORIGINS` | Optional comma-separated CORS origins |

### Frontend

```bash
npm run dev:frontend  # Vite dev server on http://localhost:5173
npm run build --workspace frontend
```

The frontend expects `VITE_API_BASE_URL` to point to the deployed backend.

## Deployment Notes

- **Backend:** Deploy to Render/Railway/Fly. Set `REPLICATE_API_TOKEN`, `PORT`, `ALLOWED_ORIGINS`, `HOST`. Build command `npm install && npm run build --workspace backend`; start command `npm run start --workspace backend`.
- **Frontend:** Deploy static build to Vercel/Netlify. Set `VITE_API_BASE_URL` to backend URL and run `npm install && npm run build --workspace frontend`.
- Ensure HTTPS between frontend and backend for Replicate token security.

## Testing

```bash
npm run test --workspace backend
```

Tests cover prompt building logic and the `/api/icons/generate` route (Replicate client mocked).

## Design System

- Three-container layout (breadcrumbs, command header, result grid) inspired by Venngage admin UI
- Glassmorphic panels, cinematic gradients, shimmering skeletons, palette chips, download menu with PNG/JPG options.
- Optional HEX palette inputs steer the model while preserving cohesive styling.
