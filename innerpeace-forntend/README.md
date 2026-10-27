# InnerPeace — Frontend

React + Vite + TailwindCSS frontend for the InnerPeace platform.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

## Prerequisites

- Node.js 20+
- A running instance of the [InnerPeace Backend](../innerpeace-backend)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# URL of the running backend API
VITE_API_URL=http://localhost:3000

# Optional: if the backend returns S3 keys instead of full URLs
# VITE_MEDIA_BASE_URL=https://your-bucket.s3.region.amazonaws.com
```

### 3. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Docker

Build and run the frontend as a static site via Nginx:

```bash
docker build -t innerpeace-frontend .
docker run -p 8080:80 \
  -e VITE_API_URL=http://localhost:3000 \
  innerpeace-frontend
```
