# SolarNexa — Smart Solar Management Platform

A full-stack web application for monitoring and managing solar energy installations, built for CleanTech operators.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18 · Vite · TailwindCSS     |
| Backend  | Node.js · Express                 |
| Routing  | React Router v6                   |
| HTTP     | Axios                             |

## Quick Start

### Prerequisites
- Node.js 18+

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
```

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev       # http://localhost:5000
```

## Project Structure

```
solarnexa_webapp/
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared UI (Navbar, …)
│   │   ├── pages/        # Dashboard, Installations, …
│   │   └── App.jsx
│   └── vite.config.js    # Dev proxy → backend :5000
└── backend/
    ├── server.js          # Express entry point
    └── .env.example
```

## API Endpoints

| Method | Path                | Description          |
|--------|---------------------|----------------------|
| GET    | /api/health         | Service health check |
| GET    | /api/installations  | List installations   |

## License

MIT
