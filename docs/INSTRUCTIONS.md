# Iniciar el Proyecto en Local

Este documento explica cómo levantar cada parte del proyecto en tu entorno local. Asegúrate de clonar el repositorio y tener instaladas las dependencias necesarias.

---

## 1. Frontend (Next.js)

### Comandos:

```bash
npm install
npm run dev
```

### Configuración:

* Copiar el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

* Completar la variable de entorno:

  * `AGENT_API_URL=http://localhost:8000`

---

## 2. Backend (API REST con NestJS)

### Comandos:

```bash
npm install
npm run start:dev
```

### Configuración:

* Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

* Completar las siguientes variables:

  * `DATABASE_URL=postgresql://usuario:password@localhost:5432/db_name`
  * `PORT=3001`

### Cargar datos iniciales:

```bash
npm run prisma:seed
```

(Revisa el archivo `prisma/seed.ts` para ver qué productos se insertan)

---

## 3. Agente de IA (Python + FastAPI)

### Comando:

```bash
uvicorn main:app --reload
```

### Configuración:

* Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

* Completar las variables necesarias:

  * `GOOGLE_API_KEY=` (para Gemini)
  * `OPENAI_API_KEY=` (opcional, si usas OpenAI)
  * `API_URL=http://localhost:3001` (URL de la API REST del backend)

---

Cada módulo del proyecto contiene un archivo `.env.example` como plantilla. Solo debes duplicarlo y rellenar tus valores.
