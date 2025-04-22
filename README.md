# Staff Management Tool

A simple web-based staff management solution for project assignment, progress tracking, and team communication with role-based access controls.

## Features

- Role-based access control (Team Lead and Developer roles)
- Project and task management
- Progress tracking and reporting
- Team communication
- Performance metrics visualization

## Tech Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material UI for components
- Chart.js for metrics visualization

### Backend
- Node.js with Express
- TypeScript
- Passport.js for authentication
- Jest for testing

### Database
- PostgreSQL for main data storage
- Redis for caching

### Infrastructure
- Docker for containerization
- GitHub Actions for CI/CD
- Vercel for hosting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd staff-mgmt-tool
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start the development environment:
```bash
# Start all services using Docker Compose
docker-compose up -d
```

5. Run the application:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm run dev
```

## Development

### Code Structure
```
staff-mgmt-tool/
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
├── docker/            # Docker configuration files
├── docs/             # Project documentation
└── scripts/          # Utility scripts
```

### Testing
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

### Contributing
1. Create a feature branch from `develop`
2. Make your changes
3. Run tests
4. Submit a pull request

## License
[License Type] - See LICENSE file for details 
