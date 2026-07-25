# RecoverAI

AI-powered recovery and relapse-prevention companion for people navigating Substance Use Disorders (SUD), with caregiver visibility and emergency escalation support.

## What this app does

- Voice-first and text-based AI chat for recovery support
- Personalized memory retrieval/storage for context-aware responses
- AI relapse risk assessment (`low`, `medium`, `high`, `emergency`)
- Emergency intervention script generation and one-tap crisis flow
- Journal + mood tracking (`great`, `good`, `okay`, `struggling`, `crisis`)
- Caregiver dashboard with risk timeline and AI-generated recovery report
- Emergency contacts management
- Optional text-to-speech playback for assistant responses

## Tech stack

### Frontend
- React + Vite
- React Router
- Axios
- Web Speech API (voice input)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- OpenAI API
- Mem0 (`mem0ai`) for user memory
- MongoDB Atlas Vector Search for educational retrieval

## Repository structure

```text
backend/
frontend/vite-project/
IMPLEMENTATION_PLAN.md
PRODUCT_REQUIREMENT_DOCUMENT.md
```

## GenAI usage in this project

- `gpt-4o-mini`
	- Conversational recovery assistant
	- Risk classification tool
	- Emergency intervention script tool
	- Journal-based recovery tip generation
	- Caregiver recovery report generation
- `text-embedding-3-small`
	- Educational content retrieval (RAG-style search)
	- Mem0 embedding backend
- `tts-1` (`alloy` voice)
	- Text-to-speech for assistant replies

## Local setup

## 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env` (example):

```env
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

Optional: seed educational vector data:

```bash
npm run seed
```

## 2) Frontend

```bash
cd frontend/vite-project
npm install
```

Create `frontend/vite-project/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Chat
- `POST /api/chat`
- `GET /api/chat/sessions`
- `GET /api/chat/sessions/:sessionId`

### Journal
- `GET /api/journal`
- `POST /api/journal`
- `GET /api/journal/tip`

### Caregiver
- `GET /api/caregiver/summary`
- `POST /api/caregiver/report`

### Emergency contacts
- `GET /api/emergency-contacts`
- `POST /api/emergency-contacts`
- `PUT /api/emergency-contacts/:contactId`
- `DELETE /api/emergency-contacts/:contactId`

### Health
- `GET /health`

## Security notes

- JWT-based auth for protected routes
- Request rate limiting applied to `/api/*`
- Input validation for login/register

## Deployment notes (Vercel)

This repo is easiest to deploy as two projects:

1. Frontend Vercel project
- Root: `frontend/vite-project`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://<your-backend-domain>`

2. Backend deployment
- Current backend entry uses `app.listen(...)` and is suited for a traditional Node server.
- For Vercel serverless deployment, split app creation/export from the listener and route requests through a Vercel serverless function.
- Alternatively deploy backend to Render/Railway/Fly and point `VITE_API_URL` to that URL.

## Product docs

- `PRODUCT_REQUIREMENT_DOCUMENT.md`
- `IMPLEMENTATION_PLAN.md`

## Disclaimer

RecoverAI is a support tool and not a replacement for licensed medical or mental health care. In crisis situations, contact emergency services or call/text `988` in the U.S.
