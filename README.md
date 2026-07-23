# Remote Support Portal

A Next.js (App Router) proof-of-concept for field technicians: configure a job → pre-deployment safety briefing → a 3-tab support workspace (AI scoping chat → webcam recording → AI QA chat) → analysis screen.

## Run locally

```bash
npm install
npm run dev
```

Optional live AI (falls back to a scripted mock automatically if skipped or if it fails):
```bash
# .env.local
GROQ_API_KEY=your_key_here
```

---

## Folder structure — feature-based

```
app/(workflow)/        # thin Server Component pages (job-config, prep, activity, analysis)
app/api/chat/          # Route Handler — streams the AI response
features/
  job-config/  prep/  activity/  analysis/
    components/ hooks/ store/ actions/ constants/
  activity/tabs/{assessment,recording,qa}/   # each tab is its own self-contained slice
ui/        # dumb, reusable primitives (Button, Card, Timer...)
lib/       # generic, framework-agnostic hooks/utils (useTimer, cn())
proxy.ts   # middleware — route guards
```

Each phase of the mission owns its own components/hooks/store, instead of one global `components/` and `hooks/` folder. This keeps unrelated logic (e.g. the camera-permission hook vs. the chat hook) from living side by side just because they're "both hooks," and it maps 1:1 onto the product spec — "fix the prep countdown" → `features/prep/`, no grepping required. `ui/` and `lib/` are the only exception: code that's genuinely feature-agnostic (a `Button`, `useTimer`) lives there instead of being duplicated per feature.

---

## AI integration

The "Remote Expert" is wired to a real LLM (Groq, via the Vercel AI SDK) instead of only a hardcoded script — a Route Handler (`app/api/chat/route.ts`) proxies the request server-side (keeps the API key off the client) and streams tokens back.

**If it fails for any reason** — no API key, network drop, rate limit — `useAIChat` catches it and falls back to the deterministic mock script from the spec. The chat never breaks or gets stuck; it just quietly stops being "live."

---

## Server Actions vs. Route Handler

- **No database in this app.** Server Actions exist to mutate server-owned data; there's no server-owned data here to mutate for chat/job state, so most state (equipment/severity, tab progress, chat history) lives in Zustand + `localStorage`, updated by plain client-side calls.
- **Route Handler for chat** — because it needs to stream tokens from an external API (Groq). Server Actions return one resolved value; they don't fit a chunked, cancelable stream read via `ReadableStream`.
- **Two Server Actions do exist** — `confirmJobConfigured` and `confirmPrepCompleted` — but for a different reason: they mint the `httpOnly` cookies that `proxy.ts` uses for route protection (`/prep`, `/activity`). These used to be set via client-side `document.cookie`, which meant anyone could forge them from devtools and skip a phase. Moving that one write server-side, as `httpOnly`, closes that hole. Everything else stays client state on purpose — routing a chat keystroke or a tab-click through a Server Action would just add a network round-trip for something the client already owns correctly.

---

## Route protection — two layers, on purpose

- **Server layer (`proxy.ts` + the two Server Actions)** — the `httpOnly` cookies are the actual gate; they can't be forged from devtools and decide whether `/prep` or `/activity` are allowed to render at all.
- **Client layer (`PrepView`/`ActivityView` effects)** — separately re-checks the real data in Zustand (`equipment`, `severity`, `prepCompleted`) on every mount, and resets + redirects if it's missing.

Why both: the cookie only proves "this step was completed at some point" — it says nothing about whether the underlying data still exists. If someone clears `localStorage`, edits it directly in devtools, or opens the app in a second tab with a different storage state, the cookie could still say `job_configured=1` while `equipment`/`severity` are empty. The client-side check catches exactly that mismatch and bounces the user back to re-configure, instead of letting a phase render with missing data it actually depends on.

---

## Why the recorded video isn't persisted

There's no database and no cloud storage wired up (e.g. Cloudinary, S3) — this is a proof-of-concept, and adding one wasn't necessary to demonstrate the required MediaRecorder integration. The recorded Blob is kept in-memory in the Recording tab's component state and previewed via a local Object URL; it's never written to `localStorage` (Blobs don't serialize into JSON storage anyway) and never uploaded anywhere.

In a production version, this is exactly the piece that should move to a dedicated service — upload the blob to Cloudinary (or S3 + a processing queue) from a Route Handler, rather than holding it in the Next.js server's memory or trying to cram it into `localStorage`. Called out here deliberately rather than faked with a placeholder upload.