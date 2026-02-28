import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
    ArrowLeft, Star, ExternalLink, Shield, Zap, Globe, Terminal,
    MessageSquare, Sparkles, ChevronRight, Send,
} from "lucide-react"
import { agents } from "@/data/agents"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const accessIcons: Record<string, React.ReactNode> = {
    api: <Terminal className="w-4 h-4" />,
    browser: <Globe className="w-4 h-4" />,
    "open-source": <Zap className="w-4 h-4" />,
    hybrid: <Sparkles className="w-4 h-4" />,
}

export default function AgentDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const agent = agents.find((a) => a.id === id)
    const [reviewText, setReviewText] = useState("")
    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviews, setReviews] = useState<{ text: string; rating: number; date: string }[]>(() => {
        try {
            const raw = localStorage.getItem(`af-reviews-${id}`)
            return raw ? JSON.parse(raw) : []
        } catch { return [] }
    })
    const [sandboxInput, setSandboxInput] = useState("")
    const [sandboxOutput, setSandboxOutput] = useState("")
    const [sandboxLoading, setSandboxLoading] = useState(false)

    if (!agent) {
        return (
            <motion.div className="container mx-auto px-6 pt-24 pb-8 text-center" {...pageTransition}>
                <p className="text-sub text-lg">Agent not found.</p>
                <button onClick={() => navigate("/directory")} className="mt-4 btn-secondary px-5 py-2 rounded-xl cursor-pointer text-sm">Back to Directory</button>
            </motion.div>
        )
    }

    const handleSubmitReview = () => {
        if (!reviewText.trim() || userRating === 0) return
        const cleaned = reviewText.replace(/<[^>]*>/g, "").trim().slice(0, 500)
        const newReview = { text: cleaned, rating: userRating, date: new Date().toLocaleDateString() }
        const updated = [newReview, ...reviews]
        setReviews(updated)
        try { localStorage.setItem(`af-reviews-${id}`, JSON.stringify(updated.slice(0, 50))) } catch { }
        setReviewText("")
        setUserRating(0)
    }

    const handleSandbox = () => {
        if (!sandboxInput.trim()) return
        setSandboxLoading(true)
        setSandboxOutput("")
        setTimeout(() => {
            setSandboxOutput(`[Simulated ${agent.name} response]\n\nBased on your input: "${sandboxInput.slice(0, 100)}"\n\nThis is a simulated response demonstrating how ${agent.name} would process your request. In production, this would connect to the ${agent.name} API to provide a real response.\n\nKey capabilities used: ${agent.capabilities.slice(0, 3).join(", ")}`)
            setSandboxLoading(false)
        }, 1500)
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl" {...pageTransition}>
            {/* Back + Title */}
            <motion.div className="flex items-start gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <button onClick={() => navigate(-1)} className="shrink-0 mt-1 text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{agent.name}</h1>
                        {agent.verified && (
                            <span className="flex items-center gap-1 text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-400/25 px-2.5 py-1 rounded-lg">
                                <Shield className="w-3.5 h-3.5" /> Verified
                            </span>
                        )}
                        <span className="pill text-xs px-3 py-1 rounded-lg">{agent.category}</span>
                    </div>
                    <p className="text-sub mt-2">{agent.description}</p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Info Cards Row */}
                    <motion.div className="grid sm:grid-cols-3 gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                        <div className="glass rounded-xl p-4">
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-1">Pricing</p>
                            <p className="font-bold text-heading text-sm">{agent.pricing}</p>
                            <p className="text-xs text-dim mt-0.5 capitalize">{agent.pricingModel}</p>
                        </div>
                        <div className="glass rounded-xl p-4">
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-1">Access</p>
                            <div className="flex items-center gap-2">
                                {accessIcons[agent.accessType]}
                                <p className="font-bold text-heading text-sm capitalize">{agent.accessType}</p>
                            </div>
                        </div>
                        <div className="glass rounded-xl p-4">
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-1">Rating</p>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="font-bold text-heading text-sm">{agent.rating}</span>
                                <span className="text-xs text-dim">({agent.reviewCount} reviews)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Capabilities */}
                    <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                        <h2 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Capabilities</h2>
                        <div className="flex flex-wrap gap-2">
                            {agent.capabilities.map((cap) => (
                                <span key={cap} className="pill text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Zap className="w-3 h-3 text-blue-400" />{cap}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* LLMs & Industries */}
                    <motion.div className="grid sm:grid-cols-2 gap-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                        <div className="glass rounded-2xl p-5">
                            <h3 className="text-xs font-bold text-dim uppercase tracking-widest mb-3">Supported Models</h3>
                            <div className="flex flex-wrap gap-2">
                                {agent.llms.map((llm) => (
                                    <span key={llm} className="text-xs bg-violet-500/10 border border-violet-400/25 text-violet-300 px-2.5 py-1 rounded-md">{llm}</span>
                                ))}
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-5">
                            <h3 className="text-xs font-bold text-dim uppercase tracking-widest mb-3">Industry Fit</h3>
                            <div className="flex flex-wrap gap-2">
                                {agent.industries.map((ind) => (
                                    <span key={ind} className="text-xs bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 px-2.5 py-1 rounded-md">{ind}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Best For */}
                    <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
                        <h2 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Best For</h2>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {agent.bestFor.map((bf) => (
                                <div key={bf} className="flex items-center gap-2 text-sm text-body">
                                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />{bf}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sandbox */}
                    {agent.sandboxAvailable && (
                        <motion.div className="terminal rounded-2xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Terminal className="w-4 h-4 text-blue-400" />
                                <h2 className="text-sm font-bold text-heading uppercase tracking-wider">Try It Now</h2>
                                <span className="text-[10px] text-dim ml-auto">Sandbox · Simulated</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={sandboxInput} onChange={(e) => setSandboxInput(e.target.value)}
                                    placeholder={`Ask ${agent.name} something...`} maxLength={300}
                                    className="flex-1 input-dark rounded-lg px-4 py-2.5 text-sm font-mono"
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSandbox() }}
                                />
                                <button onClick={handleSandbox} disabled={sandboxLoading || !sandboxInput.trim()}
                                    className="btn-glow px-4 py-2.5 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-medium"
                                >
                                    <Send className="w-3.5 h-3.5" /> Run
                                </button>
                            </div>
                            {(sandboxLoading || sandboxOutput) && (
                                <div className="bg-black/40 rounded-lg p-4 text-sm font-mono text-green-300/80 whitespace-pre-wrap min-h-[80px]">
                                    {sandboxLoading ? (
                                        <span className="text-blue-400 animate-pulse">Processing...</span>
                                    ) : sandboxOutput}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Reviews */}
                    <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.35 }}>
                        <h2 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-400" /> Reviews
                        </h2>
                        {/* Write review */}
                        <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s} onClick={() => setUserRating(s)}
                                        onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                                        className="cursor-pointer p-0.5"
                                    >
                                        <Star className={`w-5 h-5 transition-colors ${s <= (hoverRating || userRating) ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
                                    </button>
                                ))}
                                <span className="text-xs text-dim ml-2">{userRating > 0 ? `${userRating}/5` : "Rate this agent"}</span>
                            </div>
                            <textarea
                                value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review..." maxLength={500} rows={3}
                                className="w-full input-dark rounded-lg px-4 py-3 text-sm resize-none"
                            />
                            <button onClick={handleSubmitReview} disabled={!reviewText.trim() || userRating === 0}
                                className="mt-3 btn-primary px-5 py-2 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Submit Review
                            </button>
                        </div>
                        {/* Review list */}
                        {reviews.length === 0 ? (
                            <p className="text-dim text-sm text-center py-6">No reviews yet. Be the first!</p>
                        ) : (
                            <div className="space-y-3">
                                {reviews.map((r, i) => (
                                    <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-white/15"}`} />)}</div>
                                            <span className="text-xs text-dim">{r.date}</span>
                                        </div>
                                        <p className="text-sm text-body">{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                    <div className="glass rounded-2xl p-5 sticky top-20">
                        <a href={agent.link} target="_blank" rel="noopener noreferrer">
                            <button className="w-full btn-glow px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 mb-3">
                                Visit {agent.name} <ExternalLink className="w-4 h-4" />
                            </button>
                        </a>
                        <button
                            onClick={() => navigate(`/compare?agents=${agent.id}`)}
                            className="w-full btn-secondary px-5 py-3 rounded-xl text-sm font-medium cursor-pointer mb-3"
                        >
                            Compare with Others
                        </button>
                        <button
                            onClick={() => navigate(`/results?q=I need help with ${agent.category.toLowerCase()}`)}
                            className="w-full btn-secondary px-5 py-3 rounded-xl text-sm font-medium cursor-pointer"
                        >
                            Find Similar Agents
                        </button>

                        <div className="mt-5 pt-5 border-t border-white/[0.06]">
                            <p className="text-xs text-dim font-semibold uppercase tracking-widest mb-3">Quick Stats</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-sub">Category</span><span className="text-heading font-medium">{agent.category}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-sub">Access</span><span className="text-heading font-medium capitalize">{agent.accessType}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-sub">Pricing</span><span className="text-heading font-medium capitalize">{agent.pricingModel}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-sub">Models</span><span className="text-heading font-medium">{agent.llms.length}</span></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.main>
    )
}
