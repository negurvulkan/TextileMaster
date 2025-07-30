# Production Tracker v2.0 🧵📊

A modular, offline-first web application for tracking and managing textile production projects. Designed for small to mid-sized teams working in garment refinement and decoration, it offers a clear interface, gamified motivation, and seamless offline-to-online synchronization.

---

## 🔷 Purpose

Track production progress for textile jobs, broken down into:
- Projects (e.g. “Müller Workwear 2025”)
- Motif groups (e.g. “Logo STAFF”, “Back Print”)
- Products (e.g. “T-Shirt Unisex Black”)
- Sizes and quantities
- Individual workflow steps (e.g. Pre-Treat, Print, Package)

---

## ⚙️ Architecture

### 🔻 Frontend
- Vanilla JS (modular structure), HTML5, CSS3
- Offline-first (using `localStorage` or IndexedDB)
- Responsive UI
- Gamification layer
- Synchronizes with backend when online

### 🔺 Backend
- PHP 8.x with MariaDB
- RESTful API (e.g. `/api/sync.php`, `/api/projects.php`)
- Optional user authentication and roles
- Central data store for projects, products, progress

---

## 🗃️ Data Model Overview

| Concept        | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Project        | Client orders, contains motif groups                                        |
| Motif Group    | A design variant or decoration group                                        |
| Product        | Apparel item with color, cut, etc.                                          |
| Sizes & Qty    | Custom-defined per product (e.g. S:10, M:20, ...)                           |
| Workflow Steps | Configurable per project (e.g. Pre-Treat Front, Print Back, ...)            |
| Users & Roles  | Track who did what, optionally with role-based access                       |
| Progress       | Quantity, step, timestamp, and user data logged                             |

---

## 🔄 Synchronization

Offline-first with sync:
- Local changes saved immediately
- App checks for internet regularly
- Sync when available (push/pull)
- Conflict resolution via timestamps and user IDs

---

## 🎮 Gamification Features

| Feature             | Description                                           |
|---------------------|-------------------------------------------------------|
| XP system           | Earn XP for completed work                            |
| Levels & Titles     | Visual progress through tiers                         |
| Mini-Challenges     | e.g. “Print 10 hoodies in 30 minutes”                 |
| Combos              | Extra XP for error-free streaks                       |
| Pop-ups & Sounds    | Celebratory audio & popups for milestones             |
| Leaderboards        | Daily, weekly, and all-time rankings                  |

---

## 📐 UI Overview

- **Header**: Project, time, sync status, user, XP bar
- **Selector Panel**: Project → Motif → Product → Size → Step
- **Progress Controls**: [+] and [–] for adjusting quantity
- **Stats View**: Daily performance, total progress, status bars
- **History Panel**: Log of recent entries
- **Gamification Panel**: Active combo, challenge status, XP

---

## 🧰 Planned Extensions

- Export as CSV or PDF
- Admin panel for managing users and projects
- QR code support for quick selection
- Design uploads and print templates
- WebDAV and USB backup support

---

## 💡 Technologies Used

- Vanilla JavaScript
- HTML5 & CSS3
- PHP 8.x
- MariaDB
- IndexedDB / localStorage
