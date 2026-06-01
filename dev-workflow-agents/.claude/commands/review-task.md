---
description: Review the tasks that are Ready for Review — run code review + security review over the current changes, then move each to Ready for QA or Changes Requested.
argument-hint: [optional: a specific task name or URL]
---

You are the **review gate**. You don't fix code here — you review the current changes, render a verdict per task, and move each task accordingly. The actual reviewing is delegated to Claude's built-in skills.

**Git:** work happens on `main` and the user manages all git operations. Do **not** create branches, commit, or reset. Several tasks may have been implemented before this runs — that's expected; review them together.

## Prerequisites

Read `.claude/product.json` (project root). It must have `notion.taskDatabaseId`. If missing, stop and tell the user to run `/plan-product` first.

## Phase 1 — Select the tasks

1. If `$ARGUMENTS` names a specific task, review just that one.
2. Otherwise query the task database (`notion.taskDatabaseId`) for **all** tasks with **Status = `Ready for Review`**, ordered by `Order` (lowest first), and review them all in this run.
3. If none are `Ready for Review`, say so and stop.
4. List the tasks you're about to review.

## Phase 2 — Establish scope

- For each task, read its page (`## Context / Spec`, `## Acceptance Criteria`) and the implementer's handoff comment (`notion-get-comments`) for what changed and which files were touched.
- The code under review is the **current changes on `main`** — the working-tree diff. If the user has already committed the work, ask them which commit range to review. The changes may span several tasks; use the per-task handoff comments + specs to attribute them.
- If there are no changes to review at all, flag it and stop — the tasks may not have been implemented.

## Phase 3 — Run the reviews

Run both built-in skills via the `Skill` tool over the current changes, and collect their findings:

1. **`code-review`** — correctness bugs, logic errors, quality. Use `high` effort for a substantial diff.
2. **`security-review`** — vulnerabilities in the changes.

Then, for **each** task, independently check the implementation against its **Acceptance Criteria** — unmet criteria are blocking for that task even if the code is otherwise clean.

## Phase 4 — Verdict and Notion update (per task)

Decide pass/fail **for each task**, attributing each finding to the task(s) whose scope it touches:

- **Pass** — no blocking correctness/security issue in its scope and all its acceptance criteria met:
  - Set **Status → `Ready for QA`** (review only clears correctness/security; QA writes and runs the tests before anything reaches `Done`).
  - Post a short approval comment (`notion-create-comment`).
- **Changes needed** — any blocking issue in its scope or an unmet criterion:
  - Set **Status → `Changes Requested`**.
  - Post a comment with that task's findings, grouped as **Correctness**, **Security**, **Unmet acceptance criteria** — concrete and actionable. This is exactly what `/implement-task` reads on rework.

Use confidence filtering — report issues that genuinely matter, not nitpicks.

When finished, post a summary table: each task reviewed, its verdict, blocking findings by category, and its new status.

If **any** task passed (now `Ready for QA`), ask the user whether to run **`/qa-task`** next; if they agree, invoke the `qa-task` skill via the `Skill` tool. If none passed, just stop.
