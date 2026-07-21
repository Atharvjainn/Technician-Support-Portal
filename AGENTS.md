# AGENTS.md

## Project

Remote Support Portal
Next.js 15 App Router
TypeScript
Tailwind CSS
shadcn/ui
Zustand
React Hook Form
Zod

---

# Goal

This repository must represent production-quality frontend architecture.

Priorities (highest → lowest)

1. Architecture
2. Scalability
3. Separation of concerns
4. Performance
5. Developer experience
6. UI

Never generate large monolithic files.

---

# General Rules

- Feature Driven Architecture
- Strict TypeScript
- Functional components only
- Prefer Server Components
- Client Components only when required
- No prop drilling
- Reusable components
- Never duplicate logic
- Every feature owns its UI + hooks + services + types
- All business logic outside components
- No inline fetches
- No inline validation
- No inline timers
- No inline websocket simulation
- No magic strings

---

# Tech Stack

Next.js App Router

TypeScript

Tailwind

Zustand

Zod

React Hook Form

Framer Motion

---

# Folder Structure

    app/

        (mission)/

            page.tsx

            prep/

            activity/

            analysis/

        api/

        layout.tsx

        loading.tsx

        error.tsx

    features/

        mission/

            components/

            hooks/

            services/

            actions/

            types/

            constants/

            schemas/

            utils/

            store/

        prep/

            ...

        activity/

            tabs/

                assessment/

                recording/

                qa/

            hooks/

            services/

            store/

            components/

        analysis/


    ui/
        
        navbar/

        timer/

        cards/

        dialogs/

        loaders/

        permissions/

        chat/

        video/

        stepper/

    lib/

        storage/

        mock/

        permissions/

        recorder/

        websocket/

        speech/

        utils/

        constants/

    providers/

    hooks/

    store/

    types/

    styles/

---

# State Management

Global

Mission Progress

Job Configuration

Timers

Permission State

Active Tab

Chat

Recording

Use Zustand.

Never use Context for application state.

---

# Forms

Always

React Hook Form

+

Zod

---

# Server Components

Use whenever possible.

Examples

Navigation

Static Layout

Safety Instructions

Job Configuration Page

Analysis Page

---

# Client Components

Only when browser APIs are required.

Examples

Countdown Timer

MediaRecorder

Speech Synthesis

Permissions

WebSocket Mock

Chat

Recording

---

# Performance

Use dynamic imports

Lazy load

Assessment Tab

Recording Tab

QA Tab

Avoid unnecessary hydration

Memoize expensive components

---

# Error Handling

Never crash UI.

Every async action returns Result pattern.

Gracefully handle

Camera denied

Microphone denied

Storage failure

Navigation guard

Expired timer

---

# Styling

Use shadcn/ui

Tailwind

Consistent spacing

Rounded cards

Dark timer

Green theme

Responsive

---

# Code Style

Small files

Single responsibility

No file above ~250 lines

Extract custom hooks

Extract services

Extract utilities

Extract constants

---

# Naming

useSomething()

SomethingService

SomethingStore

SomethingCard

SomethingTimer

SomethingGuard

SomethingProvider

---

# Comments

Only explain WHY.

Never explain WHAT.

---

# Testing mindset

Design code to be testable.

Avoid tightly coupled logic.

---

# Before writing code

Always

Plan

Explain

Then Implement

Never skip planning.