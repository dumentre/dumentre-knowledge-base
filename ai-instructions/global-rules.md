# Dumentre Global AI Instructions

## 1. Core Principles
- Welcome to Dumentre. This knowledge base serves as the single source of truth for all business logic, design patterns, and architectural decisions.
- Do not duplicate rules in individual repository `.md` files. 
- All agents (Claude, Cursor, Antigravity, etc.) should consult this repository to understand context.

## 2. Directory Structure
- `dumentre-website-v2/`: The core website application.
- `official-brand-assets/`: Centralized assets, logos, fonts, and brand identity.
- `dumentre-knowledge-base/`: This repository, housing all documentation and AI guidelines.

## 3. Working Guidelines
- Always refer to `official-brand-assets` for branding constraints.
- When making cross-repository changes, ensure consistency.
- Any updates to the general rules must be committed here, not in the individual project's root.
- Shared, cross-project agent skills are cataloged and backed up in `skills/README.md`; install them globally through the Skills CLI so supported agents can use them across projects.
