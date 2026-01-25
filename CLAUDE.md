# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A custom GitHub Action for workflow telemetry collection. Periodically collects CPU load and memory usage during workflow execution, visualizes them as Mermaid charts, and outputs to GitHub Actions summary.

## Documentation

This project maintains bilingual documentation:

- **README.md** - English documentation
- **README.ja.md** - Japanese documentation

**Important**: When updating either README file, the other must be updated with the same content in the appropriate language to keep them synchronized.

## Setup

### Install Dependencies

```bash
bun install
```

### Install pre-commit (Recommended)

Automatically runs gitleaks on commit to prevent sensitive information leakage.

```bash
# macOS
brew install pre-commit

# or using pip
pip install pre-commit

# Install pre-commit hooks
pre-commit install
```

## Development Commands

```bash
# Build (type check + bundle dependencies)
bun run build

# Auto-format code with Prettier
bun run fix

# Run unit tests (Bun test runner)
bun test

# Run specific test file
bun test src/main/metrics.test.ts

# Show coverage
bun test --coverage
```

## Architecture

### GitHub Actions Custom Action Flow

```text
1. main execution: dist/main/index.js
   └─ Spawns server as detached process and exits immediately
       └─ dist/main/server.js (starts running in background)
           └─ Creates Metrics instance, collects metrics every 5 seconds
           └─ Exposes JSON API via HTTP server (localhost:7777)

2. Other workflow steps execute
   (Server continues running in background, collecting metrics every 5 seconds)

3. post execution: dist/post/index.js (after all steps complete)
   └─ Fetches metrics from server
   └─ Renders to Mermaid chart
   └─ Outputs to GitHub Actions summary
```

### Core Features

**src/main/metrics.ts - Metrics class**

- Collects system information using `systeminformation` library
- Automatically adds metrics at 5-second intervals by default (customizable via `interval` input in seconds)
- CPU: `currentLoadUser` and `currentLoadSystem` (0-100%)
- Memory: Converts `active` (in use) and `available` to MB
- Starts async collection immediately in constructor, repeats with `setTimeout`

**src/post/renderer.ts - Renderer class**

- Generates Mermaid charts using TypeScript template literals
- Stacked area chart format (stacked bar chart)
- Converts time series data to cumulative values for rendering (`toReversed()` and `reduce()` for cumulative calculation)

**src/lib.ts - Common schema and server settings**

- Strict validation of metrics data with Zod schema
- CPU: `finite().nonnegative().max(100)`
- Memory: `finite().nonnegative()`
- Server port: `7777`

### Build Process

**Entry points**:

- `src/main/index.ts` → `dist/main/index.js`
- `src/main/server.ts` → `dist/main/server.js`
- `src/post/index.ts` → `dist/post/index.js`

**Important settings**:

- Build artifacts output to dist/ directory (must be committed to repository)
- ES module format (`"type": "module"` in package.json)
- `@actions/core` is excluded from bundle (`--external=@actions/core`) as it's provided by GitHub Actions runtime

## Writing Tests

Uses Bun test runner. Mock modules with `mock.module` and call `mock.restore()` in `beforeEach` to maintain test isolation.

```typescript
import { describe, expect, it, beforeEach, mock } from "bun:test";

describe("Metrics", () => {
  beforeEach(() => mock.restore());

  it("should collect metrics", async () => {
    // test code
  });
});
```

### Mock Type Assertions

For systeminformation mocks, type assertions are required for partial objects.

```typescript
mock.module("systeminformation", () => ({
  currentLoad: mock(
    async (): Promise<Systeminformation.CurrentLoadData> =>
      Promise.resolve({
        currentLoadUser: 25.5,
        currentLoadSystem: 10.3,
      } as Systeminformation.CurrentLoadData), // type assertion required
  ),
}));
```

### fetch Mock Double Type Assertion

