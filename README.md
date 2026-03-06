# Newbie — The Social Calculator

A modern calculator app with a social twist — share your calculations with the world!

## Features

- 🧮 **Full Calculator** — Basic arithmetic, percentages, backspace, and more
- 📋 **Calculation History** — Every calculation is saved to a local SQLite database
- 🌐 **Community Feed** — Share calculations publicly and see what others are computing
- 📱 **Responsive UI** — Mobile-friendly with a modern, card-based layout

## Tech Stack

- **Next.js 14** with App Router + TypeScript
- **TypeORM** with **better-sqlite3** for database
- **Tailwind CSS** for styling

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
docker-compose up --build
```

## Environment Variables

Create a `.env` file:

```
DATABASE_PATH=./data/newbie.sqlite
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── entities/         # TypeORM database entities
├── lib/              # Database initialization
└── types/            # TypeScript types
```
