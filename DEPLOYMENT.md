# Deploying to Vercel

This is a **TanStack Start** app (SSR) built by Vite + Nitro. On Vercel it builds to the
[Build Output API](https://vercel.com/docs/build-output-api/v3) directory `.vercel/output`:
static assets are served from the CDN and SSR runs in a single Node.js 22 serverless
function (`__server.func`).

## Files that make this work

| File | Purpose |
| --- | --- |
| `vercel.json` | Pins install/build commands and forces the Nitro `vercel` preset. |
| `.vercelignore` | Keeps local build dirs and the Bun lockfile out of the upload so Vercel uses npm. |
| `.env.example` | Documents the env vars you must add in the Vercel dashboard. |
| `package.json` → `engines.node` | Pins the runtime to Node 22. |

No `outputDirectory` is set on purpose — Vercel auto-detects `.vercel/output`.

## Steps

1. Push this project to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project → Import** the repository.
3. Leave the framework preset as **Other** (`vercel.json` already sets the commands).
4. Add environment variables (Settings → Environment Variables), for Production,
   Preview and Development:

   - `VITE_STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (`pk_live_…` / `pk_test_…`)

   `VITE_*` vars are inlined at **build time**, so changing one requires a redeploy.
5. Deploy.

### CLI alternative

```sh
npm i -g vercel
vercel        # preview deployment
vercel --prod # production
```

## Verifying the build locally

```sh
NITRO_PRESET=vercel npm run build   # PowerShell: $env:NITRO_PRESET="vercel"; npm run build
npx vite preview
```

Expected output tree:

```
.vercel/output/
  config.json
  static/                  # CDN assets
  functions/__server.func/ # SSR handler (nodejs22.x)
```

## Notes

- Do **not** commit `.env`; it is now gitignored. Rotate the Stripe key if it was
  already pushed to a public repository.
- The app currently ships with mock data (`src/data/mockData.js`) and client-side
  session/state contexts, so no database env vars are required yet.
- Only the publishable Stripe key is used client-side. If you later add a secret key,
  put it in a Vercel env var **without** the `VITE_` prefix so it never reaches the bundle.
