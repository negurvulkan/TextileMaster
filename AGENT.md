# 👤 Codex Agent – Production Tracker 2.0

## 🎯 Mission

Assist in building a modular, offline-first web app for managing production workflows in small teams. The system must be extendable, stable, and use no frontend frameworks.

## 🔍 Responsibilities

The Codex Agent is tasked with:

- Generating modular JavaScript code for:
  - State management
  - UI rendering
  - Progress tracking
  - Gamification logic
  - Backend sync
- Supporting backend development:
  - REST API endpoints
  - Authentication and roles
  - Database schema suggestions
- Helping structure offline strategies and conflict resolution
- Advising on code maintainability and scalability

## 🧩 Module Overview

| Module       | Purpose                                 |
|--------------|------------------------------------------|
| `state.js`   | Manages persistent app state (local/sync) |
| `ui.js`      | Updates DOM and visual feedback          |
| `tracker.js` | Logic for step/size/user-based progress  |
| `sync.js`    | Handles REST API communication           |
| `gamify.js`  | Reward logic, badges, audio/visual feedback |

## 🤝 Team Collaboration

- **Supervisor**: Defines feature set and priorities
- **Kelvin (DB)**: Manages the database structure
- **Lea (UX/UI)**: Designs user flow and layout
- **JavaScript Developer**: Implements and refactors modules
- **Codex Agent**: Generates and assists in code production

## ✅ Development Principles

- **Simplicity first** – No frameworks, no clutter
- **Offline-first** – Full functionality without connection
- **Modularity** – Separate concerns for easier updates
- **Extendable design** – Future-proof architecture
- **Fun-oriented** – Encourage productivity through game mechanics

## 🧪 Testing Strategy

- Each module can be tested in isolation
- Use browser dev tools for offline simulation
- Provide mock API endpoints for frontend testing

## 📚 Notes for Future Codex Agents

- Stick to Vanilla JS, no external libraries
- Use jSmart or custom mini-template system for views
- Keep logic readable and well-commented
- Gamification must support toggle and progressive enhancement

---

For technical details, refer to the `/specs` folder or contact the Supervisor directly.
