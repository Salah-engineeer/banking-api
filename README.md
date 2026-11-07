# Banking API

A backend API for a simple banking system, built in raw Node.js (no framework)
to learn how servers work from the ground up, with security built in from
the start.

**Status:** in progress. Input validation and sanitization are done. Authentication and a real database are next.

## What it does now
- Look up accounts by username or filter them by country
- Create accounts through a POST route (validated and sanitized before saving)
- Serves a simple frontend page with custom 404 and 500 pages

## Security features
- Allowlist-based input validation (strict formats, a country allowlist, password rules)
- HTML sanitization of all string fields
- Only approved fields are saved, so extra fields a client sends are dropped
- Passwords never returned in responses

Security reasoning for every feature is in [SECURITY_NOTES.md](SECURITY_NOTES.md),
including the known gaps I haven't fixed yet.

## Tech
Node.js, sanitize-html

## Run it
npm install
node index.js
Server runs at http://localhost:8000

## Roadmap
JWT authentication, role-based access, rate limiting, PostgreSQL with parameterized queries, bcrypt password hashing, deployment