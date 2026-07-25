# RecoverAI — Implementation Plan

## Decisions
| Decision | Choice |
|---|---|
| Timeline | 3–4 hours |
| Voice Input | Web Speech API (SpeechRecognition) |
| Voice Output | OpenAI TTS (`tts-1`, voice: `alloy`) |
| AI Agent | Node.js `openai` package with tool-calling loop |
| Memory | Mem0 TS SDK with MongoDB Atlas as vector backend |
| RAG | 15–20 hardcoded educational chunks seeded into Atlas Vector Search |
| Caregiver | Read-only tab on same user account (no separate login) |
| UI | Plain CSS (no Tailwind setup overhead) |
| Deploy | Vercel (frontend) + Render (backend) |
| **Skipped** | Mood graphs, recovery streaks analytics dashboard |

---

## Phase 1 — Backend Foundation (30 min)

### 1.1 Install Dependencies
```bash
cd backend
npm install mongoose jsonwebtoken bcryptjs cors openai mem0ai express-validator express-rate-limit
```

### 1.2 Folder Structure
```
backend/
  src/
    agents/
      recovery.agent.js
    tools/
      memory.tool.js
      education.tool.js
      risk.tool.js
      emergency.tool.js
    controllers/
      auth.controller.js
      chat.controller.js
      journal.controller.js
      caregiver.controller.js
    routes/
      auth.routes.js
      chat.routes.js
      journal.routes.js
      caregiver.routes.js
    middleware/
      auth.middleware.js
    models/
      User.js
      Journal.js
      Session.js
    services/
      openai.service.js
      mem0.service.js
    prompts/
      recovery.system.js
    utils/
      seed.js
  index.js
  .env
```

