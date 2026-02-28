import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { agents } from "@/data/agents"
import {
    generateAgentQuestions,
    generateCustomPrompt,
    buildRefinementSummary,
    getValidOptions,
    type RefinementAnswers,
    type RefinementStep,
} from "@/lib/refinementEngine"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
}

export default function RefinementFlow() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const query = searchParams.get("q") || ""
    const agentId = searchParams.get("agent") || ""

    const agent = agents.find(a => a.id === agentId)

    const [steps, setSteps] = useState<RefinementStep[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<RefinementAnswers>({})
    const [customPrompt, setCustomPrompt] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!query || !agent) { navigate("/"); return }
        const generated = generateAgentQuestions(query, agent)
        setSteps(generated)
    }, [query, agent, navigate])

    // Total steps = question steps + 1 summary + 1 prompt output
    const totalSteps = steps.length + 2
    const progress = ((currentStep + 1) / totalSteps) * 100
    const isSummaryStep = currentStep === steps.length
    const isPromptStep = currentStep === steps.length + 1

    const toggleAnswer = (questionId: string, value: string) => {
        const valid = getValidOptions(questionId)
        if (valid.length > 0 && !valid.includes(value)) return
        setAnswers(prev => {
            const current = prev[questionId] || []
            const exists = current.includes(value)
            return {
                ...prev,
                [questionId]: exists
                    ? current.filter(v => v !== value)
                    : [...current, value],
            }
        })
    }

    const handleNext = () => {
        if (isSummaryStep) {
            // Generate the custom prompt
            const prompt = generateCustomPrompt(query, agent!, answers, steps)
            setCustomPrompt(prompt)
            setCurrentStep(prev => prev + 1)
        } else if (isPromptStep) {
            // Already at final step — nothing to do
        } else {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
        }
    }

    const handleBack = () => {
        if (currentStep === 0) {
            navigate(-1)
        } else {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(customPrompt.replace(/^# .+\n\n/, ""))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { }
    }

    if (!agent || steps.length === 0) return null

    const summary = isSummaryStep ? buildRefinementSummary(query, agent, answers, steps) : ""

    return (
        <motion.main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-20" {...pageTransition}>
            <div className="w-full max-w-xl mx-auto">
                {/* Progress bar */}
                <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={handleBack} className="text-sub hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <span className="text-xs text-dim">Step {currentStep + 1} of {totalSteps}</span>
                        {!isPromptStep && (
                            <button onClick={() => {
                                const prompt = generateCustomPrompt(query, agent, answers, steps)
                                setCustomPrompt(prompt)
                                setCurrentStep(steps.length + 1)
                            }} className="text-xs text-dim hover:text-blue-400 transition-colors cursor-pointer">
                                Skip →
                            </button>
                        )}
                        {isPromptStep && <span className="text-xs text-dim">Done</span>}
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>

                {/* Agent context badge */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="text-xs text-dim mb-1 uppercase tracking-widest">Customizing for</p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full pill">
                        <span className="text-sm font-semibold text-heading">{agent.name}</span>
                        <span className="text-[10px] text-dim">{agent.category}</span>
                    </div>
                    <p className="text-xs text-sub italic mt-2">"{query}"</p>
                </motion.div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    {!isSummaryStep && !isPromptStep ? (
                        /* Question Steps */
                        <motion.div
                            key={`step-${currentStep}`}
                            variants={slideVariants}
                            initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                            <h2
                                className="text-xl sm:text-2xl font-bold text-heading mb-8 text-center"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {steps[currentStep].title}
                            </h2>

                            <div className="space-y-8">
                                {steps[currentStep].questions.map((question) => (
                                    <div key={question.id}>
                                        <p className="text-sm text-sub mb-3 font-medium">{question.text}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {question.options.map(option => {
                                                const selected = (answers[question.id] || []).includes(option.value)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => toggleAnswer(question.id, option.value)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${selected
                                                                ? "bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                                                                : "pill hover:pill-active"
                                                            }`}
                                                        style={{ border: selected ? "1px solid rgba(96,165,250,0.5)" : undefined }}
                                                    >
                                                        {selected && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                                                        {option.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : isSummaryStep ? (
                        /* Summary Step */
                        <motion.div
                            key="summary"
                            variants={slideVariants}
                            initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                            <h2
                                className="text-xl sm:text-2xl font-bold text-heading mb-6 text-center"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                Ready to generate your prompt
                            </h2>
                            <div className="glass gradient-border rounded-2xl p-6 mb-6">
                                <div className="text-sm text-body leading-relaxed whitespace-pre-line">{summary}</div>
                            </div>
                            <p className="text-xs text-dim text-center mb-4">
                                Go back to adjust, or generate your custom prompt for {agent.name}.
                            </p>
                        </motion.div>
                    ) : (
                        /* Prompt Output Step */
                        <motion.div
                            key="prompt-output"
                            variants={slideVariants}
                            initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                            <h2
                                className="text-xl sm:text-2xl font-bold text-heading mb-6 text-center"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                Your custom prompt is ready
                            </h2>

                            {/* Prompt card */}
                            <div className="glass rounded-2xl overflow-hidden mb-6">
                                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                                    <span className="text-xs font-semibold text-dim uppercase tracking-widest">Prompt for {agent.name}</span>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all ${copied
                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                                : "pill hover:pill-active"
                                            }`}
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                                <pre className="px-5 py-4 text-sm font-mono text-green-300/80 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                                    {customPrompt.replace(/^# .+\n\n/, "")}
                                </pre>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a href={agent.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <button className="w-full flex items-center justify-center gap-2 btn-glow text-sm font-medium px-6 py-3 rounded-full cursor-pointer">
                                        Open in {agent.name} <ExternalLink className="w-4 h-4" />
                                    </button>
                                </a>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 btn-secondary text-sm font-medium px-6 py-3 rounded-full cursor-pointer"
                                >
                                    Back to Results
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation — hide on prompt output step */}
                {!isPromptStep && (
                    <motion.div
                        className="flex justify-center mt-10"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    >
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 btn-glow text-sm font-medium px-8 py-3 rounded-full cursor-pointer"
                        >
                            {isSummaryStep ? (
                                <>Generate Prompt <Sparkles className="w-4 h-4" /></>
                            ) : (
                                <>Continue <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.main>
    )
}
