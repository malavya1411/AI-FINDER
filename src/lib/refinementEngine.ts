/**
 * Refinement Engine — Post-Selection Agent Customization
 *
 * Generates agent-specific follow-up questions AFTER the user has chosen
 * an agent from the results page. Then generates a custom prompt tailored
 * to the agent's strengths and the user's specific needs.
 */

import { type Agent } from "@/data/agents"

export interface QuestionOption {
    label: string
    value: string
}

export interface RefinementQuestion {
    id: string
    text: string
    options: QuestionOption[]
}

export interface RefinementStep {
    title: string
    questions: RefinementQuestion[]
}

export interface RefinementAnswers {
    [questionId: string]: string[]
}

// ─── Category-based question banks ──────────────────────

const categoryQuestions: Record<string, RefinementQuestion[]> = {
    "Code Assistant": [
        {
            id: "code_task", text: "What do you need help with?", options: [
                { label: "Writing new code", value: "write" },
                { label: "Debugging / Fixing", value: "debug" },
                { label: "Refactoring", value: "refactor" },
                { label: "Code review", value: "review" },
                { label: "Learning", value: "learn" },
            ]
        },
        {
            id: "code_lang", text: "Primary language or framework?", options: [
                { label: "JavaScript / TypeScript", value: "js" },
                { label: "Python", value: "python" },
                { label: "Java / Kotlin", value: "java" },
                { label: "Go / Rust", value: "systems" },
                { label: "Other", value: "other" },
            ]
        },
        {
            id: "code_detail", text: "How detailed should the response be?", options: [
                { label: "Quick answer", value: "brief" },
                { label: "Step-by-step explanation", value: "detailed" },
                { label: "Full implementation", value: "full" },
            ]
        },
    ],
    "Image Generation": [
        {
            id: "image_purpose", text: "What are the images for?", options: [
                { label: "Marketing / Social media", value: "marketing" },
                { label: "Product / E-commerce", value: "product" },
                { label: "Art / Creative", value: "art" },
                { label: "UI / App assets", value: "ui" },
                { label: "Logo / Branding", value: "logo" },
            ]
        },
        {
            id: "image_style", text: "What style do you prefer?", options: [
                { label: "Photorealistic", value: "photo" },
                { label: "Illustrated / Artistic", value: "artistic" },
                { label: "Minimalist / Clean", value: "minimal" },
                { label: "3D rendered", value: "3d" },
            ]
        },
        {
            id: "image_format", text: "What output do you need?", options: [
                { label: "Single image", value: "single" },
                { label: "Multiple variations", value: "variations" },
                { label: "Image with edits", value: "edit" },
            ]
        },
    ],
    "Writing": [
        {
            id: "writing_type", text: "What type of content?", options: [
                { label: "Blog / Article", value: "blog" },
                { label: "Marketing copy", value: "marketing" },
                { label: "Technical docs", value: "technical" },
                { label: "Fiction / Creative", value: "fiction" },
                { label: "Email / Comms", value: "email" },
            ]
        },
        {
            id: "writing_tone", text: "What tone?", options: [
                { label: "Professional", value: "professional" },
                { label: "Casual / Friendly", value: "casual" },
                { label: "Academic", value: "academic" },
                { label: "Witty / Creative", value: "creative" },
            ]
        },
        {
            id: "writing_length", text: "How long should the output be?", options: [
                { label: "Short (< 200 words)", value: "short" },
                { label: "Medium (200–500 words)", value: "medium" },
                { label: "Long (500+ words)", value: "long" },
            ]
        },
    ],
    "Data Analysis": [
        {
            id: "data_type", text: "What type of data are you working with?", options: [
                { label: "CSV / Spreadsheet", value: "csv" },
                { label: "Database", value: "database" },
                { label: "Web data / Scraping", value: "web" },
                { label: "API data", value: "api" },
                { label: "Research papers", value: "research" },
            ]
        },
        {
            id: "data_goal", text: "What is your goal?", options: [
                { label: "Find patterns / Insights", value: "patterns" },
                { label: "Build a report", value: "report" },
                { label: "Compare datasets", value: "compare" },
                { label: "Get a summary", value: "summary" },
            ]
        },
        {
            id: "data_output", text: "What format do you want the result in?", options: [
                { label: "Bullet points", value: "bullets" },
                { label: "Paragraph summary", value: "paragraph" },
                { label: "Code / Script", value: "code" },
                { label: "Table / Chart", value: "table" },
            ]
        },
    ],
    "Web Building": [
        {
            id: "web_type", text: "What are you building?", options: [
                { label: "Landing page", value: "landing" },
                { label: "Full web app", value: "webapp" },
                { label: "E-commerce store", value: "ecommerce" },
                { label: "Portfolio / Blog", value: "portfolio" },
                { label: "SaaS dashboard", value: "saas" },
            ]
        },
        {
            id: "web_backend", text: "Do you need backend support?", options: [
                { label: "Yes, real-time data", value: "realtime" },
                { label: "Yes, simple API", value: "api" },
                { label: "No, frontend only", value: "frontend" },
            ]
        },
        {
            id: "web_deploy", text: "Where will you deploy?", options: [
                { label: "Vercel / Netlify", value: "vercel" },
                { label: "AWS / GCP", value: "cloud" },
                { label: "Self-hosted", value: "self" },
                { label: "Not sure yet", value: "unsure" },
            ]
        },
    ],
    "Video": [
        {
            id: "video_type", text: "What type of video?", options: [
                { label: "Short clips / Social", value: "short" },
                { label: "Explainer / Tutorial", value: "explainer" },
                { label: "Product demo", value: "demo" },
                { label: "Cinematic / Creative", value: "cinematic" },
                { label: "Avatar / Talking head", value: "avatar" },
            ]
        },
        {
            id: "video_length", text: "How long?", options: [
                { label: "Under 30 seconds", value: "short" },
                { label: "1–3 minutes", value: "medium" },
                { label: "5+ minutes", value: "long" },
            ]
        },
    ],
    "Audio": [
        {
            id: "audio_type", text: "What audio do you need?", options: [
                { label: "Voice / Text-to-speech", value: "voice" },
                { label: "Music / Songs", value: "music" },
                { label: "Podcast editing", value: "podcast" },
                { label: "Sound effects", value: "sfx" },
            ]
        },
        {
            id: "audio_quality", text: "Quality level?", options: [
                { label: "Draft / Quick", value: "draft" },
                { label: "Professional", value: "professional" },
            ]
        },
    ],
    "Chatbot": [
        {
            id: "bot_purpose", text: "What is the chatbot for?", options: [
                { label: "Customer support", value: "support" },
                { label: "Internal assistant", value: "internal" },
                { label: "Lead generation", value: "leadgen" },
                { label: "General Q&A", value: "general" },
            ]
        },
        {
            id: "bot_tone", text: "What tone should the bot use?", options: [
                { label: "Professional", value: "professional" },
                { label: "Friendly / Casual", value: "casual" },
                { label: "Technical", value: "technical" },
            ]
        },
    ],
    "Automation": [
        {
            id: "auto_complexity", text: "How complex is the workflow?", options: [
                { label: "Simple (2–3 steps)", value: "simple" },
                { label: "Moderate (branching)", value: "moderate" },
                { label: "Complex (API + data)", value: "complex" },
            ]
        },
        {
            id: "auto_tools", text: "What tools are involved?", options: [
                { label: "Email / Calendar", value: "email" },
                { label: "CRM / Sales tools", value: "crm" },
                { label: "Databases / Spreadsheets", value: "data" },
                { label: "APIs / Webhooks", value: "api" },
            ]
        },
    ],
    "Design": [
        {
            id: "design_task", text: "What design task?", options: [
                { label: "UI mockups", value: "ui" },
                { label: "Wireframing", value: "wireframe" },
                { label: "Branding / Color", value: "branding" },
                { label: "UX research", value: "ux" },
            ]
        },
        {
            id: "design_format", text: "What deliverable do you need?", options: [
                { label: "Visual mockup", value: "mockup" },
                { label: "Written guidelines", value: "guidelines" },
                { label: "Color palette / System", value: "palette" },
            ]
        },
    ],
}