### 1.3 Environment Variables (`backend/.env`)
```
MONGODB_URI=
OPENAI_API_KEY=
JWT_SECRET=
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 1.4 Models

**User** — `{ name, email, password (bcrypt hashed), createdAt }`

**Journal** — `{ userId, content, mood ('great'|'good'|'okay'|'struggling'|'crisis'), createdAt }`

**Session** — `{ userId, messages [{ role, content, riskLevel, timestamp }], riskHistory [{ level, timestamp }], createdAt }`

### 1.5 Auth Routes
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | bcrypt hash password, sign JWT (7d), return `{ token, user }` |
| POST | `/api/auth/login` | bcrypt compare, sign JWT, return `{ token, user }` |
| GET | `/health` | Returns `200 OK` for Render health checks |

### 1.6 Auth Middleware (`auth.middleware.js`)
- Verify `Authorization: Bearer <token>` header
- Decode JWT, attach `req.user = { id, email }`
- Return 401 on missing/invalid token

---

## Phase 2 — AI Agent + Tools (60 min)

### 2.1 Mem0 Service (`mem0.service.js`)
Configure `Memory` from `mem0ai` with MongoDB Atlas as the vector backend:
```js
const memory = new Memory({
  vector_store: {
    provider: 'mongodb_atlas',
    config: {
      connection_string: process.env.MONGODB_URI,
      db_name: 'recoverai',
      collection_name: 'memories',
      embedding_model_dims: 1536,
      index_name: 'memory_vector_index'
    }
  },
  llm: {
    provider: 'openai',
    config: { api_key: process.env.OPENAI_API_KEY, model: 'gpt-4o-mini' }
  }
});
```
Exports: `addMemory(userId, text)`, `searchMemory(userId, query)`

### 2.2 System Prompt (`recovery.system.js`)
Compassionate recovery companion persona. Always: retrieve user memories before responding, assess risk level in every response, ground answers in educational content, escalate on high/emergency risk.

### 2.3 Tool Definitions
Each tool file exports a `toolDefinition` (OpenAI function schema) and an `execute(args, userId)` function:

| Tool File | OpenAI Function Name | Purpose |
|---|---|---|
| `memory.tool.js` | `memory_search` / `memory_add` | Search or store Mem0 user memories |
| `education.tool.js` | `educational_search` | Embed query → `$vectorSearch` on `education_resources` → top 3 chunks |
| `risk.tool.js` | `assess_risk` | GPT call → `{ level: 'low'|'medium'|'high'|'emergency', reasoning }` |
| `emergency.tool.js` | `generate_emergency_script` | GPT call → 3–5 personalized intervention steps |

### 2.4 Recovery Agent (`recovery.agent.js`)
Agentic tool-calling loop:
1. Call `openai.chat.completions.create` with all tool definitions + conversation history
2. On `tool_calls` in response: dispatch to matching tool's `execute()`, append `tool` role message
3. Loop until response has no `tool_calls`
4. Extract final assistant message + last assessed risk level
5. Return `{ response: string, riskLevel: string, emergencyScript: string|null }`

### 2.5 OpenAI Service (`openai.service.js`)
`tts(text)` function:
- Calls `openai.audio.speech.create({ model: 'tts-1', voice: 'alloy', input: text })`
- Returns audio as base64 string

### 2.6 Seed Script (`utils/seed.js`)
- Define 15–20 text chunks summarizing WHO/SAMHSA/NIDA recovery guidelines
- For each chunk: call `openai.embeddings.create({ model: 'text-embedding-3-small', input: chunk.content })`
- Upsert into `education_resources`: `{ title, content, source, embedding }`
- Run once after first deploy: `node src/utils/seed.js`

---

## Phase 3 — Backend API Routes (20 min)

| Method | Route | Auth | Body / Response |
|---|---|---|---|
| POST | `/api/chat` | ✅ | `{ message, sessionId? }` → `{ reply, riskLevel, emergencyScript, audioBase64 }` |
| GET | `/api/journal` | ✅ | Returns last 20 journal entries |
| POST | `/api/journal` | ✅ | `{ content, mood }` → created journal entry |
| GET | `/api/caregiver/summary` | ✅ | `{ recentSessions, riskHistory, journalCount }` |

**Chat controller logic:**
1. Fetch or create `Session` document for user
2. Append user message to `session.messages`
3. Call `recoveryAgent.run(messages, userId)`
4. Append assistant reply + riskLevel to session
5. If riskLevel is `high`/`emergency`, append to `session.riskHistory`
6. Call `tts(reply)` → base64 audio
7. Return full response

---

## Phase 4 — Frontend (60 min)

### 4.1 Setup
```bash
cd frontend/vite-project
npm install react-router-dom axios
```

### 4.2 File Structure
```
src/
  services/
    api.js              — axios instance with baseURL + JWT interceptor
  context/
    AuthContext.jsx     — token in localStorage, login/logout, user state
  components/
    Navbar.jsx          — Chat | Journal | Caregiver | Logout
    ChatMessage.jsx     — message bubble + RiskBadge
    RiskBadge.jsx       — colored pill per risk level
    EmergencyModal.jsx  — full-screen overlay with emergency script
    VoiceButton.jsx     — SpeechRecognition toggle, fires transcript
    AudioPlayer.jsx     — auto-plays base64 TTS audio
  pages/
    LoginPage.jsx
    RegisterPage.jsx
    ChatPage.jsx
    JournalPage.jsx
    CaregiverPage.jsx
  App.jsx               — Router + AuthContext provider
