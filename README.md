# CodeReview Lab

CodeReview Lab is an interactive software engineering evaluation simulator. It presents a small library of realistic TypeScript review tasks, lets a user edit the starter implementation in the browser, runs task-specific tests against the submitted code, tracks dashboard progress, and reveals a corrected reference implementation after submission.

The app is built to demonstrate the kind of judgment used in code review, AI trainer workflows, debugging evaluations, edge-case analysis, and test-driven repair tasks.

## What The App Does

- Shows a dashboard of curated SWE evaluation scenarios and live completion metrics.
- Opens each task into a detail view with expected behavior, edge cases, and buggy starter code.
- Provides an in-browser TypeScript editor powered by CodeMirror.
- Transpiles submitted TypeScript in the browser and runs focused test cases against exported functions.
- Displays passed and failed test results with expected/actual values where available.
- Saves each task submission in app state while the session is active.
- Reveals the corrected reference implementation after a task is submitted.
- Includes a reset action that clears task stats and saved submissions.

## Included Task Scenarios

The current task library includes five scenarios:

- Repair Cart Discount Rounding
- Design Tests For Profile Merge
- Refactor Invoice Normalization
- Repair Shipping Threshold Tax
- Repair Subscription Proration Rounding

These cover bug fixes, test-writing judgment, and refactoring around practical product logic such as checkout totals, profile updates, invoice imports, shipping thresholds, and subscription billing.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router
- CodeMirror
- SCSS
- Local task data and browser-executed tests

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/        Reusable dashboard, code editor, code block, and test summary UI
  data/              Task metadata, starter implementations, and reference fixes
  pages/             Dashboard and task detail routes
  state/             Session-level task statistics context
  tests/             Task-specific browser test cases
  utils/             TypeScript transpilation and test runner utilities
```

## Notes

This project is currently a frontend-only prototype. Task definitions, starter code, reference solutions, and tests are all local to the app. There is no backend, database, authentication layer, or external evaluation service.
