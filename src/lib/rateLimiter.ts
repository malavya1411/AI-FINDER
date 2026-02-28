/**
 * Client-side sliding-window rate limiter.
 *
 * Uses localStorage to track request timestamps per action type.
 * This is a client-side protection — it can be bypassed by determined
 * attackers, but it protects against accidental abuse and casual bot scripts.
 *
 * For production, server-side rate limiting is required (see SECURITY.md).
 */

interface RateLimitConfig {
    maxRequests: number
    windowMs: number
    label: string  // human-readable description for UI
}

interface RateLimitResult {
    allowed: boolean
    retryAfterMs: number
    remaining: number
    message: string
}

// Rate limit configs per action
const LIMITS: Record<string, RateLimitConfig> = {
    search: {
        maxRequests: 10,
        windowMs: 60_000,       // 10 per minute
        label: "search requests",
    },
    refine: {
        maxRequests: 15,
        windowMs: 60_000,       // 15 per minute
        label: "refinement requests",
    },
    submission: {
        maxRequests: 5,
        windowMs: 3600_000,     // 5 per hour
        label: "agent submissions",
    },
    review: {
        maxRequests: 3,
        windowMs: 60_000,       // 3 per minute
        label: "review submissions",
    },
    sandbox: {
        maxRequests: 5,
        windowMs: 60_000,       // 5 per minute
        label: "sandbox tries",
    },
    daily: {
        maxRequests: 100,
        windowMs: 86400_000,    // 100 per day
        label: "daily AI requests",
    },
}

const STORAGE_PREFIX = "af-rl-"

/**
 * Check if an action is allowed under rate limiting rules.
 * Uses a sliding window algorithm — each request timestamp is stored,
 * and only timestamps within the window are counted.
 */
export function checkRateLimit(action: keyof typeof LIMITS): RateLimitResult {
    const config = LIMITS[action]
    if (!config) {
        return { allowed: true, retryAfterMs: 0, remaining: Infinity, message: "" }
    }

    const key = `${STORAGE_PREFIX}${action}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Read existing timestamps
    let timestamps: number[] = []
    try {
        const raw = localStorage.getItem(key)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
                // Only keep timestamps within the window (sliding window cleanup)
                timestamps = parsed.filter((t: unknown) => typeof t === "number" && t > windowStart)
            }
        }
    } catch {
        timestamps = []
    }

    if (timestamps.length >= config.maxRequests) {
        // Find the oldest timestamp in window — retry after it expires
        const oldest = Math.min(...timestamps)
        const retryAfterMs = Math.max(0, oldest + config.windowMs - now)
        const retrySeconds = Math.ceil(retryAfterMs / 1000)

        return {
            allowed: false,
            retryAfterMs,
            remaining: 0,
            message: `You've hit the limit for ${config.label}. Try again in ${retrySeconds}s.`,
        }
    }

    return {
        allowed: true,
        retryAfterMs: 0,
        remaining: config.maxRequests - timestamps.length,
        message: "",
    }
}

/**
 * Record a request for rate limiting tracking.
 * Call this AFTER confirming the action is allowed and AFTER the action succeeds.
 */
export function recordRequest(action: keyof typeof LIMITS): void {
    const config = LIMITS[action]
    if (!config) return

    const key = `${STORAGE_PREFIX}${action}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    let timestamps: number[] = []
    try {
        const raw = localStorage.getItem(key)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
                timestamps = parsed.filter((t: unknown) => typeof t === "number" && t > windowStart)
            }
        }
    } catch {
        timestamps = []
    }

    timestamps.push(now)

    try {
        localStorage.setItem(key, JSON.stringify(timestamps))
    } catch {
        // localStorage full — silently continue
    }
}

/**
 * Get the available rate limit actions for documentation/debugging.
 */
export function getRateLimitInfo(): Record<string, { maxRequests: number; windowDescription: string }> {
    const info: Record<string, { maxRequests: number; windowDescription: string }> = {}
    for (const [action, config] of Object.entries(LIMITS)) {
        const windowMin = config.windowMs / 60_000
        info[action] = {
            maxRequests: config.maxRequests,
            windowDescription: windowMin >= 60
                ? `${Math.round(windowMin / 60)} hour(s)`
                : `${Math.round(windowMin)} minute(s)`,
        }
    }
    return info
}
