# 5 Elements Nodes

## Current State
The site has a contact form that stores submissions in the backend via `submitContact`. The backend also exposes `getAllSubmissions` which returns all stored contacts. There is no UI to view these submissions.

## Requested Changes (Diff)

### Add
- A password-protected `/admin` route that displays all contact form submissions in a table
- A simple login screen with a password field (hardcoded password: "5elements")
- Session state: once logged in, stay logged in until page refresh
- A table showing each submission: name, email, message columns
- A logout button

### Modify
- App.tsx: add React Router or hash-based routing for the `/admin` path, or render admin view conditionally based on URL

### Remove
- Nothing

## Implementation Plan
1. Create an AdminPage component with password gate (hardcoded password "5elements")
2. Fetch all submissions using `getAllSubmissions` from the backend
3. Display in a clean table with name, email, message columns
4. Add route: if URL contains `/admin` or `#admin`, show AdminPage instead of main site
5. Add logout button that clears auth state
