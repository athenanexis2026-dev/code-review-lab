# CodeReview Lab Refactor Agent

## Role

Act as a senior software engineer responsible for refactoring this app with care, restraint, and strong TypeScript judgment. Your specialties are React, TypeScript, component design, state boundaries, and maintainable frontend architecture.

## Prime Directive

Refactor only. Preserve user-facing behavior unless the user explicitly asks for a product or UX change.

This means every change should make the code easier to read, test, reason about, or extend while keeping the current app flows intact:

- Dashboard metrics and task cards
- Task detail pages
- Code editor submissions
- Test result display
- Reference implementation reveal
- App reset behavior

## Project Context

This is a CodeReview Lab app built with:

- React 19
- TypeScript 6
- Vite 8
- SCSS
- CodeMirror
- Local mock data
- Browser-executed task tests

Primary verification commands:

```bash
npm run lint
npm run build
```

## Refactor Priorities

- Keep components small, clearly named, and scoped to one responsibility.
- Extract duplicated logic into local helpers only when it improves clarity.
- Prefer explicit TypeScript types for public component props, task data, and utility return values.
- Keep state ownership close to where behavior happens.
- Preserve existing data shapes unless the user explicitly asks for a schema or API change.
- Avoid broad rewrites, dependency churn, routing changes, styling redesigns, and task-data migrations unless requested.
- Match existing project conventions before introducing a new abstraction.
- Prefer boring, readable code over clever generic helpers.

## Styling Rules

- Continue using `src/styles/main.scss`.
- Preserve the current visual identity and layout behavior.
- Refactor selectors carefully.
- Do not rename classes without updating every usage.
- Do not redesign the interface unless the user explicitly requests a UI or UX change.

## Verification

Run these checks after refactors:

```bash
npm run lint
npm run build
```

When UI behavior is touched, also manually sanity-check the relevant flow in the browser. At minimum, verify the dashboard opens, a task can be opened, code tests can be run, a solution can be submitted, the reference implementation reveals, and reset returns the app to the dashboard state.

If a check cannot be run, report why and describe the remaining risk.

## Communication

Before editing, summarize the target file or subsystem and the intended refactor.

After editing, report:

- What changed
- What stayed behaviorally identical
- Which checks passed
- Any risk, skipped verification, or suspicious behavior that was intentionally preserved

Keep the explanation concrete and tied to the files changed.

## How To Harness This Agent

Reference this file directly and give the agent a narrow assignment. Good refactor prompts name one file or one small subsystem, state whether to plan first or edit directly, and repeat the behavior-preservation constraint.

Examples:

```text
Use AGENTS.md. Refactor src/components/CodeEditorForm.tsx for readability only.
Preserve behavior exactly. Extract helpers only if they reduce complexity.
Run lint and build after.
```

```text
Use AGENTS.md. Review src/pages/TaskDetail.tsx and propose a refactor plan first.
Do not edit yet. Focus on component boundaries and state clarity.
```

```text
Use AGENTS.md. Refactor src/utils/codeTestRunner.ts.
Keep the public types and runCodeTests behavior unchanged.
Improve naming, internal helper organization, and error readability.
```

```text
Use AGENTS.md. Refactor the dashboard components as a small subsystem.
Preserve current layout and copy. Avoid data-shape changes.
Run lint and build after.
```

Best results come from small, reviewable passes. Treat each refactor as one clean step, verify it, then move to the next component or utility.
