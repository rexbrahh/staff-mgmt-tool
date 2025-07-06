# Gemini Project Configuration

This file provides context for the Gemini AI assistant to understand and effectively work with this project.

## Project Overview

This is a staff management tool with a web-based interface.

- **Backend:** The backend is a Node.js/TypeScript application using Express.js, Prisma for ORM, and JWT for authentication. It's located in the `/backend` directory.
- **Frontend:** The frontend is a Next.js/TypeScript application using React and Material-UI. It's located in the `/frontend` directory.

## Development Workflow

- **Backend:**
    - To install dependencies: `npm install` in the `/backend` directory.
    - To run the development server: `npm run dev` in the `/backend` directory.
    - To run tests: `npm test` in the `/backend` directory.
- **Frontend:**
    - To install dependencies: `npm install` in the `/frontend` directory.
    - To run the development server: `npm run dev` in the `/frontend` directory.

## Key Files

- `backend/prisma/schema.prisma`: The database schema.
- `backend/src/app.ts`: The main application file for the backend.
- `frontend/src/app/page.tsx`: The main page for the frontend.
