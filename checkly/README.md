# Checkly Monitoring-as-code: Astronomy Shop

Checkly checks for the OpenTelemetry Demo ("Astronomy Shop") — the target
app for the Checkly Senior Solutions Architect take-home challenge. See
`../PLAN.md` (local, not committed) for the full scope/rationale.

## Project structure

```
.
├── README.md
├── __checks__        # API checks (*.check.ts) and browser checks (*.spec.ts)
├── checkly.config.ts
├── package.json
└── package-lock.json
```

- `npx checkly test` — dry-runs all checks in this project. Results are
  recorded as a test session viewable in the Checkly UI (`--no-record` to
  skip recording).
- `npx checkly deploy` — deploys checks to Checkly, on the schedule/locations
  configured in `checkly.config.ts`.
- `npx checkly login` — authenticate the CLI against your Checkly account
  (browser-based; run this yourself, not via an API key pasted into a file).

## CLI commands

| Command               | Action                                  |
|:-----------------------|:-----------------------------------------|
| `npx checkly test`     | Dry run all the checks in this project  |
| `npx checkly deploy`   | Deploy checks to the Checkly cloud      |
| `npx checkly login`    | Log in to your Checkly account          |
| `npx checkly whoami`   | Confirm which account the CLI is authenticated against |
| `npx checkly --help`   | Show help for each command              |

[Full CLI reference](https://www.checklyhq.com/docs/cli/command-line-reference/).

Run `npm install` first to install dependencies (`@playwright/test`,
`checkly`).
