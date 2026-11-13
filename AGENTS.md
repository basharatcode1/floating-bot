<!-- BEGIN:nextjs-agent-rules -->
# Workspace Rules

- **Framework Context:** This Next.js version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- **Mandatory Documentation:** Before performing any development, bug fixing, or UI/UX tasks, you must read and strictly adhere to:
  - [DEVELOPMENT_RULES.md](file:///c:/theme-color/docs/DEVELOPMENT_RULES.md) (Architecture, UI library, forms, state, styling guides)
  - [responsive_design.md](file:///c:/theme-color/docs/responsive_design.md) (Responsiveness, layout, and button formatting rules)
- **Architecture Maintenance:** Whenever you make structural changes to the project (e.g., creating a new directory in `/app`, introducing a new architectural pattern, or refactoring how a system is set up), you MUST update [ARCHITECTURE.md](file:///c:/theme-color/ARCHITECTURE.md) to accurately reflect the changes.
- **Scratch File Cleanup:** Temporary scripts or utility files created in the project root during task execution (e.g., refactor scripts, test dumps, scratch scripts) MUST be deleted immediately after their usage is finished to keep the repository clean.
<!-- END:nextjs-agent-rules -->
