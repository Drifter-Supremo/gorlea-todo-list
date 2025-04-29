Gorlea Tasks — MVP Roadmap

  

> All steps are mandatory, including email notifications.

Work through each checkbox sequentially. Mark as complete when finished, commit, and push.

  

  

  

  

---

  

Phase 0 – Project & Secrets Setup

  

[x] 0.1 Create/clean repo & branch

  

[x] 0.2 Add .env.local with keys:

  

NEXT_PUBLIC_FIREBASE_API_KEY=

  

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

  

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

  

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

  

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

  

GEMINI_API_KEY=

  

  

[x] 0.3 Add .env.local & credentials.txt to .gitignore, then delete credentials.txt

  

[x] 0.4 Commit → chore: move secrets to env

  

  

  

---

  

Phase 1 – Client‑Side Firebase Bootstrap

  

[x] 1.1 npm install firebase @react-oauth/google @google/generative-ai date-fns --legacy-peer-deps

  

[x] 1.2 Create lib/firebase.ts — export app, auth, db

  

[x] 1.3 Create hooks/useAuth.tsx — wrap onAuthStateChanged, expose login() / logout()

  

[x] 1.4 Wire app-bar.tsx to display user avatar & Google sign‑in/out buttons

  

  

Phase 1.5 – Styling Tokens

  

[x] 1.5.1 Add Tailwind variables to globals.css:

  

:root {

--bg-primary:#032934;

--text-main:#F5E8C2;

--accent:#F29600;

}

  

[ ] 1.5.2 Verify colors across all components

  

  

  

---

  

Phase 2 – Firestore CRUD Helpers

[x] 2.1 Firestore CRUD helpers implemented in lib/firestore.ts (addTask, getTasks, updateTask, deleteTask). All now use per-user subcollections: tasks are stored under users/{userId}/tasks.
[x] 2.2 Frontend updated to use helpers and fetch only the signed-in user's tasks. Verified: logging in/out with different accounts shows only that user's tasks.
[x] 2.3 Update task-row.tsx checkbox to call toggleComplete
    - (Implemented via parent handler: toggling the checkbox updates Firestore for the current user. This follows React best practices.)
[x] 2.4 Add/Edit Task modal: time picker (15-min increments, mobile/desktop friendly)
[x] 2.5 Mobile long-press on task row opens modal with Edit/Delete actions
[x] 2.6 Minimal delete confirmation dialog (all devices)
[x] 2.7 Edit modal improvements: pre-filling, unified for add/edit

_Note: listenTasks (real-time) not yet implemented; currently using getTasks for one-time fetch. Multi-user storage is complete and tested as of 2025-04-29._

  

  

---

  

Phase 3 – Gemini 2.0 Flash Cloud Function

  

[ ] 3.1 firebase init functions (TypeScript)

  

[ ] 3.2 Add functions/parseTask.ts onCall function:

  

Input { text: string }

  

Call Gemini 2.0 Flash via @google/generative-ai with system prompt: "Convert the user’s sentence into JSON → {title, dueTimestamp (ISO), priority(low|medium|high)}. Return ONLY the JSON."

  

Validate & return JSON; log errors

  

  

[ ] 3.3 firebase emulators:start → local test

  

[ ] 3.4 firebase deploy --only functions

  

  

  

---

  

Phase 4 – AI Parsing Integration

  

[ ] 4.1 In add-task-modal.tsx:

  

On submit, call httpsCallable('parseTask')

  

On success, invoke addTask() with returned JSON

  

  

[ ] 4.2 Implement optimistic UI updates & error toasts via shadcn useToast

  

  

  

---

  

Phase 5 – Daily Email Digest (MANDATORY NOTIFICATIONS)

  

[ ] 5.1 Install Firebase Trigger Email extension OR create scheduled Pub/Sub Cloud Function (pubsub.schedule('0 8 * * *'))

  

[ ] 5.2 Query tasks due/overdue for each user and send digest email via Nodemailer (Gmail App Password)

  

[ ] 5.3 Verify email receipt and content accuracy

  

  

  

---

  

Phase 6 – Deploy to Vercel

  

[ ] 6.1 Push repo to GitHub & connect to Vercel

  

[ ] 6.2 Add all .env keys in Vercel → Environment Variables

  

[ ] 6.3 Ensure build settings: pnpm run build (output .next)

  

[ ] 6.4 Configure vercel.json or rewrites to proxy Firebase Functions

  

[ ] 6.5 Visit live URL → test auth, CRUD, AI parsing, email digests

  

[ ] 6.6 Create Git tag mvp-live  ![🎉](https://fonts.gstatic.com/s/e/notoemoji/16.0/1f389/72.png)

  

  

  

---

  

## Future Enhancements

- Task filtering and sorting
- Task editing (via details modal)
- Task deletion (delete icon on desktop, long-press on mobile)
- Task categories/tags
- User authentication
- Data persistence
- Calendar view
- Notifications
- Advanced AI features (task suggestions, reminders, etc.)

- Task cards: only title and due date shown on mobile, delete icon hidden for cleaner look.
- Details modal for editing and viewing full info; long-press on mobile shows only delete.
- All UI labels use "Details" instead of "Description."

Task editing & deletion UI

Sorting/filtering & calendar view

Chat‑style Gorlea assistant panel

Per‑task push notifications