// Universal follow-up questions
const universalQuestions: RefinementQuestion[] = [
    {
        id: "tech_level", text: "What's your technical level?", options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Expert", value: "expert" },
        ]
    },
    {
        id: "output_pref", text: "How should the output be structured?", options: [
            { label: "Step-by-step guide", value: "steps" },
            { label: "Concise summary", value: "summary" },
            { label: "Detailed deep-dive", value: "detailed" },
            { label: "Ready-to-use template", value: "template" },
        ]
    },
]

// ─── Public API ──────────────────────────────────────────

/**
 * Generate agent-specific refinement steps based on both the
 * user's query AND the selected agent's category/capabilities.
 */
export function generateAgentQuestions(_query: string, agent: Agent): RefinementStep[] {
    const steps: RefinementStep[] = []
    const catQuestions = categoryQuestions[agent.category] || []

    // Step 1: Agent-specific category questions
    if (catQuestions.length > 0) {
        steps.push({
            title: `Customize for ${agent.name}`,
            questions: catQuestions.slice(0, 3),
        })
    }

    // Step 2: Universal preferences
    steps.push({
        title: "Your preferences",
        questions: universalQuestions,
    })

    return steps
}

/**
 * Generate a custom prompt tailored to the specific agent,
 * the user's original query, and their refinement answers.
 */
