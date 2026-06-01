---
description: Start a product planning session — discuss features, design the architecture (via the feature-dev agents), then create a Notion task database with implementation-ready tasks.
argument-hint: [product name or feature focus]
---

You are running a **product planning session**. Work through the phases below strictly in order. Do not create tasks before the architecture has been agreed by the user.

**Engineering depth is delegated.** The heavy technical work in Phase 2 uses the **feature-dev** plugin's specialist subagents (`code-explorer`, `code-architect`) rather than being reasoned out inline. If those subagents are not available, tell the user `feature-dev` isn't installed (`/plugin install feature-dev@claude-plugins-official`) and fall back to designing the architecture yourself.

## Project state file

Per-project binding lives in `.claude/product.json`, relative to the current project root. It is the shared config for this and future planning commands — add to it, never clobber keys you don't own. Schema:

```json
{
  "product": { "name": "", "description": "" },
  "notion": {
    "productPageId": "",
    "documentationPageId": "",
    "architecturePageId": "",
    "tasksPageId": "",
    "taskDatabaseId": ""
  },
  "testing": {
    "mockData": true,
    "mockExternalApis": true,
    "networkGuard": true,
    "doNotCall": []
  }
}
```

**At startup:** read `.claude/product.json` if it exists. Treat stored `notion.*` IDs as the source of truth — never recreate a Notion object whose ID is already stored and still resolves. Verify questionable IDs with `notion-fetch` before reusing.

## Phase 1 — Discuss the functionality

- If `$ARGUMENTS` is given, treat it as the product / feature focus to start from.
- Ask the user to list the functionalities they want.
- Interrogate scope: clarify ambiguous items, surface edge cases, call out what's out of scope, and propose anything obviously missing. Ask concrete clarifying questions rather than assuming; wait for answers. Push back where it helps.
- Also capture the **non-functional constraints** (performance, security, scale, compliance, platform/runtime) — these are architectural inputs and will be recorded on the Architecture page.
- Converge on an **agreed feature list (each with a short description) + the constraints**. Summarize it back and get **explicit confirmation** before moving on. This is the input to the architecture — it is *not* written as product documentation (the implementer owns the docs).

## Phase 2 — Design the architecture (via feature-dev agents)

Use the feature-dev subagents to produce a concrete blueprint — this is the raw material for tasks, so it must name real components, data flows, and a build sequence.

1. **Explore (existing codebases only).** If the project already contains source code, launch 2–3 `code-explorer` agents in parallel, each targeting a different aspect (similar features, overall architecture, relevant patterns/extension points). Read the key files they flag. Skip this step for greenfield products.
2. **Resolve open questions.** Before designing, surface any remaining ambiguities (edge cases, error handling, integration points, scope boundaries) and get the user's answers.
3. **Design.** Launch 2–3 `code-architect` agents in parallel with different framings — minimal-change, clean-architecture, and pragmatic-balance. Each returns a blueprint: components/modules, data model, data flows, **specific files to create or modify**, and a **build sequence**.
4. **Choose.** Compare the approaches, give your recommendation with reasoning, and **ask the user which to adopt.**
5. The chosen blueprint is the architecture. It feeds the Notion Architecture page (Phase 3) and the tasks (Phase 4).

## Phase 3 — Connect Notion (find or create)

Establish this hierarchy, **asking before creating anything**:

```
Product page
├── Documentation   (the wiki — what the product is and does; the source /groom-feature reads)
│     └── Architecture   (the chosen Phase 2 blueprint)
└── Tasks page
      └── Task database
```

1. **Product page** — if `notion.productPageId` is empty:
   - Ask: "Do you already have a Notion page for this product?"
   - If yes → ask for the URL/ID (or use `notion-search` to locate it), store it.
   - If no → ask which existing Notion page it should live under (the parent), then create it with `notion-create-pages` and store the ID.
2. **Documentation page** — find-or-create as a child of the product page. This is the product "wiki" and the **implementer owns its content** — do NOT write feature documentation here. If creating it fresh, add only a one-line note like *"Product documentation — populated as features are implemented."* Never overwrite an existing Documentation body.
3. **Architecture page** — find-or-create as a child of the **Documentation** page. Write the chosen Phase 2 blueprint into it, plus a `## Constraints` section listing the non-functional constraints from Phase 1. If it already has content, confirm before overwriting.
4. **Tasks page** — find-or-create as a child of the product page.
5. **Task database** — if `notion.taskDatabaseId` is empty, create a database under the Tasks page with `notion-create-database`:
   - **Name** — title
   - **Status** — status type, grouped as Notion's To-do / In Progress / Complete:
     - To-do group: `New`
     - In Progress group: `In Progress`, `Ready for Review`, `Ready for QA`, `Changes Requested`
     - Complete group: `Done`
   - **Order** — number: the position in the build sequence (1 = build first). The DB's default view should sort by Order ascending.
6. Write every new ID back into `.claude/product.json`.

(Notion's literal "wiki" page-type can't be set reliably via the API; the Documentation page serves that role. Mention this to the user only if it comes up.)

## Phase 4 — Emit implementation-ready tasks

Decompose the chosen blueprint into discrete tasks — the architect's "files to create/modify" and "build sequence" are your starting point. Create each as a page in the task database with `notion-create-pages`:

- **Name** — short, action-oriented title.
- **Status** — `New`.
- **Order** — the task's position in the architect's build sequence (1 = build first). Number tasks consecutively; if two tasks can be done in parallel, give them adjacent numbers and say so in their Context. An implementer should be able to sort by Order ascending and work straight down the list.
- **Page body** (put detail here, not in properties — rich-text properties are length-limited):
  - `## Context / Spec` — everything another AI needs to implement this **cold**: what to build and why, the relevant slice of the blueprint, the specific files/modules involved, constraints, and any interfaces it must conform to. **Assume the implementer has not seen this planning conversation.**
  - `## Acceptance Criteria` — a checklist defining done.
- Size tasks so they can be picked up independently where possible; note blocking dependencies inline in the Context section, consistent with the Order.

When finished, post a summary: links to the Notion product page, the Documentation page, and the Architecture page, plus the number of tasks created.
