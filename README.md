# 🧵 Production Tracker 2.0

A web-based tool for organizing and managing production projects within teams — fast, offline-capable, modular, and with gamification to break the monotony.

## 🚀 Features

- Manage multiple production projects with custom materials, sizes, and workflows
- Track progress per user, task, and size
- Fully offline-capable (localStorage or IndexedDB)
- Syncs with a PHP backend when online
- Authenticated admin functions
- Optional gamification (levels, XP, challenges, rewards)
- 100% Vanilla JS – no frameworks, no dependencies

## 🏗️ Architecture

### 🔻 Frontend

- **Tech**: HTML, CSS, Vanilla JavaScript
- **Modules**:
  - `state.js` – Manages app state (local & synced)
  - `ui.js` – Handles DOM rendering
  - `tracker.js` – Progress tracking logic
  - `sync.js` – Communication with backend
  - `gamify.js` – Rewards, points, feedback
- **Storage**: IndexedDB or localStorage
- **PWA**: Works offline, persistent data

### 🔺 Backend

- **Tech**: PHP 8+, MariaDB
- **REST API**:
  - `/projects`, `/progress`, `/users`, `/settings`, `/sync`
- **Main tables**:
  - `projects`, `project_steps`, `materials`, `sizes`
  - `progress`, `users`, `settings`
- **Features**:
  - Authentication & roles
  - Push/pull sync logic
  - Admin management endpoints

## 📦 Setup & Usage

1. **Frontend**:
   - Open `index.html` in any modern browser
   - Works offline immediately

2. **Backend**:
   - Set up PHP server with MariaDB
   - Configure DB credentials in `.env` (or config file)
   - Ensure `/api/` routes are publicly accessible

3. **Sync**:
   - App detects online state
   - Automatically syncs when connected

## 🔐 Authentication

- Simple login screen or user picker
- Roles: `worker`, `admin`
- Token or session-based access

## 🎮 Gamification (optional)

- Toggle in app settings
- Earn XP/coins for tasks
- Challenges, badges, sounds
- Hidden Easter eggs
- Leaderboard support

## 📌 Roadmap

- [x] Project & progress tracking
- [x] Offline mode + sync
- [x] User system
- [ ] Gamification features
- [ ] Reporting & export
- [ ] UI/UX refinement

## 📃 License

MIT – feel free to fork, remix, and improve.
