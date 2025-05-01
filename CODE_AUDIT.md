# CODE AUDIT: Gorlea Tasks

## 1. Path Alias & Module Resolution

- **tsconfig.json**  
  - `baseUrl` and `paths` are **not present**. All aliasing is removed.  
  - **Fix:** None needed unless you want to reintroduce aliases.

- **Import Paths**  
  - All imports now use relative paths (e.g. `../components/chat-modal`).  
  - No remaining `'components/...'` or `'lib/...'` imports found.
  - All referenced files exist at their mapped locations.
  - **Fix:** None needed.

- **Module Not Found**  
  - `app/page.tsx` imports `updateTask` and `deleteTask` from `../src/lib/firestore`, but these are **not exported** from that file.
  - **Fix:** Implement and export `updateTask` and `deleteTask` in `src/lib/firestore.ts`, or remove their usage/imports.

---

## 2. Task Type Consistency

- **Task Interface(s)**
  - `src/lib/types.ts` defines:
    ```ts
    export interface Task {
      id?: string
      title?: string
      description?: string
      dueDate?: any
      priority?: any
      [key: string]: any
    }
    ```
    - Problems: `id` and `title` are optional, uses `description` not `details`, loose types, index signature.
  - `src/lib/firestore.ts` uses this Task, but expects `description` and `dueDate` as Date.
  - **Fix:**  
    - Define a single canonical `Task`:
      ```ts
      export interface Task {
        id: string
        title: string
        details?: string
        dueDate?: Date | string | number | null
        priority?: string
      }
      ```
    - Refactor all code to use this interface.  
    - Remove index signatures and any duplicate/old interfaces.

---

## 3. Firestore Helper Exports

- **src/lib/firestore.ts**
  - Exports: `addTask`, `addTaskHelper`, `getTasks`.
  - **Missing:** `updateTask(id: string, updates: Partial<Task>): Promise<void>`, `deleteTask(id: string): Promise<void>`
  - **Fix:**  
    - Implement and export:
      ```ts
      export async function updateTask(id: string, updates: Partial<Task>): Promise<void> { ... }
      export async function deleteTask(id: string): Promise<void> { ... }
      ```
    - Ensure all use correct Firebase imports and reference the right collection.
    - Remove any stale or mismatched functions.
    - Update all import sites (`page.tsx`, `chat-modal.tsx`).

---

## 4. AI Parsing & Chat Wiring

- **src/lib/parseTask.ts**
  - Exports `parseTask(input: string): Promise<ParsedTask>`.
  - `ParsedTask` uses `details` and `dueTimestamp` (should match canonical `Task`).
  - **Fix:**  
    - Ensure `ParsedTask` matches `Task` fields (`title`, `details`, `dueDate`, `priority`).
    - Update `parseTask` to return `dueDate` (not `dueTimestamp`) and match types.
    - Refactor chat modal to use unified `Task` type.

- **Chat Modal**
  - Button state and event handlers are correct.
  - `handleSend()` calls `parseTask`, then `addTaskHelper`, then triggers toast.
  - **Fix:** Remove any leftover mocks or commented-out AI logic.

---

## 5. Environment Variables

- **process.env Usage**
  - All usage is via `NEXT_PUBLIC_*` variables (client-safe).
  - `.env.local` contains all required variables:
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
    - `NEXT_PUBLIC_GEMINI_KEY`
  - **Fix:** None needed. Do not hard-code secrets.

---

## 6. Accessibility & UI Sanity Checks

- **DialogContent Usage**
  - `components/chat-modal.tsx` and `src/components/chat-modal.tsx` use `<DialogContent>` without a `<DialogTitle>` or `VisuallyHidden` heading.
  - **Fix:**  
    - Add a `<DialogTitle>` or wrap the header in a visually hidden element for accessibility.
    - Ensure `aria-describedby` or `description` props are set where required.

- **UI Imports**
  - All chat modal UI components import from correct `components/ui/*` paths.

---

## 7. Final Smoke-Test Instructions

### Test Plan

1. Run `npm run dev` — should start with no compile errors.
2. Load the page — “My Tasks” list should appear.
3. Click the Chat button — modal opens.
4. Type any text — you should see a mock “Parsed → { … }” JSON.
5. Click “Add” — you should see a ✅ toast and the new task in the list.
6. Toggle complete/delete — list updates, calls `updateTask`/`deleteTask`.

---
