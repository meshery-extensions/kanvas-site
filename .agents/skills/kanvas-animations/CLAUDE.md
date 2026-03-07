# React Animation Studio Plugin Guide

## Purpose
- Operational guide for working safely in `plugins/kanvas-animations`.
- Keep edits scoped, minimal, and aligned with this plugin's existing architecture.

## Supported Commands
- `animate-3d` (see `commands/animate-3d.md`)
- `animate-audit` (see `commands/animate-audit.md`)
- `animate-background` (see `commands/animate-background.md`)
- `animate-component` (see `commands/animate-component.md`)
- `animate-effects` (see `commands/animate-effects.md`)
- `animate-export` (see `commands/animate-export.md`)
- `animate-preset` (see `commands/animate-preset.md`)
- `animate-scroll` (see `commands/animate-scroll.md`)
- `animate-sequence` (see `commands/animate-sequence.md`)
- `animate-text` (see `commands/animate-text.md`)
- `animate-transition` (see `commands/animate-transition.md`)
- `animate` (see `commands/animate.md`)

## Prohibited Actions
- Do not delete or rename `.claude-plugin/plugin.json`.
- Do not introduce secrets, credentials, or tenant-specific IDs in tracked files.
- Do not modify unrelated plugins from this plugin workflow unless explicitly requested.

## Required Validation Checks
- Run `npm run check:plugin-context`.
- Run `npm run check:plugin-schema`.
- If code/scripts changed in this plugin, run targeted tests for `plugins/kanvas-animations`.

## Context Budget
Load in this order and stop when you have enough context:
1. `CONTEXT_SUMMARY.md`
2. `commands/index` (or list files in `commands/`)
3. `README.md` and only the specific docs needed for the current task

## Escalation Path
- If requirements conflict with plugin guardrails, pause implementation and document the conflict.
- If validation fails and root cause is unclear, escalate with failing command output and touched files.
- For production-impacting changes, request maintainer review before release/publish steps.
