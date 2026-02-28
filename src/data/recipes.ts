export interface Recipe {
    id: string
    title: string
    author: string
    description: string
    agentIds: string[]
    agentNames: string[]
    promptChain: string[]
    outcome: string
    upvotes: number
    bookmarks: number
    createdAt: number
    tags: string[]
}

export const recipes: Recipe[] = [
    {
        id: "recipe-1",
        title: "Automated Content Pipeline",
        author: "Sarah K.",
        description: "How I automated my entire blog content pipeline using ChatGPT for ideation, Jasper for writing, and DALL·E for images.",
        agentIds: ["chatgpt", "jasper", "dall-e"],
        agentNames: ["ChatGPT", "Jasper", "DALL·E 3"],
        promptChain: [
            "Generate 10 blog topic ideas about AI automation for small businesses",
            "Write a 1500-word SEO-optimized blog post on: {selected topic}",
            "Create a featured image: modern flat illustration of {topic}, tech-focused, blue palette",
        ],
        outcome: "Reduced content creation time from 6 hours to 45 minutes per post. Published 3x more articles per week.",
        upvotes: 342,
        bookmarks: 89,
        createdAt: Date.now() - 86400000 * 5,
        tags: ["Marketing", "Automation", "Writing"],
    },
    {
        id: "recipe-2",
        title: "Full-Stack MVP in a Weekend",
        author: "James L.",
        description: "Built a complete SaaS MVP using Cursor for full-stack code, v0 for UI components, and Perplexity for research.",
        agentIds: ["cursor", "v0", "perplexity"],
        agentNames: ["Cursor", "v0 by Vercel", "Perplexity"],
        promptChain: [
            "Research best practices for building a project management SaaS with real-time features",
            "Generate a responsive dashboard layout with sidebar navigation using React + Tailwind",
            "Build a full Next.js app with Supabase auth, real-time subscriptions, and CRUD operations",
        ],
        outcome: "Shipped a working MVP with auth, real-time updates, and a polished UI in 48 hours.",
        upvotes: 567,
        bookmarks: 234,
        createdAt: Date.now() - 86400000 * 3,
        tags: ["DevTools", "Prototyping", "Full-Stack"],
    },
    {
        id: "recipe-3",
        title: "AI-Powered Research Assistant",
        author: "Dr. Emily R.",
        description: "Combined Perplexity for literature review, Claude for analysis, and Notion AI for organizing findings.",
        agentIds: ["perplexity", "claude", "notion-ai"],
        agentNames: ["Perplexity", "Claude", "Notion AI"],
        promptChain: [
            "Find recent papers (2024-2025) on transformer attention mechanisms in medical imaging",
            "Analyze these 5 papers: summarize key findings, compare methodologies, identify gaps",
            "Organize findings into a structured research document with sections for each methodology",
        ],
        outcome: "Completed literature review in 2 days instead of 2 weeks. Higher coverage of relevant papers.",
        upvotes: 189,
        bookmarks: 67,
        createdAt: Date.now() - 86400000 * 7,
        tags: ["Research", "Academia", "Analysis"],
    },
    {
        id: "recipe-4",
        title: "Product Launch Video Kit",
        author: "Miguel F.",
        description: "Created an entire product launch video package: script from ChatGPT, visuals from Midjourney, video from Runway, voiceover from ElevenLabs.",
        agentIds: ["chatgpt", "midjourney", "runway", "elevenlabs"],
        agentNames: ["ChatGPT", "Midjourney", "Runway ML", "ElevenLabs"],
        promptChain: [
            "Write a 60-second product launch script for a smart home app, energetic and modern tone",
            "Generate product showcase images: sleek smart home interface on iPhone, dark minimalist setting",
            "Create a 15-second cinematic intro sequence from: {generated product image}",
            "Generate professional male voiceover for: {script text}",
        ],
        outcome: "Produced a professional product launch video that would normally cost $5K+ from an agency.",
        upvotes: 412,
        bookmarks: 156,
        createdAt: Date.now() - 86400000 * 2,
        tags: ["Creative", "Marketing", "Video"],
    },
    {
        id: "recipe-5",
        title: "Code Review & Refactoring Pipeline",
        author: "Alex T.",
        description: "Set up a code quality pipeline: Copilot for initial writing, Claude for deep review, Cursor for refactoring.",
        agentIds: ["github-copilot", "claude", "cursor"],
        agentNames: ["GitHub Copilot", "Claude", "Cursor"],
        promptChain: [
            "Write unit tests for the authentication module following AAA pattern",
            "Review this codebase for security vulnerabilities, suggest fixes with explanations",
            "Refactor the identified issues across all files while maintaining test coverage",
        ],
        outcome: "Reduced code review time by 60%, caught 3 critical security issues before deployment.",
        upvotes: 298,
        bookmarks: 112,
        createdAt: Date.now() - 86400000 * 4,
        tags: ["DevTools", "Security", "Code Quality"],
    },
    {
        id: "recipe-6",
        title: "Podcast Production Workflow",
        author: "Lisa M.",
        description: "End-to-end podcast creation: ChatGPT for scripting, ElevenLabs for voice, Suno for intro music.",
        agentIds: ["chatgpt", "elevenlabs", "suno"],
        agentNames: ["ChatGPT", "ElevenLabs", "Suno"],
        promptChain: [
            "Write a 20-minute podcast script about the future of remote work, conversational tone",
            "Generate a catchy 15-second podcast intro jingle, upbeat electronic, tech vibes",
            "Generate host voiceover in professional radio style for: {script segments}",
        ],
        outcome: "Launched a weekly podcast with zero recording equipment. 2K downloads in the first month.",
        upvotes: 178,
        bookmarks: 45,
        createdAt: Date.now() - 86400000 * 6,
        tags: ["Creative", "Audio", "Content"],
    },
]
