# ALAI

## Project Info
- Created: 2026-02-09
- Status: Active

## Structure (17 Sections)
This project follows the standard template. See directories:
docs/, frontend/, backend/, mobile/, ai/, infrastructure/, test/,
marketing/, sales/, support/, security/, backup/, legal/, design/,
rnd/, team/

## CC (Claude Code / GOTCHA)
- Goals: .claude/goals/ (what this project needs to achieve)
- Args: .claude/args/config.json (behavioral settings for this project)
- Context: .claude/context/ (domain knowledge)
- Hard-prompts: .claude/hard-prompts/ (reusable prompt templates)
- Hooks: .claude/hooks/ (project-specific deterministic gates)
- Agents: .claude/agents/ (project-specific agent definitions)
- Commands: .claude/commands/ (project-specific slash commands)

## System Tools (shared, DO NOT duplicate)
- Tasks: ~/system/tools/task.sh
- Memory: node ~/system/tools/memory-lookup.js "query"
- Email: node ~/system/tools/mail.js
- Deploy: ~/system/tools/deploy/deploy-master.sh
- Security check: node ~/system/tools/security.js check <path>
- Full manifest: ~/system/tools/manifest.md

## Rules
Global rules apply: ~/system/rules/
Project-specific rules below:

---

## Boundaries
This project is a self-contained entity.
If something doesn't belong inside this project's borders, STOP and ask Alem.
