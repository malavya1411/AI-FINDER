export interface TechStack {
    useCase: string
    keywords: string[]
    frontend: StackItem
    backend: StackItem
    database: StackItem
    hosting: StackItem
}

export interface StackItem {
    name: string
    reason: string
}

export const techStacks: TechStack[] = [
    {
        useCase: "SaaS Dashboard",
        keywords: ["saas", "dashboard", "admin", "analytics", "panel", "management", "crm"],
        frontend: { name: "Next.js + Tailwind CSS", reason: "Server-side rendering for fast dashboards, Tailwind for rapid UI styling." },
        backend: { name: "Node.js + Express or Next.js API routes", reason: "Simple API layer with auth middleware and REST/GraphQL endpoints." },
        database: { name: "PostgreSQL (Supabase)", reason: "Relational data with row-level security, real-time subscriptions, and built-in auth." },
        hosting: { name: "Vercel", reason: "Zero-config Next.js deployment with edge functions and analytics." },
    },
    {
        useCase: "E-Commerce Store",
        keywords: ["ecommerce", "store", "shop", "sell", "product", "cart", "payment", "buy"],
        frontend: { name: "Next.js + Shadcn UI", reason: "SEO-friendly pages with fast static generation for product listings." },
        backend: { name: "Medusa.js or Stripe API", reason: "Headless commerce engine with payment processing built in." },
        database: { name: "PostgreSQL + Redis", reason: "Relational data for products/orders, Redis for cart sessions and caching." },
        hosting: { name: "Vercel + Railway", reason: "Frontend on Vercel, backend services on Railway for easy scaling." },
    },
    {
        useCase: "Blog / Content Site",
        keywords: ["blog", "content", "article", "post", "writing", "cms", "news", "magazine"],
        frontend: { name: "Astro or Next.js", reason: "Static site generation for blazing-fast content pages with minimal JS." },
        backend: { name: "Headless CMS (Sanity or Contentful)", reason: "Content-first architecture with structured content models." },
        database: { name: "CMS-managed (no separate DB needed)", reason: "Content lives in the CMS with API access." },
        hosting: { name: "Vercel or Netlify", reason: "Static hosting with CDN, automatic rebuilds on content changes." },
    },
    {
        useCase: "Mobile App",
        keywords: ["mobile", "ios", "android", "app", "phone", "native", "cross-platform"],
        frontend: { name: "React Native or Flutter", reason: "Cross-platform native apps from a single codebase." },
        backend: { name: "Firebase or Supabase", reason: "Real-time database, auth, and push notifications out of the box." },
        database: { name: "Firestore or Supabase PostgreSQL", reason: "Real-time sync for mobile data with offline support." },
        hosting: { name: "Firebase / Expo + App Store", reason: "Easy OTA updates, cloud functions, and app store deployment." },
    },
    {
        useCase: "AI/ML Application",
        keywords: ["ai", "machine learning", "ml", "model", "train", "predict", "neural", "deep learning"],
        frontend: { name: "React + Vite", reason: "Fast SPA for interactive ML demos and result visualization." },
        backend: { name: "FastAPI (Python)", reason: "Python-native API framework, ideal for serving ML models." },
        database: { name: "PostgreSQL + Pinecone", reason: "Relational data plus vector DB for embeddings and similarity search." },
        hosting: { name: "Railway + Modal", reason: "Railway for the API, Modal for serverless GPU compute." },
    },
    {
        useCase: "Portfolio / Landing Page",
        keywords: ["portfolio", "landing", "personal", "homepage", "resume", "showcase"],
        frontend: { name: "Astro or plain HTML/CSS/JS", reason: "Minimal framework overhead for simple, fast-loading pages." },
        backend: { name: "None (static) or Formspree for contact", reason: "No backend needed; use a form service for contact forms." },
        database: { name: "None needed", reason: "Static content, no dynamic data requirements." },
        hosting: { name: "Vercel, Netlify, or GitHub Pages", reason: "Free static hosting with custom domain support." },
    },
    {
        useCase: "Real-Time Chat App",
        keywords: ["chat", "messaging", "realtime", "real-time", "socket", "communication", "slack"],
        frontend: { name: "React + Vite", reason: "Real-time UI updates with optimistic rendering." },
        backend: { name: "Node.js + Socket.io or Supabase Realtime", reason: "WebSocket-based real-time communication." },
        database: { name: "Supabase PostgreSQL", reason: "Real-time subscriptions for message delivery." },
        hosting: { name: "Railway + Vercel", reason: "WebSocket support on Railway, frontend on Vercel." },
    },
    {
        useCase: "API / Backend Service",
        keywords: ["api", "backend", "server", "microservice", "rest", "graphql", "endpoint"],
        frontend: { name: "N/A (API only)", reason: "No frontend needed for pure API services." },
        backend: { name: "Node.js + Express or Hono", reason: "Lightweight, fast API framework with middleware ecosystem." },
        database: { name: "PostgreSQL or MongoDB", reason: "Choose relational or document-based depending on data structure." },
        hosting: { name: "Railway or Fly.io", reason: "Easy container deployment with auto-scaling." },
    },
]
