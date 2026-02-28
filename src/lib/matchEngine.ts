import { agents, type Agent } from "@/data/agents"
import { techStacks, type TechStack } from "@/data/techStacks"
import { sanitizeQuery, safeParseArray } from "@/lib/sanitize"

interface MatchResult {
    agent: Agent
    score: number
    reasoning: string
}

/**
 * Analyze a user query and match against known agents.
 * Security: input is sanitized (HTML stripped, length enforced) before processing.
 */
export function analyzeQuery(query: string): MatchResult[] {
    // Sanitize input — strip HTML, enforce max 500 chars
    const clean = sanitizeQuery(query)
    if (!clean) return []

    const q = clean.toLowerCase()
    const words = q.split(/\s+/)

    const scored = agents.map((agent) => {
        let score = 0
        const matchedReasons: string[] = []

        // Keyword matching
        for (const keyword of agent.keywords) {
            if (q.includes(keyword)) {
                score += keyword.split(" ").length > 1 ? 3 : 2
                matchedReasons.push(`Matches your need for "${keyword}"`)
            }
        }

        // Category matching
        if (q.includes(agent.category.toLowerCase())) {
            score += 4
            matchedReasons.push(`Directly relevant to ${agent.category}`)
        }

        // Capability matching
        for (const cap of agent.capabilities) {
            const capLower = cap.toLowerCase()
            if (q.includes(capLower) || words.some((w) => capLower.includes(w) && w.length > 3)) {
                score += 1.5
                matchedReasons.push(`Offers ${cap}`)
            }
        }

        // Best-for matching
        for (const bf of agent.bestFor) {
            const bfLower = bf.toLowerCase()
            if (q.includes(bfLower) || words.some((w) => bfLower.includes(w) && w.length > 3)) {
                score += 2
                matchedReasons.push(`Best suited for ${bf}`)
            }
        }

        // Deduplicate reasons
        const uniqueReasons = [...new Set(matchedReasons)]
        const reasoning =
            uniqueReasons.length > 0
                ? uniqueReasons.slice(0, 3).join(". ") + "."
                : `${agent.name} is a versatile tool that could help with your needs.`

        return { agent, score, reasoning }
    })

    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
}

export function recommendTechStack(query: string): TechStack | null {
    const clean = sanitizeQuery(query)
    if (!clean) return null

    const q = clean.toLowerCase()

    const buildKeywords = [
        "build", "create", "make", "develop", "website", "web", "app",
        "application", "platform", "site", "project", "saas", "tool",
        "startup", "mvp", "prototype",
    ]

    const isBuildQuery = buildKeywords.some((k) => q.includes(k))
    if (!isBuildQuery) return null

    let bestMatch: TechStack | null = null
    let bestScore = 0

    for (const stack of techStacks) {
        let score = 0
        for (const keyword of stack.keywords) {
            if (q.includes(keyword)) {
                score += 2
            }
        }
        if (score > bestScore) {
            bestScore = score
            bestMatch = stack
        }
    }

    if (!bestMatch && isBuildQuery) {
        bestMatch = techStacks[0]
    }

    return bestMatch
}

export function generatePrompt(query: string, agent: Agent): string {
    // Security: sanitize before embedding in generated prompt
    const cleanQuery = sanitizeQuery(query)

    const prompt = `You are an expert assistant. The user needs help with the following:

"${cleanQuery}"

Please provide a detailed, actionable response. Break down the problem into clear steps. If this involves building something, provide architecture recommendations, key implementation details, and potential challenges to watch out for. If this involves content creation, provide structured output with examples. Be thorough but concise.`

    return `# Optimized Prompt for ${agent.name}\n\n${prompt}`
}

export interface SearchHistoryItem {
    id: string
    query: string
    timestamp: number
    topAgentName: string
}

/**
 * Type guard for validating history items from localStorage.
 * Rejects any entry with unexpected shape or types.
 */
function isValidHistoryItem(item: unknown): item is SearchHistoryItem {
    if (typeof item !== "object" || item === null) return false
    const obj = item as Record<string, unknown>
    return (
        typeof obj.id === "string" &&
        typeof obj.query === "string" &&
        typeof obj.timestamp === "number" &&
        typeof obj.topAgentName === "string" &&
        obj.id.length > 0 &&
        obj.query.length > 0 &&
        obj.query.length <= 500 &&
        obj.topAgentName.length <= 200
    )
}

export function saveToHistory(query: string, topAgentName: string): void {
    // Security: sanitize before storing
    const cleanQuery = sanitizeQuery(query)
    if (!cleanQuery) return

    const history = getHistory()
    const item: SearchHistoryItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        query: cleanQuery,
        timestamp: Date.now(),
        topAgentName: topAgentName.slice(0, 200), // enforce length limit
    }
    history.unshift(item)
    // Keep only last 50 — prevent localStorage bloat
    try {
        localStorage.setItem("ai-finder-history", JSON.stringify(history.slice(0, 50)))
    } catch {
        // Silently fail if localStorage is full or unavailable
    }
}

/**
 * Retrieve search history with schema validation.
 * Rejects malformed entries to prevent localStorage poisoning.
 */
export function getHistory(): SearchHistoryItem[] {
    try {
        const raw = localStorage.getItem("ai-finder-history")
        return safeParseArray(raw, isValidHistoryItem)
    } catch {
        return []
    }
}

export function clearHistory(): void {
    try {
        localStorage.removeItem("ai-finder-history")
    } catch {
        // Silently fail
    }
}
