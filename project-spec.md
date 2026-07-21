# Remote Support Portal

## Overview

A proof-of-concept application for field technicians.

The technician performs an entire repair workflow consisting of:

1. Job Configuration
2. Preparation
3. Remote Support Workspace
4. Performance Analysis

The focus is architecture rather than UI.

---

# Primary Goals

- Demonstrate Next.js App Router expertise
- Proper Server/Client Component separation
- Feature-driven architecture
- Modular codebase
- Browser API integration
- State persistence
- Route protection
- Production-ready code

---

# Tech Stack

Next.js 15

TypeScript

Tailwind

shadcn/ui

Zustand

React Hook Form

Zod

Framer Motion

---

# Functional Requirements

## Phase 1

Job Configuration

User selects

- Equipment
- Severity

Persist selection.

Navigate to Prep.

---

## Phase 2

Preparation

Show

- Job summary
- Safety instructions
- 30 second countdown
- Camera permission request

Skip button

Auto navigation

Handle permission denial gracefully.

---

## Phase 3

Workspace

Global timer

10 minutes

Three sequential tabs

Assessment

↓

Recording

↓

QA

Each tab locks after completion.

---

### Assessment

Mock Remote Expert

Delayed responses

Typing indicator

State persistence

---

### Recording

MediaRecorder API

Preview recording

Save recording

Allow retry

---

### QA

Second mock conversation

Finish workflow

Navigate to Analysis

---

## Analysis

Placeholder page.

Show completion.

---

# Route Guards

Cannot open

/prep

without mission

Cannot open

/activity

without prep

Cannot open

tab2

without tab1

Cannot open

tab3

without tab2

---

# State

Mission

Prep

Permissions

Chat

Recording

Timers

Tabs

Progress

Persist using Local Storage.

---

# Browser APIs

MediaRecorder

getUserMedia

SpeechSynthesis

localStorage

---

# Loading States

Route loading

Chat loading

Recording processing

Navigation loading

Dynamic imports

Skeletons

---

# Error States

Permission denied

Recording failure

Storage unavailable

Timer expired

Broken session

---

# Performance

Server Components first

Dynamic imports

Minimal hydration

Memoization

Lazy loading

---

# Future Enhancements

Real WebSocket

Real AI

Cloud Storage

Authentication

Database

Backend service

Analytics