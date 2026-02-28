# 🤖 Agent Finder

> **Find the perfect AI agent for your problem — instantly.**

Agent Finder is a smart AI agent discovery platform that takes your problem as input and recommends the best AI tools, generates a ready-to-use prompt tailored for your chosen agent, and suggests the right tech stack if you're building something. Built with a sleek dark UI, it cuts through the noise of hundreds of AI tools and points you to exactly what you need.

![Agent Finder Screenshot](public/preview.png)

---

## ✨ Features

- **Smart Agent Recommender** — Describe your problem in plain English, get ranked AI agent recommendations with confidence scores and reasoning
- **Post-Selection Prompt Refinement** — Pick an agent, then answer a few quick questions to get a fully personalized, copy-ready prompt for that specific agent
- **Tech Stack Suggester** — For app-building tasks, get a recommended tech stack alongside your agent picks
- **Agent Directory** — Browse 80+ AI agents across 10 categories with filters for pricing, access type, and use case
- **Agent Comparison** — Select 2–3 agents and compare them side by side on capabilities, pricing, and LLM support
- **Agent of the Week** — Featured trending agent on the homepage
- **Community & Use Cases** — Browse and share real-world agent workflows and success stories
- **Live Status Dashboard** — Real-time uptime and latency for popular agents
- **Query History** — All your past searches saved and accessible
- **Verified Badges & Ratings** — Community ratings and team-verified badges on agent listings
- **Dark Theme** — Deep navy aesthetic with glassmorphism cards throughout

---

## 🗂️ Agent Categories

| Category | Example Agents |
|---|---|
| Code Assistant | GitHub Copilot, Cursor, Replit AI, Devin |
| Image Generation | Midjourney, DALL·E 3, Leonardo AI, Ideogram |
| Writing & Content | Jasper, Notion AI, Sudowrite, Copy.ai |
| Data Analysis | Julius AI, Perplexity AI, Elicit, Consensus |
| Web Building | Lovable, Bolt.new, Framer AI, Webflow AI |
| Video & Audio | Runway ML, ElevenLabs, HeyGen, Suno |
| Automation | Zapier AI, n8n, Make, Bardeen |
| Chatbot | Intercom Fin, Voiceflow, Botpress |
| Research | Perplexity, Claude, Gemini, You.com |
| Design & UI/UX | Galileo AI, Uizard, Magician for Figma |

---

## 🛠️ Tech Stack

- **Frontend** — React 18 + TypeScript
- **Bundler** — Vite
- **Styling** — CSS / Tailwind
- **AI** — Gemini API (free tier)
- **Linting** — ESLint with TypeScript rules

## 📁 Project Structure

```
AI-FINDER/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level pages
│   ├── data/            # Agent database
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API helpers and utilities
│   └── main.tsx         # App entry point
├── .env                 # Environment variables (do not commit)
├── .gitignore
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🔒 Security

This project follows OWASP best practices:

- All API keys are stored in environment variables and never exposed client-side
- Rate limiting is applied on all AI-powered endpoints
- Input validation and sanitization on all user inputs
- HTTP security headers configured
- Row-level security enabled on the database

See [SECURITY.md](./SECURITY.md) for the full security policy and responsible disclosure process.

---

## 🗺️ Roadmap

- [ ] User authentication and saved preferences
- [ ] Agent submission portal for developers
- [ ] Try It Now sandbox (embedded agent API testing)
- [ ] Multi-agent workflow builder
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change. Pull requests should be made against the `main` branch.

---

## 👤 Author

**Malavya** — [@malavya1411](https://github.com/malavya1411)

---

*Built during free-time development. If you find it useful, give it a ⭐ on GitHub!*
