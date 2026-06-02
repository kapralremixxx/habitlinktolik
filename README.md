---
name: habitlink-readme
description: Project overview and setup instructions for HabitLink mobile app
metadata:
  type: project
---

# HabitLink

**HabitLink** – a cross‑platform habit‑tracking mobile app built with React Native + Expo (TypeScript) and a powerful backend powered by Node.js, Express, Prisma and PostgreSQL. It includes an admin dashboard built with Next.js, supports Google/Apple login, push notifications, AI‑driven habit coaching (via OpenAI), premium subscriptions, and a comprehensive CI/CD pipeline.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Development](#setup--development)
- [Docker & Production Deployment](#docker--production-deployment)
- [Building Mobile Binaries (APK / IPA)](#building-mobile-binaries-apk--ipa)
- [Running Tests](#running-tests)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [License](#license)

## Features

1. **Authentication** – Email/Password, Google, Apple, password reset, email verification, JWT + refresh tokens.
2. **User Profile** – Avatar, name, country, language, notification settings.
3. **Habit System** – Create / edit / delete habits (daily, weekly, monthly), categories, icons & colors.
4. **Streak System** – Current & best streaks, automatic counting, one‑off skip protection.
5. **Calendar Heatmap** – GitHub‑style contributions view (daily, monthly, yearly).
6. **Social** – Friends, friend requests, search, friend habit feed, likes, comments.
7. **Challenges** – Personal & group challenges, leaderboards, rewards.
8. **AI Habit Coach** – Powered by OpenAI API (progress analysis, weak‑spot detection, personalized recommendations, motivational messages, habit plans, risk prediction).
9. **Analytics** – Completion rate, streak growth, weekly/monthly progress, habit score, charts.
10. **Push Notifications** – Habit reminders, AI motivation, streak completions, challenge updates.
11. **Premium Subscription** – Free tier (≤ 3 habits, basic stats) and premium (€4.99 / month) with unlimited habits, AI Coach, advanced analytics, unlimited challenges, enhanced notifications.
12. **Admin Panel** – User management, subscription overview, MRR, DAU/MAU, reports, challenge management, push campaigns.
13. **Security** – Bcrypt password hashing, JWT refresh tokens, CSRF protection, input validation, rate limiting, logging, Swagger docs.

## Tech Stack

| Layer | Tech |
|---|---|
| **Mobile App** | React Native + Expo (TypeScript) |
| **State / Networking** | react‑query, axios, expo‑auth‑session |
| **UI** | react‑native‑paper |
| **Backend API** | Node.js (v20) + Express |
| **ORM / DB** | Prisma → PostgreSQL |
| **Auth** | JWT (access + refresh), Google Sign‑In, Apple Sign‑In |
| **Push** | Firebase Cloud Messaging |
| **Payments** | Google Play Billing, Apple In‑App Purchases, Stripe Subscriptions |
| **AI Coach** | OpenAI API (ChatGPT‑4o) |
| **Admin Dashboard** | Next.js (TypeScript) |
| **Containerisation** | Docker (multi‑stage builds) |
| **CI/CD** | GitHub Actions, Docker Hub registry |

## Project Structure

```
habitlink/
├─ backend/                # Express API
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ index.ts
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ tests/
│  ├─ Dockerfile
│  ├─ tsconfig.json
│  └─ package.json
├─ frontend/               # Expo React Native app
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ navigation/
│  │  ├─ screens/
│  │  ├─ services/
│  │  └─ types/
│  ├─ App.tsx
│  ├─ app.json
│  ├─ tsconfig.json
│  ├─ babel.config.js
│  └─ package.json
├─ admin/                  # Next.js admin panel
│  ├─ pages/
│  │  ├─ api/
│  │  └─ index.tsx
│  ├─ components/
│  ├─ lib/
│  ├─ styles/
│  ├─ Dockerfile
│  ├─ tsconfig.json
│  └─ package.json
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

## Setup & Development

### Prerequisites

- **Node.js** ≥ 20 (use nvm or asdf)
- **Yarn** (recommended) or npm
- **Docker** & **Docker‑Compose**
- **Expo CLI** (`npm i -g expo-cli`)
- **PostgreSQL** locally or via Docker (see below)
- **Google / Apple credentials** for OAuth (set env vars, see `.env.example`)
- **OpenAI API key** for AI Coach

### 1. Clone the repo & install dependencies

```bash
git clone <repo‑url> habitlink
cd habitlink
# Install all workspaces (backend, frontend, admin)
yarn install   # or npm install
```

### 2. Setup environment variables

Copy `.env.example` to `.env` in the root and fill in the required secrets:

```bash
cp .env.example .env
# Edit .env with your keys (POSTGRES_PASSWORD, JWT_SECRET, GOOGLE_CLIENT_ID, …)
```

### 3. Run PostgreSQL (Docker)

```bash
docker-compose up -d db
# Apply Prisma migrations
cd backend
npx prisma migrate dev --name init
```

### 4. Start services in development mode

#### Backend (API)

```bash
cd backend
npm run dev   # or yarn dev – runs nodemon on src/index.ts
```

#### Frontend (Expo)

```bash
cd ../frontend
expo start    # opens Metro bundler – scan QR code with Expo Go
```

#### Admin Panel

```bash
cd ../admin
npm run dev   # starts Next.js on http://localhost:3000
```

### 5. Test the flow

- Open the Expo app on your phone/emulator, register a new account, create a habit, and verify it appears in the calendar heatmap.
- Access the admin dashboard at `http://localhost:3000/admin` (login with a temporary admin user created via the backend seed script).

## Docker & Production Deployment

The repository ships with a multi‑service Docker Compose file that builds and runs the API, admin panel, and a PostgreSQL instance. The mobile app is built separately using **EAS Build** (see section below).

```bash
# Build and start all services
docker-compose up --build -d
```

- API is exposed on **http://localhost:4000/api**
- Admin panel on **http://localhost:3001**
- Database on standard PostgreSQL port 5432 (internal network only)

When deploying to a cloud provider, replace the `docker-compose.yml` with your orchestrator’s manifests (Kubernetes, ECS, etc.) and configure environment variables via a secret manager.

## Building Mobile Binaries (APK / IPA)

### Prerequisites

- **EAS CLI** (`npm i -g eas-cli`)
- Apple Developer account (for IPA) and Google Play Console access (for APK/Billing).

### 1. Configure EAS

```bash
cd ../frontend
eas login                 # log in with your Expo account
eas init                  # creates eas.json if missing
```

Edit `eas.json` to include the appropriate build profiles (`production`, `preview`).

### 2. Build APK (Android)

```bash
eas build -p android --profile production
# After the build finishes, download the .apk from the Expo dashboard.
```

### 3. Build IPA (iOS)

```bash
eas build -p ios --profile production
# Follow the Expo instructions to upload the build to App Store Connect.
```

The generated binaries can be uploaded to the Google Play Store and Apple App Store respectively.

## Running Tests

- **Unit & Integration** – Jest (backend) & React Native Testing Library (frontend).
- **E2E** – Detox for mobile, Cypress for admin panel.

```bash
# Backend tests
cd backend && npm test
# Frontend tests
cd ../frontend && npm test
# Admin panel tests
cd ../admin && npm test
```

## CI/CD (GitHub Actions)

The repository includes a `.github/workflows/ci.yml` workflow that:

1. Installs dependencies (yarn install).
2. Lints and runs unit tests for all workspaces.
3. Builds Docker images for backend & admin.
4. Publishes Docker images to Docker Hub (requires `DOCKER_USERNAME`/`DOCKER_PASSWORD` secrets).
5. Triggers an EAS build for the mobile app on push to `main` or tags.

You can customize the workflow in `.github/workflows/ci.yml`.

## License

MIT – see [LICENSE](LICENSE).

---

*Generated by Claude Code – production‑ready project scaffold.*
