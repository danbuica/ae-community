---
description: Pick the next task from the Notion task database, implement it, update the docs, and move it to Ready for Review.
argument-hint: [optional: a specific task name or URL]
---

You implement **one task** end to end: select it, build it, document it, and hand it to QA. Keep scope to a single task.

**Engineering support available:** reuse the `feature-dev` `code-explorer` subagent to load accurate context before writing. Implementation itself is yours (the agents are read-only) — lean on `context7` for current, version-correct library APIs. If `feature-dev` isn't available, tell the user and gather context manually.

## Prerequisites

Read `.claude/product.json` (project root). It must have `notion.taskDatabaseId`, `notion.documentationPageId`, and `notion.architecturePageId`. If missing, stop and tell the user to run `/plan-product` first.

## Phase 1 — Select the task

1. If `$ARGUMENTS` names a specific task (title or URL), use that one.
2. Otherwise query the task database (`notion.taskDatabaseId`) and pick the next eligible task:
   - **Eligible statuses:** `Changes Requested` and `New`.
   - **Priority:** `Changes Requested` before `New` (clear rework before starting new work); within each, lowest `Order` first.
3. Announce which task you picked and why. Then set its **Status → `In Progress`** before doing any work, so nothing else grabs it.

## Phase 2 — Load context

- Read the task page in full: `## Context / Spec` and `## Acceptance Criteria`.
- If the task was `Changes Requested`, also read its **review feedback** (check the page body and the task's Notion comments via `notion-get-comments`) and treat addressing that feedback as the priority.
- Read the **Architecture** page (`notion.architecturePageId`) for the design and constraints; skim the **Documentation** page for current product behavior.
- Launch 1–3 `code-explorer` agents to understand the exact code areas this task touches, then read the key files they flag. Do not start writing until you understand the existing patterns.

## Phase 3 — Implement

- Implement strictly to the spec and acceptance criteria, following the architecture and the codebase's existing conventions.
- Use `context7` to confirm current, version-correct APIs for any libraries involved. Work in small, verifiable increments.
- Verify your work against the acceptance criteria — run the build/tests/linters if the project has them, and fix what you break. Do not hand off work you haven't checked.

## Phase 4 — Update the documentation

Update the Notion **Documentation** page (`notion.documentationPageId`) to reflect what now actually exists — the feature/behavior this task delivered. **Merge** into the existing content; never clobber other features' docs. Keep it factual ("what the product does"), not implementation minutiae (that's the architecture's job).

## Phase 5 — Hand off to QA

- Set the task **Status → `Ready for Review`**.
- Add a brief comment on the task (`notion-create-comment`) summarizing what changed, the files touched, and which acceptance criteria you verified and how — this is the input the `/code-review` step reads.

When finished, post a summary: the task name, files changed, what you documented, and confirmation it's now `Ready for Review`.

Then ask the user what to do next — implement the **next `New` task** (knock out several before reviewing), run **`/review-task`**, run **`/qa-task`**, or stop. Invoke the chosen command via the `Skill` tool (for "next task", run `/implement-task` again). Otherwise stop.