```

### 4.3 Routing (`App.jsx`)
- `/login`, `/register` — public
- `/chat`, `/journal`, `/caregiver` — wrapped in `ProtectedRoute` (redirect to `/login` if no token)
- `/` — redirect to `/chat` if authed, else `/login`

### 4.4 ChatPage Logic
1. `VoiceButton`: toggle `SpeechRecognition`, `onresult` sets transcript → auto-submit
2. Text input fallback for manual typing
3. `POST /api/chat` with `{ message }`
4. Append `ChatMessage` with `RiskBadge` to message list
5. If `audioBase64` in response → `AudioPlayer` plays it
6. If `riskLevel === 'high' || 'emergency'` → show `EmergencyModal` with `emergencyScript`

### 4.5 VoiceButton Pattern
```js
const recognition = new window.SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.onresult = (e) => onTranscript(e.results[0][0].transcript);
```

### 4.6 RiskBadge Colors
| Level | Color |
|---|---|
| low | green |
| medium | yellow |
| high | orange |
| emergency | red |

### 4.7 JournalPage
- Mood selector (5 options: great / good / okay / struggling / crisis)
- Textarea for journal content
- Submit → `POST /api/journal`
- List: `GET /api/journal` → render entries newest-first

### 4.8 CaregiverPage
- `GET /api/caregiver/summary`
- Display: last 5 sessions with timestamps, risk history timeline, journal entry count

---

## Phase 5 — Security & Polish (20 min)

1. **Rate limiting**: `express-rate-limit` — 100 requests / 15 min on all `/api/` routes
2. **Input validation**: `express-validator` on register (email format, password ≥ 8 chars) and login
3. **Error states**: mic permission denied message, network error toast, loading spinner on chat submit
4. **Empty states**: no messages yet, no journal entries yet

---

## Phase 6 — Deployment (30 min)

### MongoDB Atlas Setup
1. Whitelist `0.0.0.0/0` (for Render's dynamic IPs)
2. Create Vector Search index `education_vector_index` on `education_resources.embedding`:
   - Dimensions: 1536, similarity: cosine
3. Create Vector Search index `memory_vector_index` on `memories.embedding`:
   - Dimensions: 1536, similarity: cosine
   - (Mem0 SDK may auto-create this — verify after first run)

### Backend → Render
- Build command: `npm install`
- Start command: `node index.js`
- Set all `.env` variables in Render dashboard
- After first deploy: run `node src/utils/seed.js` via Render shell

### Frontend → Vercel
- Root directory: `frontend/vite-project`
- Set env var: `VITE_API_URL=<render-backend-url>`
- Deploy via `vercel --prod` or GitHub integration

---

## Verification Checklist
- [ ] Register new user → JWT stored → land on `/chat`
- [ ] Type a message → AI responds with risk badge visible
- [ ] Speak via microphone → transcript captured → AI responds with audio played
- [ ] Send high-risk message → `EmergencyModal` appears with script
- [ ] Create journal entry → appears in list
- [ ] Visit `/caregiver` → session history shown
- [ ] Wrong password → 401 returned (not 500)
- [ ] Atlas `memories` collection has entries after conversation
- [ ] Atlas `education_resources` has 15+ seeded docs with embeddings
- [ ] Vercel + Render URLs respond correctly

---

## Critical File Creation Order
```
1.  backend/.env
2.  backend/index.js
3.  backend/src/models/User.js
4.  backend/src/models/Journal.js
5.  backend/src/models/Session.js
6.  backend/src/middleware/auth.middleware.js
7.  backend/src/controllers/auth.controller.js + routes/auth.routes.js
8.  backend/src/services/mem0.service.js
9.  backend/src/services/openai.service.js
10. backend/src/prompts/recovery.system.js
11. backend/src/tools/memory.tool.js
12. backend/src/tools/education.tool.js
13. backend/src/tools/risk.tool.js
14. backend/src/tools/emergency.tool.js
15. backend/src/agents/recovery.agent.js
16. backend/src/utils/seed.js
17. backend/src/controllers/chat.controller.js + routes/chat.routes.js
18. backend/src/controllers/journal.controller.js + routes/journal.routes.js
19. backend/src/controllers/caregiver.controller.js + routes/caregiver.routes.js
20. frontend/src/services/api.js
21. frontend/src/context/AuthContext.jsx
22. frontend/src/components/* (Navbar, RiskBadge, ChatMessage, EmergencyModal, VoiceButton, AudioPlayer)
23. frontend/src/pages/* (Login, Register, Chat, Journal, Caregiver)
24. frontend/src/App.jsx
```