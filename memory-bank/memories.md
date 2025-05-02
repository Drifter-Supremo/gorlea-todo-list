# Gorlea Tasks - Memories

## UI Preferences

- In the AI chat modal, after task creation, display a confirmation message like '✅ Task created!' before closing the modal.
- In the AI chat modal, the input should be a textarea that wraps text.
- In the add task modal, close the modal automatically after task creation.
- In the AI chat modal, toast notifications should be clean and minimal, showing only a checkmark and success message without including the task title.
- The 'Chat with Gorlea' text in the chat modal should be positioned lower and more to the right for better appearance on mobile devices.
- Task cards on mobile should have better spacing and layout to prevent title and due date text from being cut off.
- The Google sign-in button should be styled with the Google G logo and Google brand colors.
- Smooth animations should be used throughout the UI/UX, including for actions like signing in and signing out.
- Completed tasks should be collapsible to save space, with styling consistent with the rest of the app.

## Security

- API keys should not be exposed in console logs for security reasons.
- The repository is public, requiring extra care with credentials and sensitive information.

## Task Management

- Task completion should preserve all task metadata (title, details, due date, priority).
- Firebase configuration should use environment variables with fallbacks to default values for development.
- Overdue tasks should be labeled as "Overdue" and displayed with a red badge.
- Overdue tasks should be sorted to appear at the top of the task list.
- Tasks created with dates in the past should be automatically adjusted to future dates.
