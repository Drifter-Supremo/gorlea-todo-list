# Tech Context: Gorlea Tasks

## Technologies Used

- **Next.js 14**: React framework with App Router for routing and layouts.
- **React**: UI library for building interactive interfaces.
- **TypeScript**: Type-safe JavaScript for reliability and maintainability.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **shadcn/ui**: Reusable, accessible UI component library.
- **date-fns**: Date utility library for parsing and formatting.
- **Lucide React**: Icon library for consistent UI icons.
- **Firebase**: Firestore (database), Auth (authentication), Functions (serverless logic), and Extensions (email triggers).
- **@google/generative-ai**: Gemini 2.0 Flash for AI-powered task parsing and assistant features.
- **pnpm**: Preferred package manager for dependency management.

## Development Setup

- Node.js 18.17.0 or later required.
- Install dependencies with `pnpm install`.
- Environment variables managed via `.env.local` (see MVP checklist for required keys).
- Local development with `pnpm run dev`.
- Firebase emulators for local testing of Firestore and Functions.
- Deployment via Vercel for production hosting.

## Technical Constraints

- Must support both online and offline usage (PWA).
- Cross-device compatibility (desktop, mobile, tablet).
- High accuracy required for natural language parsing.
- Secure handling of API keys and credentials.
- Real-time sync and low-latency updates for tasks.

## Dependencies

- See `package.json` for full list.
- Key dependencies: next, react, typescript, tailwindcss, shadcn/ui, firebase, @google/generative-ai, date-fns, lucide-react, pnpm.

## Integration Notes

- Project is currently in Phase 3: Gemini AI parsing integration.
- All Firestore CRUD, time picker, mobile/desktop UX, and edit/delete features are complete and live in main branch.
- Documentation and memory bank files are up to date for AI or new developer handoff.
- Firebase and Gemini API keys must be set in environment variables.
- Firestore is the single source of truth for tasks.
- AI parsing is handled via a dedicated Firebase Cloud Function.
- Email notifications use Firebase Extensions or custom Cloud Functions.
