# Job Referral Platform

A full-stack MERN application connecting job seekers with employees willing to provide referrals at their companies.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React SPA  │────▶│  Express API │────▶│   MongoDB    │
│  (Vite + TW) │     │  + Socket.io │     │  (Mongoose)  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    │     Redis     │
                    │   (Caching)   │
                    └───────────────┘
```

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Frontend    | React 18, Redux Toolkit, TailwindCSS, Vite    |
| Backend     | Node.js, Express.js, Socket.io                |
| Database    | MongoDB with Mongoose ODM                     |
| Auth        | JWT (access + refresh tokens), bcrypt          |
| File Upload | Cloudinary + Multer                           |
| Real-time   | Socket.io (chat, notifications)               |
| Caching     | Redis (optional)                              |
| Deployment  | Docker, Docker Compose, Nginx                 |

## User Roles

- **Job Seeker** — Browse jobs, request referrals, track progress
- **Referrer** — Post jobs, receive & manage referral requests
- **Admin** — Platform oversight, user/company management, analytics

## Features

- JWT auth with refresh token rotation & reuse detection
- Role-based access control
- Job listing with full-text search & advanced filters
- Referral workflow with 9-stage state machine
- Real-time messaging with typing indicators
- Live notifications via Socket.io
- File uploads (resume & avatar) to Cloudinary
- Admin dashboard with analytics
- Responsive UI with TailwindCSS

## Project Structure

```
job_referral/
├── server/
│   └── src/
│       ├── config/         # DB, Cloudinary, Redis
│       ├── controllers/    # Route handlers (8 controllers)
│       ├── middleware/      # Auth, error handler, upload, validators
│       ├── models/          # Mongoose schemas (7 models)
│       ├── routes/          # Express routers (8 route files)
│       ├── services/        # Email, cache
│       ├── socket/          # Socket.io handler
│       └── server.js        # Entry point
├── client/
│   └── src/
│       ├── components/      # Reusable UI (layout, common)
│       ├── pages/           # Route pages
│       ├── services/        # API client, socket client
│       └── store/           # Redux Toolkit store & slices
├── docker-compose.yml
└── package.json             # Monorepo scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- Redis (optional, for caching)

### 1. Clone & Install

```bash
git clone <repo-url> job_referral
cd job_referral
npm run install:all
```

### 2. Configure Environment

Copy the example env and fill in your values:

```bash
cp server/.env.example server/.env
```

Required variables:
```env
MONGODB_URI=mongodb://localhost:27017/job_referral
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 3. Run Development

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

### 4. Run with Docker

```bash
docker-compose up --build
```

The app will be available at `http://localhost`.

## API Endpoints

### Auth
| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | /api/auth/register    | Register user     |
| POST   | /api/auth/login       | Login             |
| POST   | /api/auth/refresh     | Refresh token     |
| POST   | /api/auth/logout      | Logout            |
| GET    | /api/auth/me          | Get current user  |

### Jobs
| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | /api/jobs             | List jobs (with filters) |
| GET    | /api/jobs/:id         | Get job details          |
| POST   | /api/jobs             | Create job (referrer)    |
| PUT    | /api/jobs/:id         | Update job               |
| DELETE | /api/jobs/:id         | Delete job               |

### Referrals
| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | /api/referrals               | Request referral       |
| GET    | /api/referrals               | List my referrals      |
| GET    | /api/referrals/:id           | Get referral details   |
| PATCH  | /api/referrals/:id/status    | Update status          |
| POST   | /api/referrals/:id/feedback  | Add feedback           |

### Messages
| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| POST   | /api/messages/conversations     | Create conversation  |
| GET    | /api/messages/conversations     | List conversations   |
| GET    | /api/messages/:conversationId   | Get messages         |
| POST   | /api/messages/:conversationId   | Send message         |

### Users, Companies, Notifications, Admin
See route files for full endpoint documentation.

## Referral Workflow

```
pending → viewed → accepted → submitted → interviewing → hired
                 ↘ rejected                            ↘ rejected
        ↘ withdrawn                                    ↘ withdrawn
        ↘ expired
```

## License

MIT
