# Dev Workflow Agents

A spec-driven development pipeline that takes a product from **idea → planned tasks → implemented → reviewed → QA'd → done** — all coordinated through a **Notion task database**. These five agents are designed to work together: each one reads and advances the same shared state, so you run them as a loop rather than in isolation.

Each agent is a **Claude Code slash command** — a markdown file in `.claude/commands/` that Claude Code exposes as `/command-name` when you open this folder.

## The loop

```
/plan-product          → discuss + architect a new product, create the Notion task DB
   │
   ├─ /plan-feature     → add one more feature to an already-planned product
   │
   └─ /implement-task   → build one task end-to-end + update docs   →  Ready for Review
          │
          /review-task  → code + security review gate               →  Ready for QA  / Changes Requested
              │
              /qa-task   → write + run isolated tests                →  Done          / Changes Requested
```

Every task flows through a Notion **Status** pipeline:
`New → In Progress → Ready for Review → Ready for QA → Done` (with `Changes Requested` kicking work back).

## Agents

### 0. `/plan-product [product name or focus]` (run this first)
Runs a full planning session: discusses the feature list and constraints, designs the architecture via the **feature-dev** subagents (`code-explorer` + `code-architect`, multiple framings compared), then sets up the Notion hierarchy (Product → Documentation → Architecture, plus a Tasks page + **task database**) and emits implementation-ready tasks. Writes all the Notion IDs into `.claude/product.json` so the other agents can find everything. **Nothing else runs until this exists.**

### 1. `/plan-feature [the feature idea]`
Plans **one new feature** for an already-planned product. Discusses and refines scope, checks feasibility against the docs + live codebase (via `code-explorer`), designs the slice (via `code-architect`), and appends new tasks to the existing task database. Creates tasks only — it does not write product docs (the implementer owns those).

### 2. `/implement-task [optional task name/URL]`
Picks the next eligible task (`Changes Requested` before `New`, lowest `Order` first), builds it end-to-end, updates the documentation, and moves it to **Ready for Review**. Uses `code-explorer` for read-only context and `context7` for version-correct library APIs; the implementation itself is the agent's own work.

### 3. `/review-task [optional task name/URL]`
The **review gate**. Runs code review + security review (Claude's built-in skills) over the current changes for every task that's `Ready for Review`, then moves each to **Ready for QA** or **Changes Requested**. Does not fix code — it renders a verdict.

### 4. `/qa-task [optional task name/URL]`
QA's everything that's `Ready for QA`: writes tests covering each task's cases and runs them in **full isolation** — mocked data layer, mocked external/costly APIs, and a fail-closed network guard so any unmocked call turns the test red. Moves each task to **Done** or **Changes Requested**.

> ⚠️ **Safety:** `/qa-task` assumes some projects connect locally to **production** databases and **costly external APIs** (video/image/AI generation, payments, etc.). It never runs tests against prod and never makes live calls — if it can't guarantee isolation, it stops and asks.

## Setup

### Prerequisites
- [Claude Code](https://claude.com/claude-code) installed (`npm install -g @anthropic-ai/claude-code`)
- The **Notion MCP** connected in Claude Code — all five agents read/write the Notion task database
- The **feature-dev** plugin installed — for the planning/architecture subagents:
  ```
  /plugin install feature-dev@claude-plugins-official
  ```
- The **context7** MCP (recommended) — gives `/implement-task` current, version-correct library docs

### 1. Get this folder onto your machine
Either clone the full `ae-community` repo or download just `dev-workflow-agents/` (see the root README for options). Open a terminal inside the folder of the project you want to plan/build (not necessarily this one — see below).

### 2. Make the commands available
These are **slash commands**, so Claude Code picks them up from `.claude/commands/`. Two ways to use them:

- **Per project (recommended):** copy `dev-workflow-agents/.claude/commands/*.md` into your target project's `.claude/commands/` folder, then run `claude` there.
- **Globally:** copy them into `~/.claude/commands/` to have them available in every project.

### 3. Run `/plan-product` in your target project
```bash
cd /path/to/your/project
claude
```
Then, inside Claude Code:
```
/plan-product "My SaaS idea"
```
This creates `.claude/product.json` (the per-project state file) and the Notion hierarchy. Every other command reads `.claude/product.json` and **stops and tells you to run `/plan-product` first** if it's missing.

## Running the agents

A typical project lifecycle:
```
/plan-product "<product>"           # once — sets up Notion + tasks
/implement-task                      # build the next task → Ready for Review
/review-task                         # review all Ready-for-Review tasks
/qa-task                             # test all Ready-for-QA tasks → Done
/plan-feature "<new feature idea>"   # any time you want to add scope
```

Run `/implement-task`, `/review-task`, and `/qa-task` repeatedly to drain the backlog; each picks up whatever is eligible.

## State file

Each project gets a `.claude/product.json` at its root (created by `/plan-product`), holding the Notion IDs and testing policy that the agents share:

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

It's per-project and generated at runtime — there's nothing secret to copy in, and it shouldn't be committed to this repo.

## Data layout

```
dev-workflow-agents/
└── .claude/commands/        # the five slash commands
    ├── plan-product.md
    ├── plan-feature.md
    ├── implement-task.md
    ├── review-task.md
    └── qa-task.md
```

Everything else (`.claude/product.json`, the Notion pages, your code) lives in **your target project**, not here.

## Adding a new agent

Drop a new markdown file into `.claude/commands/` (this becomes the slash command). If it advances the task pipeline, have it read `.claude/product.json` for the Notion IDs and respect the Status flow above. Then add an entry to the list here.
