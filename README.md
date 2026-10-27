# InnerPeace

InnerPeace is a full-stack web application designed for mindful journaling, journey timelines, and personal reflections.

## Project Architecture

```
innerPeace/
├── innerpeace-backend/      # NestJS, TypeORM, PostgreSQL backend API
│   ├── src/                 # Application source code (modules, controllers, entities)
│   ├── test/                # End-to-end and unit tests
│   ├── Dockerfile           # Backend container definition
│   ├── .dockerignore        # Backend Docker ignore rules
│   ├── .env.example         # Backend environment variables template
│   └── package.json
├── innerpeace-forntend/     # React 18, Vite, TailwindCSS frontend
│   ├── src/                 # Application UI components, pages, hooks
│   ├── Dockerfile           # Frontend Nginx production container
│   ├── .dockerignore        # Frontend Docker ignore rules
│   ├── .env.example         # Frontend environment variables template
│   └── package.json
├── docker-compose.yml       # Multi-container orchestration (DB, API, Web)
├── .dockerignore            # Root Docker ignore rules
├── .gitignore               # Root Git ignore rules
└── README.md                # Project documentation
```

---

## Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [TypeORM](https://typeorm.io/)
- **Authentication**: JWT & Passport
- **Documentation**: Swagger / OpenAPI
- **Media Processing**: AWS S3 & Sharp

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## Quick Start (with Docker Compose)

The easiest way to run the entire stack (PostgreSQL + Backend + Frontend) is with Docker:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Swagger Documentation**: [http://localhost:3000/api](http://localhost:3000/api)

---

## Local Development Setup

### Prerequisites
- **Node.js**: v20 or v22 LTS
- **PostgreSQL**: v15+ running locally (or via Docker)

### 1. Database Setup
Ensure PostgreSQL is running and create a database:
```sql
CREATE DATABASE innerpeace_db;
```

### 2. Backend Setup
```bash
cd innerpeace-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Start development server
npm run start:dev
```
Backend API will be running on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd innerpeace-forntend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```
Frontend will be running on `http://localhost:5173`.

---

## Environment Variables

### Backend (`innerpeace-backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASS` | Database password | `postgres` |
| `DB_NAME` | Database name | `innerpeace_db` |
| `PORT` | API server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173,http://127.0.0.1:5173` |
| `JWT_SECRET` | Secret key for JWT signing | `change_this_to_a_secure_jwt_secret` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |

### Frontend (`innerpeace-forntend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

---

## License
UNLICENSED
