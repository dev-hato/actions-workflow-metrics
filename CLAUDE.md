# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code).
It helps when working with code in this repository.

## Project Overview

A custom GitHub Action for workflow telemetry collection.
Periodically collects CPU load and memory usage during workflow execution.
Visualizes them as Mermaid charts and outputs to GitHub Actions summary.

## Documentation

This project maintains bilingual documentation:

- **README.md** - English documentation
- **README.ja.md** - Japanese documentation

**Important**: When updating either readme file, the other must be updated accordingly.
Keep both files synchronized with the same content in the appropriate language.

**Important**: README.md's description (line 5) must match action.yml's `description` field.
When updating one, update the other accordingly. Note that action.yml's description should not have a trailing period.

## Architecture

### GitHub Actions Custom Action Flow

```text
1. main execution: dist/main/index.js
   └─ Spawns server as detached process and exits immediately
       └─ dist/main/server.js (runs in background)
           └─ Creates Metrics instance, collects metrics every 5 seconds
           └─ Exposes JSON API via HTTP server (localhost:7777)

2. Other workflow steps execute
   (Server continues running in background, collecting metrics every 5 seconds)

3. post execution: dist/post/index.js (after all steps complete)
   └─ Fetches metrics from server, renders Mermaid chart, outputs to summary
```

### Key Components

- **src/main/metrics.ts**: Collects CPU (user/system 0-100%) and memory (active/available in MB).
  Uses `systeminformation`. Starts collection in constructor with drift-compensated `setTimeout`.
- **src/post/renderer.ts**: Generates Mermaid stacked bar charts using template literals. Converts time series to cumulative values with `toReversed()` and `reduce()`.
- **src/lib.ts**: Zod schema for metrics validation and server port constant (7777).

### Build Process

Entry points: `src/main/index.ts`, `src/main/server.ts`, `src/post/index.ts` → bundled to `dist/`

**Critical**: `dist/` directory must be committed. All dependencies are bundled into dist files.

## Implementation Notes

- **Immediate async start**: `Metrics` class starts async collection in constructor without `await`.
  Uses `.catch()` for error handling.
- **Drift-compensated timers**: Uses `Math.max(0, nextUNIXTimeMs - Date.now())` for precise intervals.
- **AbortController timeout**: 10-second timeout for metrics fetch in post execution.
- **Node.js compatibility**: Uses `import.meta.url` with `dirname(fileURLToPath())`.
  Avoids Bun-specific `import.meta.dir`.
