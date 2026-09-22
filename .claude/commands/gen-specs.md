---
description: Generate a spec file for a feature/component/utility, without scanning the project
disallowed-tools: Agent(Explore), Grep, Glob
allowed-tools: Write
---
Rules:
- Do not scan or read the existing project unless I explicitly attach files with @.
- Create only the spec file — no implementation code.
- Include only the information needed to build this feature/component/utility: purpose, inputs/outputs, behavior, edge cases, and acceptance criteria. Nothing else.