```typescript
globalThis.fetch = mock(
  async (): Promise<Response> =>
    ({
      ok: true,
      json: () =>
        Promise.resolve({
          /* data */
        }),
    }) as Response,
) as unknown as typeof fetch; // double type assertion required
```

## Important Implementation Patterns

### 1. Immediate Async Start

The `Metrics` class starts async processing in the constructor without `await`.

```typescript
class Metrics {
  constructor() {
    this.data = { cpuLoadPercentages: [], memoryUsageMBs: [] };

    // Start immediately without await
    this.append(Date.now()).catch((error: Error) => {
      console.error("Failed to collect initial metrics:", error);
    });
  }
}
```

### 2. Precise Timer Execution

Calculates delay until next execution with `setTimeout` and compensates for drift.

```typescript
const nextTime: number = time + this.intervalMs;
setTimeout(
  () => {
    this.append(nextTime).catch(/* ... */);
  },
  Math.max(0, nextTime - Date.now()), // compensate for drift
);
```

### 3. AbortController Timeout Control

Sets 10-second timeout for metrics fetch during post execution (`render` function in `src/post/lib.ts`).

```typescript
const controller: AbortController = new AbortController();
const timer: Timer = setTimeout(() => controller.abort(), 10 * 1000);

try {
  const res = await fetch(`http://localhost:${serverPort}`, {
    signal: controller.signal,
  });
  // ...
} finally {
  clearTimeout(timer);
}
```

This prevents post processing from waiting indefinitely if the server doesn't respond.

### 4. Node.js Compatible Directory Path

Uses `import.meta.url` instead of `import.meta.dir` (Bun-specific) for Node.js compatibility.

```typescript
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname: string = dirname(fileURLToPath(import.meta.url));
```

## Tech Stack

| Technology        | Purpose                               |
| ----------------- | ------------------------------------- |
| Node.js 24        | Runtime environment                   |
| TypeScript 5      | Type-safe development                 |
| Bun               | Package manager, test runner, bundler |
| systeminformation | System metrics collection             |
| zod               | Schema validation                     |
| @actions/core     | GitHub Actions integration            |

## Usage in GitHub Actions

### Basic Usage

This action is designed to be executed at the **beginning of the workflow**.

```yaml
steps:
  # Place this action at the beginning (main executes, server starts)
  - uses: massongit/actions-workflow-metrics@v1

  # Other steps (metrics collected during this time)
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Run tests
    run: npm test

  - name: Build
    run: npm run build

  # post auto-executes at job end, outputs to summary
```

### Using as Local Action

When testing during development of this repository, use `uses: ./`.
In this case **only**, `actions/checkout` is required beforehand.

```yaml
steps:
  # Checkout required first for local action
  - uses: actions/checkout@v4

  # Use local action
  - uses: ./

  # Other steps
  - name: Run tests
    run: npm test
```

**Important**:

- `main` executes at workflow start (or right after checkout), starting server in background
- `post` auto-executes at job end, displaying collected metrics in GitHub Actions summary
- Only when using as local action (`uses: ./`) is checkout required beforehand

## Project Structure

```text
src/
├── lib.ts                      # Common schema and server settings
├── main/
│   ├── index.ts               # Spawns server as detached process
│   ├── server.ts              # HTTP server (metrics JSON API)
│   ├── metrics.ts             # Metrics collection class
│   └── metrics.test.ts        # Metrics collection tests
└── post/
    ├── index.ts               # Output to GitHub Actions summary
    ├── lib.ts                 # Metrics fetch and rendering
    ├── lib.test.ts            # Rendering logic tests
    ├── renderer.ts            # Mermaid chart generation (using template literals)
    └── renderer.test.ts       # Chart generation tests

dist/                          # Build output (must be committed)
├── main/
│   ├── index.js              # Bundled
│   └── server.js             # Bundled (includes dependencies)
└── post/
    └── index.js              # Bundled (includes dependencies)
```
