---
description: Plan a single new feature for the current project — discuss it, check feasibility against the docs and live codebase, then add structured tasks to the existing Notion task database.
argument-hint: [the feature idea]
---

You are planning **one new feature** for an already-planned product. Work the phases in order. This command creates tasks only — it does **not** write product documentation (the implementer owns the docs).

**Engineering depth is delegated** to the `feature-dev` plugin's subagents (`code-explorer` for feasibility, `code-architect` for the blueprint). If they aren't available, tell the user to install `feature-dev` (`/plugin install feature-dev@claude-plugins-official`) and fall back to reasoning it yourself.

## Prerequisites

Read `.claude/product.json` (project root). It must already exist with `notion.taskDatabaseId`, `notion.documentationPageId`, and `notion.architecturePageId` populated. If it's missing or unpopulated, stop and tell the user to run `/plan-product` first — this command builds on an existing product.

## Phase 1 — Discuss the feature

- Treat `$ARGUMENTS` as the feature idea to start from; if empty, ask the user what feature they want.
- Discuss and refine scope: clarify behavior, edge cases, what's explicitly out of scope, and how it relates to existing features. Ask concrete clarifying questions; wait for answers.
- Converge on an agreed, well-defined feature and confirm it back to the user before continuing.

## Phase 2 — Feasibility check (docs + live codebase)

Determine whether the current product can support this feature, and where it would fit.

1. Read the existing **Documentation** and **Architecture** pages from Notion using their stored IDs (`notion-fetch` on `notion.documentationPageId` and `notion.architecturePageId`).
2. Launch 1–3 `code-explorer` agents on the **live codebase** to trace the areas this feature touches — relevant patterns, extension points, and anything that would conflict. Read the key files they flag.
3. Produce a feasibility verdict: **Feasible** / **Feasible with changes** / **Blocked**, with concrete reasoning (what supports it, what's missing, what must change first). Surface any prerequisite work as its own tasks.
4. If it's *Blocked* or needs significant rework, **discuss with the user and get a decision before creating any tasks.**

## Phase 3 — Design the feature blueprint

Launch 1–3 `code-architect` agents to design how to build this feature **consistently with the existing architecture** — components, data flow, the specific files to create/modify, and a build sequence. If there are meaningfully different approaches, present the trade-offs and let the user choose.

## Phase 4 — Emit structured tasks into the existing database

Add tasks to the existing task database (`notion.taskDatabaseId`) with `notion-create-pages` — same schema the product uses. Do **not** create a new database, and do **not** modify the Documentation page.

- **Name** — short, action-oriented title. Prefix or clearly reference the feature so these tasks are distinguishable from other features' tasks in the shared DB.
- **Status** — `New`.
- **Order** — continue the global build sequence: read the current tasks, find the highest `Order`, and number these tasks starting after it (respecting this feature's internal sequence). Note parallelizable tasks with adjacent numbers.
- **Page body** (detail goes here, not in properties):
  - `## Context / Spec` — everything another AI needs to implement this **cold**: what to build and why, the relevant slice of the blueprint, the specific files/modules, constraints, and interfaces it must conform to. Name the feature. **Assume the implementer has not seen this conversation.**
  - `## Acceptance Criteria` — a checklist defining done.

When finished, post a summary: the feasibility verdict, the number of tasks created, their `Order` range, and a link to the task database.
