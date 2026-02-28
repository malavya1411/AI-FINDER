/**
 * Client-side input sanitization & validation utilities.
 *
 * OWASP guidance: even client-side-only apps must defend against
 * self-XSS (pasted payloads), DOM-based XSS, and localStorage poisoning.
 */

// ─── Constants ───────────────────────────────────────────
const MAX_QUERY_LENGTH = 500
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254  // RFC 5321
const MAX_PASSWORD_LENGTH = 128
const MIN_PASSWORD_LENGTH = 6

// ─── Sanitization ────────────────────────────────────────

/**
 * Strip HTML tags and trim to a max length.
 * Prevents DOM-based XSS when rendering user input.
 */
export function sanitizeInput(input: string, maxLength: number = MAX_QUERY_LENGTH): string {
    if (typeof input !== "string") return ""
    // Strip HTML/script tags
    const stripped = input.replace(/<[^>]*>/g, "")
    // Collapse whitespace and trim
    const cleaned = stripped.replace(/\s+/g, " ").trim()
    return cleaned.slice(0, maxLength)
}

/**
 * Sanitize a search query — strips HTML, enforces length.
 */
export function sanitizeQuery(query: string): string {
    return sanitizeInput(query, MAX_QUERY_LENGTH)
}

// ─── Validation ──────────────────────────────────────────

/**
 * Validate email format (RFC-compliant regex subset).
 * Returns an error message string or null if valid.
 */
export function validateEmail(email: string): string | null {
    if (!email || typeof email !== "string") return "Email is required"
    const trimmed = email.trim()
    if (trimmed.length > MAX_EMAIL_LENGTH) return "Email is too long"
    // Standard email pattern — not exhaustive but catches common issues
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!pattern.test(trimmed)) return "Invalid email format"
    return null
}

/**
 * Validate password strength.
 * Returns an error message string or null if valid.
 */
export function validatePassword(password: string): string | null {
    if (!password || typeof password !== "string") return "Password is required"
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    if (password.length > MAX_PASSWORD_LENGTH) return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
    return null
}

/**
 * Validate a name field.
 */
export function validateName(name: string): string | null {
    if (!name || typeof name !== "string") return "Name is required"
    const sanitized = sanitizeInput(name, MAX_NAME_LENGTH)
    if (sanitized.length < 1) return "Name is required"
    return null
}

// ─── localStorage safety ─────────────────────────────────

/**
 * Safely parse JSON from localStorage with type checking.
 * Returns null if parsing fails or data is not an array.
 */
export function safeParseArray<T>(raw: string | null, validator: (item: unknown) => item is T): T[] {
    if (!raw || typeof raw !== "string") return []
    try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        // Validate each entry individually — reject malformed items
        return parsed.filter(validator).slice(0, 100) // cap to prevent memory abuse
    } catch {
        return []
    }
}

// ─── URL Validation ──────────────────────────────────────

const MAX_URL_LENGTH = 2048

/**
 * Validate a URL — must be http/https, reasonable length.
 */
export function validateUrl(url: string): string | null {
    if (!url || typeof url !== "string") return "URL is required"
    const trimmed = url.trim()
    if (trimmed.length > MAX_URL_LENGTH) return "URL is too long"
    try {
        const parsed = new URL(trimmed)
        if (!["http:", "https:"].includes(parsed.protocol)) return "URL must use http or https"
    } catch {
        return "Invalid URL format"
    }
    return null
}

// ─── Rating Validation ───────────────────────────────────

/**
 * Validate a rating — must be integer 1-5.
 */
export function validateRating(value: unknown): string | null {
    if (typeof value !== "number") return "Rating must be a number"
    if (!Number.isInteger(value)) return "Rating must be a whole number"
    if (value < 1 || value > 5) return "Rating must be between 1 and 5"
    return null
}

// ─── Review Validation ───────────────────────────────────

const MAX_REVIEW_LENGTH = 300

/**
 * Validate and sanitize review text — max 300 chars, HTML stripped.
 */
export function validateReview(text: string): { valid: boolean; error?: string; sanitized: string } {
    if (!text || typeof text !== "string") {
        return { valid: false, error: "Review text is required", sanitized: "" }
    }
    const sanitized = sanitizeInput(text, MAX_REVIEW_LENGTH)
    if (sanitized.length < 3) {
        return { valid: false, error: "Review must be at least 3 characters", sanitized }
    }
    return { valid: true, sanitized }
}

// ─── Refinement Answer Validation ────────────────────────

/**
 * Validate a refinement answer against a whitelist of allowed values.
 * Prevents users from injecting arbitrary values into refinement answers.
 */
export function validateRefinementAnswer(answer: string, allowedOptions: string[]): boolean {
    if (typeof answer !== "string") return false
    return allowedOptions.includes(answer)
}

// ─── Agent Submission Schema Validation ──────────────────

const MAX_DESCRIPTION_LENGTH = 500

interface AgentSubmissionData {
    name?: unknown
    description?: unknown
    category?: unknown
    pricing?: unknown
    link?: unknown
    [key: string]: unknown
}

const VALID_PRICING_MODELS = ["free", "freemium", "usage-based", "subscription"]

/**
 * Validate an agent submission form.
 * Returns an object with field-level errors, or null if valid.
 */
export function validateAgentSubmission(data: AgentSubmissionData): Record<string, string> | null {
    const errors: Record<string, string> = {}

    // Name
    if (!data.name || typeof data.name !== "string" || data.name.trim().length < 1) {
        errors.name = "Name is required"
    } else if (data.name.length > MAX_NAME_LENGTH) {
        errors.name = `Name must be at most ${MAX_NAME_LENGTH} characters`
    }

    // Description
    if (!data.description || typeof data.description !== "string") {
        errors.description = "Description is required"
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`
    }

    // Category
    if (!data.category || typeof data.category !== "string") {
        errors.category = "Category is required"
    }

    // Pricing model
    if (data.pricing && typeof data.pricing === "string") {
        if (!VALID_PRICING_MODELS.includes(data.pricing)) {
            errors.pricing = "Invalid pricing model"
        }
    }

    // Link
    if (data.link && typeof data.link === "string") {
        const urlError = validateUrl(data.link)
        if (urlError) errors.link = urlError
    }

    return Object.keys(errors).length > 0 ? errors : null
}
