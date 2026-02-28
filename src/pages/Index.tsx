import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles, TrendingUp, Star, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { categories, agents } from "@/data/agents"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Index() {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const trending = agents.find(a => a.weeklyTrending) || agents[0]

    const handleSubmit = () => {
        const clean = query.trim().replace(/<[^>]*>/g, "").slice(0, 500)
        if (!clean) return
        navigate(`/results?q=${encodeURIComponent(clean)}`)
    }

    return (
        <motion.main className="flex-1 flex flex-col items-center px-4 pb-20" style={{ paddingTop: "100px" }} {...pageTransition}>
            {/* Hero Headline */}
            <motion.h1
                className="font-bold tracking-[-0.02em] text-heading text-center"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(36px, 5vw, 56px)",
                    lineHeight: 1.1,
                    maxWidth: "700px",
                    margin: "0 auto",
                }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            >
                Find the perfect AI agent for your problem
            </motion.h1>

            {/* Tagline */}
            <motion.p
                className="text-center"
                style={{
                    fontSize: "16px",
                    lineHeight: 1.6,
                    maxWidth: "480px",
                    margin: "16px auto 0",
                    color: "rgba(255,255,255,0.6)",
                }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            >
                Tell us your problem. We'll find the right AI agent, stack, and prompt.
            </motion.p>

            {/* Search */}
            <motion.div
                className="w-full"
                style={{ maxWidth: "620px", margin: "32px auto 0" }}
                initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            >
                <div className="flex items-center glass-strong rounded-full px-2 py-1.5 shadow-lg shadow-black/20">
                    <input
                        type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                        placeholder='Describe your problem... e.g., "I want to build a SaaS dashboard"'
                        maxLength={500}
                        className="flex-1 bg-transparent text-white placeholder:text-white/35 text-sm sm:text-base px-4 py-2.5 outline-none"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit() } }}
                    />
                    <button
                        onClick={handleSubmit} disabled={!query.trim()}
                        className="shrink-0 flex items-center gap-2 btn-primary text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Find AI Agent <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Category Chips */}
            <motion.div
                className="flex flex-wrap justify-center"
                style={{ gap: "10px", marginTop: "20px" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }}
            >
                {categories.map((cat, i) => (
                    <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
                    >
                        <Badge
                            variant="outline"
                            className="cursor-pointer pill hover:pill-active transition-all px-4 py-1.5 text-sm backdrop-blur-sm"
                            onClick={() => setQuery(`I need help with ${cat.toLowerCase()}`)}
                        >
                            {cat}
                        </Badge>
                    </motion.div>
                ))}
            </motion.div>

            {/* Agent of the Week */}
            <motion.div
                className="w-full"
                style={{ maxWidth: "680px", margin: "48px auto 0" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            >
                {/* Subtle separator */}
                <div className="w-24 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }} />

                <div className="glass gradient-border rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Agent of the Week</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-lg font-bold text-heading">{trending.name}</h3>
                                {trending.verified && (
                                    <span className="text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-400/25 px-2 py-0.5 rounded-md">✓ Verified</span>
                                )}
                                <span className="pill text-xs px-2.5 py-0.5 rounded-md">{trending.category}</span>
                            </div>
                            <p className="text-sm text-sub mb-3 line-clamp-2">{trending.description}</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-semibold text-heading">{trending.rating}</span>
                                    <span className="text-xs text-dim">({trending.reviewCount})</span>
                                </div>
                                <span className="text-xs text-dim">{trending.pricing}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                            <button
                                onClick={() => navigate(`/agent/${trending.id}`)}
                                className="text-xs font-medium px-4 py-2 rounded-lg btn-primary cursor-pointer flex items-center gap-1.5"
                            >
                                Learn More <Sparkles className="w-3 h-3" />
                            </button>
                            <a href={trending.link} target="_blank" rel="noopener noreferrer">
                                <button className="w-full text-xs font-medium px-4 py-2 rounded-lg btn-secondary cursor-pointer flex items-center gap-1.5">
                                    Visit <ExternalLink className="w-3 h-3" />
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.main>
    )
}
