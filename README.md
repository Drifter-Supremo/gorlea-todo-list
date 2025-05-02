# Gorlea Todo List

A modern, AI-powered task management application built with Next.js, Firebase, and OpenAI.

## Features

- Create, edit, and delete tasks with due dates and priority levels
- Mark tasks as complete
- Natural language task creation with AI assistant
- Google authentication
- Responsive design for mobile and desktop

## Environment Variables

This project uses environment variables for configuration. For development, the application will work with default values, but for production, you should set these variables in your hosting platform.

1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```

2. Fill in your own values in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   ...
   ```

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Security Note

For development convenience, this application includes fallback values for Firebase configuration. In a production environment, you should:

1. Set all environment variables in your hosting platform
2. Never expose API keys in client-side code
3. Use Firebase security rules to restrict access to your data

## License

MIT
