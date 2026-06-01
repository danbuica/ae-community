---
description: QA the tasks that are Ready for QA — write tests covering all cases and run them in full isolation (mocked DB + external APIs), then move each to Done or Changes Requested.
argument-hint: [optional: a specific task name or URL]
---

You QA the tasks that are Ready for QA: write tests that cover their cases, run them **safely**, and move each task. Correctness/security review already happened in `/review-task` — your job is test coverage and behavior.

**Git:** work happens on `main` and the user manages all git operations. Do not create branches, commit, or reset. Several tasks may be ready at once — handle them together.

## ⚠️ Safety rules — non-negotiable, read first

Some of this user's projects connect locally to **production** databases and to **costly external APIs** (e.g. video generation). Tests must never touch either.

1. **Never run tests against a production database.** Mock the data layer.
2. **Never make live calls to external/costly services.** Mock every third-party client (video/image/AI generation, payments, email/SMS, etc.).
3. **Block the network — fail closed.** Configure the run so any *unmocked* outbound call **fails the test** rather than executing (e.g. `pytest-socket`, `nock.disableNetConnect()`, MSW `onUnhandledRequest:'error'`, `respx`). A forgotten mock must produce a red test, never a real call.
4. **If you cannot guarantee this isolation** (e.g. code hard-wires a prod connection that can't be mocked in tests), **STOP and ask the user.** Never "try it and see."

## Prerequisites

Read `.claude/product.json`. It must have `notion.taskDatabaseId`. Read its `testing` block if present:
`{ mockData, mockExternalApis, networkGuard, doNotCall[] }`. If absent, apply the safest defaults: mock data, mock external APIs, network guard on, and treat **all** external services as do-not-call. If anything about isolation is unclear, stop and ask.

## Phase 1 — Select the tasks

1. If `$ARGUMENTS` names a task, QA just that one.
2. Otherwise select **all** tasks with **Status = `Ready for QA`**, ordered by `Order`.
3. If none are `Ready for QA`, say so and stop. Otherwise list the tasks.

## Phase 2 — Understand what to test

For each task, read its `## Context / Spec` and `## Acceptance Criteria`, plus the implementer's and reviewer's comments (`notion-get-comments`). Identify the cases to cover per task: happy path, edge cases, and error/failure paths.

## Phase 3 — Set up isolation (before writing or running anything)

- Determine what the project's tests would connect to. Confirm the data layer and every external service in `doNotCall` will be **mocked**, and enable the **network guard** for the run.
- Use the project's existing test framework and conventions. Use `qodo-skills` to generate thorough cases and assess coverage. Use Playwright only for API/component tests **against the mocked backend** (never live E2E here).

## Phase 4 — Write and run the tests

- Write tests covering all identified cases (across all the selected tasks), with the DB and external services mocked.
- Run them with the network guard active. If a test triggers a blocked outbound call, fix it by adding the missing mock — do **not** loosen the guard to make it pass.
- Iterate until tests are meaningful and green, or until you've found genuine defects.

## Phase 5 — Verdict and Notion update (per task)

For **each** task:

- **Pass** — its tests cover its cases and pass, acceptance criteria demonstrably met:
  - Set **Status → `Done`**.
  - Comment (`notion-create-comment`) listing the test files added and the cases covered.
- **Fail** — tests reveal defects, or coverage can't be achieved because the behavior is wrong/missing:
  - Set **Status → `Changes Requested`**.
  - Comment with the failing cases and what's wrong — concrete and actionable, so `/implement-task` can fix it on rework.

When finished, post a summary table: each task, its verdict, tests added, cases covered, and its new status.
