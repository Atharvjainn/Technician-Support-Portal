# Remote Support Portal

A proof-of-concept Next.js application for a **Remote Field Technician Support Portal**. A technician configures a job, sits through a pre-deployment safety briefing, then works through a three-tab remote support workspace (live AI scoping chat → screen/webcam recording → AI QA chat) before landing on a placeholder performance-analysis screen.

Built with the App Router, TypeScript, Tailwind CSS, and Zustand — no database, no auth, everything runs client-side against `localStorage` with cookies used only as a lightweight route-guard signal.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The flow starts at `/` (Job Configuration) and walks you through `/prep` → `/activity` → `/analysis`.

### Optional: live AI expert (bonus feature)

The "Remote Expert" is wired to a real LLM via the [Vercel AI SDK](https://sdk.vercel.ai/) and [Groq](https://groq.com/) (`llama-3.3-70b-versatile`), not just a hardcoded script. To enable it, add a free Groq API key:

```bash
# .env.local
GROQ_API_KEY=your_key_here
```

Without a key (or if the request fails for any reason), the app **silently falls back** to the deterministic mock script described in the assignment appendix — the chat experience never breaks, it just stops being "live."

---

## Folder Structure

```
app/
  (workflow)/
    page.tsx              # Phase 1 — Job Configuration (Server Component)
    prep/page.tsx         # Phase 2 — Pre-Deployment Briefing
    activity/page.tsx     # Phase 3 — Support Workspace
    analysis/page.tsx     # Placeholder Performance Analysis screen
  api/
    chat/route.ts         # Route Handler — streams responses from Groq
  layout.tsx              # Root layout — fonts, <Navbar />, shell
  loading.tsx             # Route-level Suspense fallback
  error.tsx               # Root error boundary

features/
  job-config/             # Phase 1 feature slice
    components/  hooks/  schemas/  store/  types/  constants/
  prep/                   # Phase 2 feature slice
    components/  hooks/  store/  constants/
  activity/               # Phase 3 feature slice
    components/                       # shell: timer, tab nav, chat bubbles
    store/                            # activity.store.ts — tab lock state, chat, timer
    tabs/
      assessment/  components/ constants/ hooks/
      recording/    components/ hooks/
      qa/           components/ constants/
  analysis/               # Phase 4 feature slice

ui/                       # Dumb, reusable, presentational primitives
  Button.tsx  Card.tsx  Container.tsx  Navbar.tsx  RadialTimer.tsx  Section.tsx

lib/
  hooks/                  # Generic, feature-agnostic hooks (useTimer, useHydration)
  utils.ts                # cn() class merge helper, speechSynthesis wrapper

proxy.ts                  # Route-guard middleware (see "Route Protection" below)
```

### Why feature-based, not type-based

The alternative — one global `components/`, one global `hooks/`, one global `store/` — falls apart the moment the app has more than one workflow step. It forces you to prefix everything (`PrepTimer`, `ActivityTimer`, `JobConfigCard`) just to avoid collisions, and it scatters a single feature's logic across three unrelated folders, so understanding "how does Prep work" means jumping between `components/PrepView.tsx`, `hooks/useCameraPermission.ts`, and `store/prepStore.ts` with no folder boundary telling you they belong together.

Feature-based structure inverts that: **each phase of the mission (`job-config`, `prep`, `activity`, `analysis`) is a vertical slice** that owns its own `components/`, `hooks/`, `store/`, `constants/`, and `schemas/`. A few concrete payoffs specific to this app:

- **`activity` is the one feature that's actually complex** (three tabs, each with its own chat script, media pipeline, and lock state), so it gets its own internal `tabs/assessment`, `tabs/recording`, `tabs/qa` sub-slices — each tab is a self-contained folder with its own hook (`useAIChat`, `useMediaRecorder`) and its own component. Deleting or replacing "Tab 2" never risks touching Tab 1 or Tab 3's files.
- **Only truly generic, feature-agnostic code lives outside `features/`** — `ui/` holds dumb, prop-driven primitives (a `Button`, a `Card`, a `RadialTimer`) that don't know what a "mission" or a "job" is; `lib/` holds framework-agnostic helpers (`useTimer`, `useHydration`, `cn()`) that any feature could reuse. If a hook or component needs to import a Zustand store or knows about "equipment severity," it belongs in `features/`, not `ui/` or `lib/`.
- **Onboarding a new developer is a directory listing, not a grep.** "I need to fix the countdown on the prep screen" → `features/prep/`. "The recording button doesn't disable properly" → `features/activity/tabs/recording/`. Nothing is scattered.
- It also maps 1:1 onto the assignment's own phases (Job Config → Prep → Activity → Analysis), so the codebase's shape mirrors the product spec instead of an arbitrary technical taxonomy.

---

## Server vs. Client Components

The guiding rule applied throughout: **`app/*/page.tsx` files are Server Components by default and stay that way** — they do nothing but compose a `<Container>` and hand off to a single feature-level Client Component:

```tsx
// app/(workflow)/prep/page.tsx — Server Component
import { Container } from "@/ui/Container";
import { PrepView } from "@/features/prep/components/PrepView";

export default function PrepPage() {
  return (
    <Container>
      <PrepView />
    </Container>
  );
}
```

`"use client"` only starts at the boundary where a browser API, interactivity, or a Zustand store read is actually required — `PrepView`, `ActivityView`, `JobConfig`, and so on. This keeps the server-rendered shell (layout, navbar, static safety copy, page scaffolding) out of the client bundle, and it means React Server Components never have to "guess" — every client boundary in this repo needs a client boundary, because every one of them touches something server rendering fundamentally cannot do:

| Client-only code | Why it can't be a Server Component |
|---|---|
| `useCameraPermission` / `useMediaRecorder` | Calls `navigator.mediaDevices.getUserMedia` and `MediaRecorder` — browser-only globals that don't exist during server rendering; referencing them in a Server Component throws at build/render time, not just "doesn't work." |
| Mock WebSocket/expert chat (`useAIChat`) + `window.speechSynthesis` | Holds live UI state (typing indicators, streamed tokens) and calls a `window` API; both require a persistent client instance, not a one-shot server render. |
| Timers (`useTimer`, prep countdown, activity 10-minute timer, tab lock state) | `setInterval`/`Date.now()`-driven countdowns that must survive re-renders and update the DOM every second — impossible without a client-side effect loop. |
| Zustand stores (`job-config`, `prep`, `activity`) | Persisted to `localStorage`, which doesn't exist on the server; every store subscription is inherently a client concern. |

Everything static — the job-selection copy, the safety-instructions text, the navbar shell, the analysis placeholder's layout — is left as a Server Component (or plain server-rendered markup) so it ships zero JS for logic it doesn't need.

---

## Server Actions vs. Route Handlers

The assignment explicitly asks for a "conscious choice" here, and the honest answer for this app is: **there's only one server-side operation in the whole flow — proxying a chat message to Groq — and it's a Route Handler (`app/api/chat/route.ts`), not a Server Action.**

**Why not Server Actions:** Server Actions exist to make *form-driven, single-request UI mutations* feel native — submit a form, mutate some data (usually in a database), get a fresh server-rendered result back, often paired with `revalidatePath`. This app has **no database and no server-owned data to mutate**. Every piece of state that "Server Actions vs. mutations" normally refers to — job selection, prep completion, tab progress, recorded video blobs, chat history — is deliberately kept **client-side in Zustand + `localStorage`** (see Data Persistence below), because there's no backend record for a Server Action to act on. Calling a Server Action just to set a value in a client store you already have direct access to would be pure overhead: an extra server round-trip for something a plain `onClick` handler already does correctly.

**Why a Route Handler for the chat call:** The one server-side call this app makes is fundamentally different — it's not "mutate my own data," it's "call an external, third-party service (Groq) and stream the tokens back as they arrive." That's a textbook Route Handler use case:

- It's a **RESTful boundary to an external API**, not a UI-state mutation — the Route Handler's only job is to hide the Groq API key server-side and forward the request.
- It needs to **stream** (`result.toTextStreamResponse()`), and Server Actions are built around a single resolved return value, not a chunked, cancelable HTTP stream that the client reads token-by-token with a `ReadableStream` reader.
- If this were ever pulled out into the optional separate backend the assignment mentions (see below), a Route Handler already speaks the same "plain HTTP JSON in, stream out" language a standalone Express/FastAPI service would — a Server Action does not translate to that world at all.

So the split in this codebase is simple: **no database ⇒ no Server Actions**; **one external streaming API call ⇒ one Route Handler**, and every other state change is a direct, synchronous Zustand store update, which is the correct "third option" when the mutation target is the client's own local state rather than a server resource.

---

## Route Protection

Rather than a layout-level check or scattering guard logic across every page, the repo uses a single middleware file (`proxy.ts` — Next's App Router convention for what used to be `middleware.ts`) that inspects two lightweight cookies before a protected route is even allowed to render:

```ts
export function proxy(request: NextRequest) {
  const jobConfigured = request.cookies.get("job_configured")?.value === "1";
  const prepCompleted = request.cookies.get("prep_completed")?.value === "1";

  if (pathname.startsWith("/prep") && !jobConfigured) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/activity") && !prepCompleted) {
    return NextResponse.redirect(new URL("/prep", request.url));
  }
}
```

The tricky part: the *real* source of truth (equipment/severity selection, prep completion) lives in Zustand, persisted to `localStorage` — and middleware runs at the edge, before any JS executes, so it **cannot read `localStorage`**. The fix is that each store subscribes to its own state and mirrors just the one boolean the guard cares about into a cookie as a side effect:

```ts
// job-config.store.ts
useMissionStore.subscribe((state) =>
  syncJobConfiguredCookie(state.equipment, state.severity)
);
```

So `localStorage` stays the single source of truth for actual data, and the cookie is purely a same-boolean mirror that middleware is capable of reading. This closes the exact hole the assignment calls out: typing `/activity` directly in the address bar with no prior state hits the middleware before any React ever mounts, and gets redirected to `/prep` (or `/` if there's no job at all) server-side.

Tab-level protection inside `/activity` (can't jump to Tab 3 without finishing Tab 2) doesn't need middleware, since it's not a URL — it's client-side state in `activity.store.ts`. `setActiveTab` simply refuses to switch to a tab whose `tabStates` entry is still `"locked"`, and `ActivityView` additionally redirects back to `/prep` if it ever detects the active tab shouldn't be reachable, closing the same hole for in-page state instead of routes.

---

## Data Persistence

There's no backend database, so "persistence" here means **Zustand's `persist` middleware writing to `localStorage`**, one store per feature slice (`mission-config`, `prep-state`, `activity-state`). Each store is deliberate about *when* it writes, not just *that* it writes:

- **Job Configuration** — every selection (`setEquipment`, `setSeverity`) commits immediately. It's a single click, there's no "in-progress" state worth debouncing, and the next screen needs the value right away.
- **Prep** — `completed` and `countdownStartedAt` persist so a refresh mid-briefing doesn't restart the 30-second timer from zero; `countdownStartedAt` is set once and guarded (`if (get().countdownStartedAt !== null) return`) so re-mounts can't reset an already-running countdown.
- **Activity** — the highest-stakes store, since it holds three separate things with different write patterns:
  - **Chat messages** (`addAssessmentMessage`, `addQAMessage`) commit **on receipt of each message**, not on keystroke — the user's in-progress typing in the input box is local `useState` inside the tab component and never touches `localStorage` until it's actually sent. This avoids write-thrashing on every keystroke while still surviving a refresh mid-conversation.
  - **Tab completion / lock state** (`tabStates`) commits **on each "Completed – Next" click** — this is the one thing that must never be lost, since it's what the middleware-adjacent client guard uses to stop someone from re-opening a finished tab.
  - **The global 10-minute timer** persists only `timerStartedAt` (a timestamp), not a live countdown — the remaining time is *derived* on every render (`Date.now() - timerStartedAt`) via the shared `useTimer` hook, so a tab refresh doesn't grant extra time or desync from wall-clock reality.
- **Recorded video** is deliberately **not** persisted to `localStorage` — a Blob doesn't serialize sensibly into JSON storage, and video data is exactly the kind of "heavy, long-running" payload the assignment's optional-backend section flags as something a real deployment would offload to dedicated storage/processing rather than the main app tier. For this proof-of-concept, the blob lives in the recording tab's own component state and is exposed via an in-memory Object URL for local preview, which is honest about the boundary without overengineering a fake upload pipeline.

Hydration is handled explicitly rather than assumed: `useHydration` / `useMissionHydration` gate rendering until each relevant store has rehydrated from `localStorage`, so `ActivityView` never briefly flashes a "redirect to `/`" decision based on the store's default (empty) in-memory state before `localStorage` has actually been read.

---

## Browser-Only APIs & Isolation

`getUserMedia`, `MediaRecorder`, and `window.speechSynthesis` all only exist in the browser, so every hook that touches them (`useCameraPermission`, `useMediaRecorder`, the `speak()` helper) is confined to Client Components, and none of that code is ever imported by a Server Component or a `page.tsx`. This matters for two reasons beyond "it would crash": referencing `navigator` or `window` at module scope in code that Next.js tries to evaluate on the server (even just to check its type) throws immediately during the server render pass, and even if it didn't crash, shipping a browser API call into server-rendered HTML makes no sense — the server has no camera, no microphone, and no speech engine to call. Isolating these to the smallest possible client boundary (an individual hook or tab component, not the whole page) also keeps the server-renderable parts of `/activity` — the tab shell, the timer's static markup, the navigation — outside the client bundle where they don't need to be.

---

## Error Handling

The assignment's one required real failure case — the user denying camera/mic permission on the Prep page — is handled with dedicated state, not a try/catch that silently swallows the error. `useCameraPermission` distinguishes three failure shades: `"denied"` (first refusal — recoverable, show a retry button), `"blocked"` (denied twice — likely a browser-level block, so the retry copy changes to point at browser settings instead of just re-prompting), and `"granted"`. The Prep page reads this state directly and blocks the "Acknowledge & Proceed" action while permission isn't granted, so the user can never wander into Phase 3 unaware their camera won't work there.

Two more layers back that up structurally rather than case-by-case:

- **`app/error.tsx`** is a root error boundary — any unexpected render-time exception anywhere in the tree gets a "Something went wrong / Try Again" recovery screen instead of a hard crash, satisfying the "don't let it hard-crash" requirement even for failures outside the camera-permission happy/unhappy paths.
- **The AI chat call has a graceful network-failure fallback** — `useAIChat`'s `fetch("/api/chat")` is wrapped in try/catch, and if the live Groq call fails (missing key, network drop, rate limit) it falls back to the deterministic mock script from the assignment appendix rather than leaving the chat stuck or throwing to the error boundary. Field technicians on poor connections were explicitly called out in the brief, and this is the one place a real network call exists in the flow.

---

## Loading States & UX

- **`app/loading.tsx`** provides the route-transition fallback the App Router asks for between phases.
- **Tab-level `<Suspense>`** wraps the three activity tabs (`AssessmentTab`, `RecordingTab`, `QATab`), each lazy-loaded via React's `lazy()` (the client-component equivalent of `next/dynamic`) so a tab's code — and its heavier dependencies, like the MediaRecorder hook — is only fetched once the user actually activates that tab, not upfront as part of `/activity`'s initial bundle. `TabSkeleton` is the shared fallback shown during that fetch.
- **Chat "typing" state** (`isTyping`, `streamingMessage`) drives a visible typing indicator while the mock/live expert is "composing," so the delayed responses required by the WebSocket illusion never read as a frozen UI — and buttons like "Completed – Next" and message-send are disabled mid-response to prevent double-submits during the simulated latency.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (`persist` middleware → `localStorage`) |
| Validation | Zod (job-config schema validation on store rehydration) |
| AI | Vercel AI SDK + Groq (`llama-3.3-70b-versatile`), with scripted-mock fallback |
| Icons | lucide-react |

No separate backend was built for this take-home: the only server-side responsibility (proxying/streaming a chat completion) fits a single Route Handler, and introducing a second codebase/deployment for one endpoint would add operational overhead the assignment's scope doesn't call for. The README above deliberately flags the one piece of state (recorded video Blobs) that *would* move to a dedicated service in a production system, per the assignment's own reasoning about not tying up the Next.js server with heavy media processing.