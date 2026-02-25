---
name: memories
description: Session memory for tracking latest work and context
---

# Session Memory

This file tracks recent work and context for continuity across sessions. The agent reads this at the start of each session and updates it as work progresses.

## Current Focus

**Active Task:** _None_
**Started:** _Not started_
**Status:** _Idle_

## Recent Work

| Date | What Was Done | Files Changed |
|------|---------------|---------------|
| _No entries yet_ | - | - |

## Pending Tasks

- _No pending tasks_

## Context Notes

Important context to remember across sessions:

### Decisions Made
_Why certain approaches were chosen_

### Gotchas Discovered
_Unexpected behaviors or edge cases found_

### Dependencies
_External services, APIs, or packages to consider_

## Known Issues

| Issue | Description | Status | Workaround |
|-------|-------------|--------|------------|
| _None yet_ | - | - | - |

---

## How This Works

### For the Agent

1. **Start of session:** Read this file to understand current context
2. **Starting work:** Update "Current Focus" with what you're working on
3. **Completing work:** Add entry to "Recent Work" table
4. **Ending session:** Update status, add any pending tasks
5. **Discovering issues:** Add to "Known Issues" or "Context Notes"

### For the User

- Feel free to edit any section manually
- Add pending tasks you want the agent to work on
- Update context notes with important information
- Clear old entries when no longer relevant

### Format Guidelines

- **Recent Work:** Keep last 10-15 entries, archive older ones
- **Pending Tasks:** Use checkboxes `- [ ]` for tracking
- **Known Issues:** Include status (Open, Investigating, Fixed)
- **Dates:** Use YYYY-MM-DD format
