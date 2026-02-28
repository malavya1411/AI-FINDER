# Agent Finder — Security Documentation

## Implemented (Client-Side)

### Input Validation & Sanitization (`src/lib/sanitize.ts`)
- **Query sanitization**: HTML stripped, max 500 chars, whitespace normalized
- **Email/password validation**: RFC-compliant patterns, length limits
- **URL validation**: Protocol check (http/https only), max 2048 chars
- **Rating validation**: Strict integer 1-5
- **Review validation**: Max 300 chars, HTML stripped
- **Refinement answers**: Whitelist-only validation against allowed options
- **Agent submission**: Schema validation (name, description, URL, pricing enum)
- **localStorage safety**: `safeParseArray` with type guards, capped at 100 items

### Client-Side Rate Limiting (`src/lib/rateLimiter.ts`)
Sliding-window algorithm using localStorage timestamps:
| Action | Limit | Window |
|--------|-------|--------|
| Search | 10 | 1 min |
| Refine | 15 | 1 min |
| Submission | 5 | 1 hour |
| Review | 3 | 1 min |
| Sandbox | 5 | 1 min |
| Daily AI | 100 | 24 hours |

### Security Headers (`index.html`)
- `Content-Security-Policy`: self + Google Fonts + inline styles
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Recommended for Production (When Backend Added)

### Server-Side Rate Limiting
- Use `express-rate-limit` or equivalent with Redis store
- IP-based + user-based limits
- Return proper 429 responses with `Retry-After` header

### API Key Handling
- Store all API keys in `.env` (add to `.gitignore`)
- Access via `process.env.KEY_NAME` only
- Proxy all AI API calls through your own backend
- Never expose keys client-side
- Add `.env.example` listing required keys (without values)

### Session Security
- Use httpOnly cookies for auth tokens (not localStorage)
- Enable CSRF protection
- Set `Secure` and `SameSite=Strict` flags

### CORS
- Allow requests only from your frontend domain
- Block all other origins

### Database (if using Supabase/Firebase)
- Enable Row Level Security (RLS) on all tables
- Users can only read/write their own data
- Validate all writes server-side
