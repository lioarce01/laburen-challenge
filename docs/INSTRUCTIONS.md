# Running the Project Locally

This document explains how to run each part of the project in your local environment. Make sure to clone the repository and install the necessary dependencies.

---

## 1. Frontend (Next.js)

### Commands:

```bash
npm install
npm run dev
```

### Configuration:

* Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

* Fill in the environment variable:

  * `AGENT_API_URL=http://localhost:8000`

### Public Chat URL:
```bash
https://lionel-arce-laburen-challenge.vercel.app/
```

---

## 2. Backend (API REST with NestJS)

### Commands:

```bash
npm install
npm run start:dev
```

### Configuration:

* Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

* Fill in the following variables:

  * `DATABASE_URL=postgresql://usuario:password@localhost:5432/db_name`
  * `PORT=3001`

### Load initial data:

```bash
npm run prisma:seed
```

(Check the `prisma/seed.ts` file to see which products are inserted (only 10% of the data))

### Public Nest APIRest URL:
```bash
https://laburen-challenge-1.onrender.com/api
```

---

## 3. AI Agent (Python + FastAPI)

### Command:

```bash
uvicorn main:app --reload
```

### Configuration:

* Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

* Fill in the required variables:

  * `GOOGLE_API_KEY=` (Gemini)
  * `OPENAI_API_KEY=` (optional, OpenAI)
  * `API_URL=http://localhost:3001` (URL of the backend REST API)

### Public AI Agent URL:
```bash
https://laburen-challenge.onrender.com/chat
```

---

Each module of the project includes a `.env.example` file as a template. Just duplicate it and fill in your values.
