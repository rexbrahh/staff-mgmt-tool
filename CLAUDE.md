# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js + Express + TypeScript)
- **Start development server**: `cd backend && npm run dev`
- **Build for production**: `cd backend && npm run build`
- **Run tests**: `cd backend && npm test`
- **Run tests in watch mode**: `cd backend && npm run test:watch`
- **Lint code**: `cd backend && npm run lint`
- **Format code**: `cd backend && npm run format`
- **Seed database**: `cd backend && npm run seed`

### Frontend (Next.js + TypeScript)
- **Start development server**: `cd frontend && npm run dev`
- **Build for production**: `cd frontend && npm run build`
- **Start production server**: `cd frontend && npm start`
- **Lint code**: `cd frontend && npm run lint`

### Docker Development
- **Start all services**: `docker-compose up -d`
- **Stop all services**: `docker-compose down`
- **Backend runs on port 3000, frontend on port 3001**

## Architecture Overview

### Database Configuration
The project has been configured for **PostgreSQL** with **Supabase** integration:
- **Database**: PostgreSQL via Prisma ORM
- **Backend port**: 5001 (changed from 3000 to avoid frontend conflicts)
- **Frontend port**: 3000 (Next.js dev server)

### Backend Structure
- **Entry point**: `backend/src/server.ts`
- **ORM**: Prisma with PostgreSQL database schema
- **Models**: Prisma-generated types (User, StaffProfile, Project, Task, Leave, Attendance)
- **Authentication**: Passport.js with JWT strategy, bcrypt for password hashing
- **API Routes**: RESTful endpoints under `/api` prefix
- **Middleware**: Custom auth middleware, error handling, CORS
- **Role-based access**: ADMIN, MANAGER, EMPLOYEE roles

### Frontend Structure
- **Framework**: Next.js 15 with App Router
- **State Management**: Redux Toolkit with auth slice
- **UI Framework**: Material-UI components + Tailwind CSS
- **Routing**: Next.js file-based routing
- **Authentication**: JWT tokens, client-side auth management
- **API Client**: Axios for backend communication

### Database Schema
- **Users**: Core user authentication and profile information
- **StaffProfiles**: Extended employee information (department, position, skills)
- **Projects**: Project management with assignments and tasks
- **Tasks**: Task tracking with priority and status management
- **Leave**: Leave request management with approval workflow
- **Attendance**: Daily attendance tracking with check-in/check-out

### Key Integration Points
- **Authentication flow**: Frontend stores JWT tokens, backend validates via Passport
- **API base URL**: Frontend configured to call backend at appropriate port
- **Database connection**: PostgreSQL via Supabase (DATABASE_URL environment variable)
- **Error handling**: Consistent error responses across API endpoints

## Environment Setup
- Backend requires PostgreSQL connection string (DATABASE_URL environment variable)
- Optional Supabase integration (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- Frontend requires backend API URL (REACT_APP_API_URL)
- JWT configuration (JWT_SECRET, JWT_EXPIRES_IN)

## Database Commands
- **Generate Prisma client**: `npx prisma generate`
- **Run migrations**: `npx prisma migrate dev`
- **Deploy migrations**: `npx prisma migrate deploy`
- **View database**: `npx prisma studio`
- **Reset database**: `npx prisma migrate reset`