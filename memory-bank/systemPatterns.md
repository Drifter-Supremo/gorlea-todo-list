# System Patterns: Gorlea Tasks

## System Architecture

- **Frontend:** Built with Next.js (App Router), React, and TypeScript for a modern, modular SPA experience.
- **Styling:** Tailwind CSS for utility-first styling; shadcn/ui for reusable UI components.
- **State Management:** React state and context for UI state; Firebase for persistent data.
- **Backend/Cloud:** Firebase (Firestore, Auth, Functions) for real-time data, authentication, and serverless logic.
- **AI Integration:** Gemini 2.0 Flash via Google Generative AI for natural language task parsing and assistant features (Phase 3, facing 500 errors during real integration).
- **All CRUD, time picker, mobile/desktop UX, and edit/delete features are complete and live.**
- **Task cards: on mobile, only title and due date are shown; delete icon is hidden for clarity.**
- **Details modal for editing and viewing full info; long-press on mobile shows only delete.**
- **All UI labels use "Details" instead of "Description."**
- **Documentation/memory bank is up to date for AI or developer handoff.**

## Key Technical Decisions

- Use of Next.js App Router for file-based routing and layouts.
- Modular component structure for maintainability and scalability.
- Integration of shadcn/ui for consistent, accessible UI patterns.
- Firebase chosen for real-time sync, authentication, and serverless functions.
- AI parsing handled via a dedicated endpoint in 'app/api/ai/parse/route.ts', currently using a mock setup due to integration issues with Gemini API.
- Progressive Web App (PWA) support for offline functionality and installability.

## Design Patterns

- **Container/Presentational Components:** Separation of logic and UI for testability.
- **Optimistic UI Updates:** Immediate feedback for task actions, with error handling via toasts.
- **Single Source of Truth:** Firestore as the canonical data store for tasks.
- **Service Abstraction:** Utility modules (e.g., lib/tasks.ts) abstract Firestore and AI logic from UI.
- **Consistent use of "Details" field in all task-related UI and logic.**

## Component Relationships

- **app-bar.tsx:** Top-level navigation and user controls, now correctly displaying profile pictures after resolution.
- **add-task-button.tsx / add-task-modal.tsx:** Entry point for new tasks, integrates AI parsing. "Details" field replaces "Description."
- **task-list.tsx / task-row.tsx:** Display and manage tasks, connected to Firestore. On mobile, only title and due date are shown; delete icon hidden.
- **chat-button.tsx / chat-modal.tsx:** Access Gorlea AI assistant.
- **UI components (ui/):** Shared building blocks for dialogs, buttons, forms, etc.

## Patterns for Extensibility

- Feature roadmap includes modular enhancements (filtering, calendar, notifications).
- Cloud Functions and AI logic are decoupled for future upgrades.
- UI and logic layers are separated for easier testing and maintenance.

## May 2025

### Path Aliases (Updated)
```json
// tsconfig.json
{
  "baseUrl": ".",
  "paths": {
    "@components/*": ["components/*"],
    "@lib/*": ["src/lib/*"]
  }
}
