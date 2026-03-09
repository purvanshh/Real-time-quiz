# Real-Time Quiz Website

A live, interactive quiz application where a host can launch questions to participants in real time. Built with Next.js, Socket.io, and a modern, themeable UI.

## Features

- **Live sessions** — Questions appear instantly for all participants via WebSocket
- **Admin/Host panel** — Launch questions, manage competitions, view live stats
- **Two question types**
  - **Text answer** — Participants type their response
  - **Multiple choice** — Participants choose from up to 4 options (A–D)
- **New competition** — Reset all scores to zero when starting a fresh round
- **Leaderboard** — Live ranking that updates as participants answer correctly
- **Theme support** — Light and dark mode with Geist font
- **Toast notifications** — Clean feedback for correct/incorrect answers and events

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
- **Real-time:** Socket.io (client + server)
- **Database:** SQLite with Prisma ORM

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy the example env file and configure as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `NEXT_PUBLIC_APP_URL` | App URL for Socket.io client | `http://localhost:3000` |
| `ADMIN_SECRET` | Admin panel password | `admin123` |
| `PORT` | Server port | `3000` |

### 3. Initialize the database

```bash
npx prisma db push
```

### 4. Run the app

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### As a participant (quiz taker)

1. Go to the home page
2. Enter your name to join
3. Wait for the host to launch a question
4. Answer by typing (text questions) or clicking an option (multiple choice)
5. Check the leaderboard to see your rank

### As a host/admin

1. Go to [/admin](http://localhost:3000/admin)
2. Enter the admin password (default: `admin123`)
3. **Launch a question:**
   - Choose **Text answer** or **Multiple choice**
   - Enter the question and correct answer
   - For multiple choice, fill in options and mark the correct one
   - Click **Launch to All Participants**
4. **Start a new competition** when beginning a new round — this resets all scores to zero

## Project Structure

```
real-time-quiz-website/
├── server.ts              # Custom server: Next.js + Socket.io
├── prisma/
│   ├── schema.prisma      # Database schema (User model)
│   └── dev.db             # SQLite database (created on first run)
├── src/
│   ├── app/
│   │   ├── admin/         # Admin/host panel
│   │   ├── api/user/      # User creation & leaderboard API
│   │   ├── page.tsx       # Main quiz page
│   │   └── globals.css    # Theme variables
│   ├── components/
│   │   ├── Question.tsx   # Quiz UI (participant)
│   │   ├── Ranking.tsx    # Leaderboard
│   │   ├── Toast.tsx      # Notifications
│   │   └── ThemeToggle.tsx
│   └── config/socket.ts   # Socket.io client setup
├── .env.example
└── package.json
```

## API & Socket Events

### Socket.io events (client → server)

| Event | Payload | Description |
|-------|---------|-------------|
| `get-problem` | — | Request current question |
| `submit-answer` | `{ answer, userId }` | Submit an answer |
| `launch-question` | `{ question, answer, adminSecret, type?, options? }` | Admin: launch question |
| `start-new-competition` | `{ adminSecret }` | Admin: reset all scores |
| `get-stats` | `{ adminSecret }` | Admin: get live session stats |

### Socket.io events (server → client)

| Event | Payload | Description |
|-------|---------|-------------|
| `new-problem` | `{ question, answer, type?, options? }` | New question available |
| `winner` | `{ userId }` | Someone answered correctly |
| `wrong-answer` | — | Incorrect answer submitted |
| `scores-reset` | — | New competition started |
| `launch-success` | `{ message }` | Admin: launch confirmed |
| `launch-error` | `{ message }` | Admin: launch failed |

## License

MIT