export function generateCustomPrompt(query: string, agent: Agent, answers: RefinementAnswers, steps: RefinementStep[]): string {
    const allQuestions = steps.flatMap(s => s.questions)

    // Build context from answers
    const contextParts: string[] = []
    for (const [qId, vals] of Object.entries(answers)) {
        if (vals.length === 0) continue
        const question = allQuestions.find(q => q.id === qId)
        if (!question) continue
        const labels = vals.map(v => question.options.find(o => o.value === v)?.label || v)
        contextParts.push(`${question.text} ${labels.join(", ")}`)
    }

    // Determine output format preference
    const outputPref = answers["output_pref"]?.[0]
    let outputInstruction = ""
    switch (outputPref) {
        case "steps": outputInstruction = "Present your response as a numbered step-by-step guide."; break
        case "summary": outputInstruction = "Keep your response concise and to the point."; break
        case "detailed": outputInstruction = "Provide a comprehensive, detailed response with examples."; break
        case "template": outputInstruction = "Provide a ready-to-use template or boilerplate."; break
        default: outputInstruction = "Be thorough but concise."
    }

    // Determine tech level
    const techLevel = answers["tech_level"]?.[0]
    let techInstruction = ""
    switch (techLevel) {
        case "beginner": techInstruction = "Explain concepts simply, avoid jargon, and include beginner-friendly context."; break
        case "intermediate": techInstruction = "Assume some familiarity with the topic. Include relevant technical details."; break
        case "expert": techInstruction = "Be direct and technical. Skip basic explanations."; break
        default: techInstruction = ""
    }

    const contextSection = contextParts.length > 0
        ? `\n\nContext about the user's needs:\n${contextParts.map(c => `- ${c}`).join("\n")}`
        : ""

    const capabilitiesSection = agent.capabilities.length > 0
        ? `\nLeverage these capabilities: ${agent.capabilities.slice(0, 5).join(", ")}.`
        : ""

    const prompt = `You are ${agent.name}, ${agent.description.toLowerCase()}

The user needs help with the following:

"${query}"${contextSection}

${outputInstruction}${techInstruction ? " " + techInstruction : ""}${capabilitiesSection}

Provide a detailed, actionable response. If this involves building something, include architecture recommendations and key implementation details. If this involves content, provide structured output with examples.`

    return `# Custom Prompt for ${agent.name}\n\n${prompt}`
}

/**
 * Build a human-readable summary of the user's refinement answers.
 */
export function buildRefinementSummary(query: string, agent: Agent, answers: RefinementAnswers, steps: RefinementStep[]): string {
    const parts: string[] = [`Using **${agent.name}** to: "${query}"`]
    const allQuestions = steps.flatMap(s => s.questions)

    for (const [qId, vals] of Object.entries(answers)) {
        if (vals.length === 0) continue
        const question = allQuestions.find(q => q.id === qId)
        if (!question) continue
        const labels = vals.map(v => question.options.find(o => o.value === v)?.label || v)
        parts.push(`${question.text} → ${labels.join(", ")}`)
    }

    return parts.join("\n")
}

/**
 * Get the list of valid option values for a question.
 * Used for whitelist validation of refinement answers.
 */
export function getValidOptions(questionId: string): string[] {
    for (const questions of Object.values(categoryQuestions)) {
        for (const q of questions) {
            if (q.id === questionId) {
                return q.options.map(o => o.value)
            }
        }
    }
    for (const q of universalQuestions) {
        if (q.id === questionId) {
            return q.options.map(o => o.value)
        }
    }
    return []
}
