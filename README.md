# CodeReview Lab

CodeReview Lab is a lightweight software engineering evaluation dashboard designed to simulate AI trainer workflows. It demonstrates realistic bug identification, test validation, code review feedback, rubric-based scoring, and corrected reference implementations.

## Tech stack

- React
- TypeScript
- Vite
- SCSS
- Mock data only for the MVP

## Features

- Dashboard metrics for total tasks, average quality score, bugs identified, tests passed, and review readiness
- Three realistic software engineering evaluation scenarios
- Task detail pages with expected behavior, edge cases, starter code, and corrected implementations
- Evaluation reports with failed cases, reviewer comments, and rubric scores
- Employer-facing interface designed to demonstrate debugging, testing, code review, and AI evaluation judgment

## Local setup

```bash
npm create vite@latest code-review-lab -- --template react-ts
cd code-review-lab
npm install
npm install -D sass
npm run dev
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## What this demonstrates

This project is built for roles involving software engineering task design, AI trainer workflows, and SWE evaluation. It demonstrates the ability to:

- Design realistic bug-fixing, testing, and refactoring tasks
- Identify edge cases and failure modes
- Write clear natural-language task specifications
- Compare buggy and corrected implementations
- Build structured rubric-based evaluation artifacts
- Communicate actionable code review feedback

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy and share the generated Vercel URL.
# code-review-lab
# code-lab
