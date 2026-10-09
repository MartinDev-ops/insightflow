# InsightFlow

## Why InsightFlow Was Built

InsightFlow was built after observing the challenges faced at my old after-school extra class, where learner enrollment and payment records were managed manually using notebooks.

The person responsible for managing the program had to manually record learner details, grades, and payment information. With learners from Grade 8 to Grade 12, each having separate records, managing enrollments, tracking outstanding payments, calculating financial information, and understanding overall program performance became increasingly difficult as the number of learners grew.

This experience inspired the development of InsightFlow an AI-powered data workspace designed to help users organize, clean, analyze, manipulate, visualize, and gain insights from their data without relying on complex formulas, SQL queries, or manual reporting processes.

Although inspired by an education management challenge, InsightFlow is designed as a flexible solution that can be applied to different types of structured data, helping users explore information, identify patterns, and make better data-driven decisions across various domains.

---

# What is InsightFlow?

InsightFlow is an AI-powered data workspace that allows users to interact with structured data using natural language instead of traditional methods such as formulas, filters, SQL queries, or pivot tables.

The platform enables users to create, upload, manage, clean, analyze, visualize, and transform data while using artificial intelligence to understand requests, perform operations, and generate meaningful insights.

---

# Key Features

- AI-powered natural language data interaction
- Automated data cleaning and transformation
- Data analysis and manipulation
- Intelligent data exploration
- Dynamic charts and visualizations
- Spreadsheet-like data workspace
- Structured AI command processing
- Secure backend-controlled AI execution
- Cloud-based data storage and management

---

# How InsightFlow Works

InsightFlow uses an AI-driven architecture where user requests are converted into structured commands that are validated and processed by the backend before interacting with data.

The workflow consists of:

User Request → AI Understanding → Structured JSON Command → Backend Validation → Data Processing → Result Generation

This approach ensures accurate, secure, and controlled AI-powered data operations.

---

# Technology Stack

## Frontend
- React.js
- JavaScript
- HTML5
- CSS3

## Backend
- Node.js
- Express.js

## Database & Backend Services
- Supabase
- PostgreSQL

## Artificial Intelligence
- Google Gemini API

## Data Processing
- XLSX processing
- Custom AI data processing engine

## Tools
- Git
- GitHub
- VS Code

---

# Project Architecture

InsightFlow follows a modular architecture consisting of:

- React frontend interface
- Node.js backend API layer
- Supabase database and backend services
- AI interpretation engine
- Data processing engine

The AI engine contains components responsible for understanding user intent, interpreting data structures, translating requests into commands, validating operations, and executing data tasks.

---

# Future Improvements

Future development plans include:

- User accounts and shared/team workspaces (visitor-scoped identity is implemented; see Security)
- Cloud deployment (Docker and CI configuration are included; see Deployment)
- Advanced AI recommendations
- Real-time collaboration
- Automated reporting
- Additional data visualization capabilities
- Business intelligence integrations

---

# Security

## Identity model

Projects are keyed by `owner_id` in Postgres. Rather than traditional user
accounts, each browser obtains a **server-issued visitor token** and presents it
as the `X-Visitor-Token` header on every request:

1. `POST /auth/visitor` → `{ visitorId, token }` where token is `<uuid>.<hmac-sha256>`
2. The client stores the token and sends it on every subsequent request.
3. `requireVisitor` verifies the HMAC before the request reaches any controller.

Tokens are generated **server-side** and signed, so a client cannot choose its
own identity or reuse another visitor's signature. All queries filter on the
verified owner id.

> The earlier `X-Visitor-Id` header was self-asserted and unsigned, which allowed
> one visitor to read or overwrite another's projects. It is no longer accepted.

## Controls in place

| Area | Control |
|---|---|
| Identity | HMAC-signed visitor tokens, constant-time signature comparison |
| Authorization | `owner_id` filtering on every project/workbook query |
| AI spend | Strictest rate limiter (20/min) on `/ai` — each call costs Gemini tokens |
| Uploads | Size cap (25MB default), file count cap, extension allowlist (`.xlsx/.xls/.xlsm/.csv`) |
| Data at rest | Temp upload files deleted in a `finally` block after parsing |
| Debug surface | `GET /data` requires auth, returns only the caller's data, 404s in production |
| Headers | `helmet` (HSTS, nosniff, frame-options) |
| CORS | Explicit origin allowlist; required in production |
| Database TLS | Certificate verification enabled in production |
| Multi-tenancy | In-memory dataset keyed per visitor, bounded to 20 entries |
| Shutdown | Graceful SIGTERM handling drains the HTTP server and DB pool |

## Uploads may contain personal data

Excel uploads can contain learner, grade, or payment records. `server/uploads/`
is gitignored, and multer deletes temp files immediately after parsing. Do not
commit real spreadsheets.

---

# Deployment

## Required environment variables

See `server/.env.example` for the annotated list.

| Variable | Scope | Notes |
|---|---|---|
| `DATABASE_URL` | server | Postgres connection string. Use `?sslmode=require` in production |
| `GEMINI_API_KEY` | server | Google Gemini API key |
| `VISITOR_SECRET` | server | Token signing secret, ≥32 chars. **Rotating it invalidates all sessions** |
| `NODE_ENV` | server | `production` enables strict behavior |
| `CORS_ORIGINS` | server | Comma-separated allowed origins; **required** in production |
| `UPLOAD_MAX_BYTES` | server | Upload cap in bytes (default 26214400) |
| `PORT` | server | Defaults to 5001 |
| `REACT_APP_API_URL` | client | Backend URL, **baked in at build time** |

Generate a signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Docker

```bash
# Build (REACT_APP_* is inlined into the bundle, so it is a build arg)
docker build --build-arg REACT_APP_API_URL=https://api.example.com -t insightflow .

# Run
docker run -p 5001:5001 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://...?sslmode=require" \
  -e GEMINI_API_KEY="..." \
  -e VISITOR_SECRET="..." \
  -e CORS_ORIGINS="https://app.example.com" \
  insightflow
```

The image is multi-stage (React build → server runtime), runs as the non-root
`node` user, and ships a `/health` healthcheck.

## Manual deployment

```bash
# Server
cd server
npm ci --omit=dev
NODE_ENV=production node app.js

# Client (serve `build/` from any static host)
cd client
REACT_APP_API_URL=https://api.example.com npm run build
```

## CI

`.github/workflows/ci.yml` runs on every push and pull request:

- syntax-checks all server modules
- **fails if a real `.env` file is ever tracked again**
- asserts `.env.example` documents every required variable
- builds the client with warnings treated as errors

---

# License

This project is currently under development.
