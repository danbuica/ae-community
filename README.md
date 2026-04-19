# AE Community — Agents

This is a repo created for the [Automate & Earn with AI](https://www.skool.com/automate-earn-with-ai-4633) community by Dan Buica.

## How this repo is organised

The top level of the repo is split into **groups** — one folder per community or use-case. Inside each group are individual **agents**, each in their own folder.

```
ae-community/
├── <group-name>/
│   ├── <agent-name>/        # a self-contained agent
│   ├── <another-agent>/
│   └── README.md            # describes the agents in this group
└── <another-group>/
```

Every agent folder is self-contained: its own code, dependencies, and setup instructions. There is no top-level install step.

## Getting an agent

You don't have to clone the whole repo — you can grab just the agent you want.

### Option 1 — Download a single agent folder
Use a tool like [DownGit](https://downgit.github.io/) or `git archive` to download just the subfolder you need. Paste the GitHub URL of the agent's folder (e.g. `https://github.com/<owner>/ae-community/tree/main/<group>/<agent>`) and it gives you a zip of just that folder.

### Option 2 — Download the whole repo as a zip
On the GitHub page, click **Code → Download ZIP**. Unzip it, then navigate into the group + agent folder you want.

### Option 3 — Clone the repo
```bash
git clone https://github.com/<owner>/ae-community.git
cd ae-community/<group>/<agent>
```

Whichever option you pick, once you're inside the agent's folder, follow that agent's own `README.md` (and `CLAUDE.md` / `AGENTS.md` if present) for install steps, env vars, and run commands.

## Contributing

Add a new agent by creating a folder under the appropriate group (or a new group folder at the root). Each agent should ship with:
- Its own `README.md` explaining what it does and how to run it
- A `CLAUDE.md` (or `AGENTS.md`) if it's meant to be worked on with Claude Code
- Pinned dependencies (`package.json`, `requirements.txt`, etc.)

When adding a new agent to an existing group, also list it in that group's README.

## License

TBD.
