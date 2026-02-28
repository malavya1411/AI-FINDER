import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useMemo } from "react"
import { ArrowLeft, Plus, X, Star, Shield, Zap, Check, Minus, Crown } from "lucide-react"
import { agents, type Agent } from "@/data/agents"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Compare() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const selectedIds = useMemo(() => (searchParams.get("agents") || "").split(",").filter(Boolean), [searchParams])
    const selected = useMemo(() => selectedIds.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[], [selectedIds])
    const [showPicker, setShowPicker] = useState(false)
    const [pickerSearch, setPickerSearch] = useState("")

    const addAgent = (id: string) => {
        if (selectedIds.length >= 3 || selectedIds.includes(id)) return
        setSearchParams({ agents: [...selectedIds, id].join(",") })
        setShowPicker(false)
        setPickerSearch("")
    }
    const removeAgent = (id: string) => {
        setSearchParams({ agents: selectedIds.filter(i => i !== id).join(",") })
    }

    const pickable = agents.filter(a => !selectedIds.includes(a.id) && (pickerSearch === "" || a.name.toLowerCase().includes(pickerSearch.toLowerCase())))

    // Determine winner per row
    const bestRating = selected.length > 0 ? Math.max(...selected.map(a => a.rating)) : 0
    const bestCaps = selected.length > 0 ? Math.max(...selected.map(a => a.capabilities.length)) : 0
    const bestReviews = selected.length > 0 ? Math.max(...selected.map(a => a.reviewCount)) : 0

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl" {...pageTransition}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={() => navigate(-1)} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Compare Agents</h1>
            </motion.div>

            {/* Agent selector */}
            <motion.div className="flex flex-wrap gap-3 mb-8 items-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                {selected.map(a => (
                    <div key={a.id} className="glass rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-heading">{a.name}</span>
                        <button onClick={() => removeAgent(a.id)} className="text-dim hover:text-red-400 transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </div>
                ))}
                {selected.length < 3 && (
                    <div className="relative">
                        <button onClick={() => setShowPicker(!showPicker)} className="pill hover:pill-active rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm cursor-pointer transition-all">
                            <Plus className="w-4 h-4" /> Add Agent
                        </button>
                        {showPicker && (
                            <div className="absolute top-full mt-2 left-0 w-72 glass-strong rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
                                <input value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} placeholder="Search agents..." className="w-full input-dark border-0 border-b border-white/[0.06] px-4 py-3 text-sm rounded-none" />
                                <div className="max-h-60 overflow-y-auto p-2">
                                    {pickable.slice(0, 10).map(a => (
                                        <button key={a.id} onClick={() => addAgent(a.id)}
                                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-body hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center justify-between">
                                            <span>{a.name}</span>
                                            <span className="text-xs text-dim">{a.category}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {selected.length < 2 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-sub">Select at least 2 agents to compare.</p>
                    <p className="text-dim text-sm mt-1">You can compare up to 3 agents side by side.</p>
                </div>
            ) : (
                <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                    {/* Header */}
                    <div className="grid border-b border-white/[0.06]" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                        <div className="p-5 flex items-center">
                            <span className="text-xs text-dim font-semibold uppercase tracking-widest">Feature</span>
                        </div>
                        {selected.map(a => (
                            <div key={a.id} className={`p-5 text-center ${a.rating === bestRating ? "winner-glow bg-blue-500/[0.03]" : ""}`}>
                                <p className="font-bold text-heading text-sm flex items-center justify-center gap-2">
                                    {a.rating === bestRating && selected.length > 1 && <Crown className="w-4 h-4 text-amber-400" />}
                                    {a.name}
                                </p>
                                <p className="text-xs text-dim mt-0.5">{a.category}</p>
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {[
                        {
                            label: "Rating", render: (a: Agent) => (
                                <div className={`flex items-center justify-center gap-1 ${a.rating === bestRating ? "text-amber-400" : "text-body"}`}>
                                    <Star className="w-3.5 h-3.5 fill-current" /> {a.rating} <span className="text-xs text-dim">({a.reviewCount})</span>
                                </div>
                            ), isBest: (a: Agent) => a.rating === bestRating
                        },
                        { label: "Pricing", render: (a: Agent) => <span className="text-body text-sm">{a.pricing}</span>, isBest: () => false },
                        {
                            label: "Pricing Model", render: (a: Agent) => <span className="text-body text-sm capitalize">{a.pricingModel}</span>,
                            isBest: (a: Agent) => a.pricingModel === "free"
                        },
                        { label: "Access Type", render: (a: Agent) => <span className="text-body text-sm capitalize">{a.accessType}</span>, isBest: () => false },
                        { label: "LLMs", render: (a: Agent) => <div className="flex flex-wrap justify-center gap-1">{a.llms.map(l => <span key={l} className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-400/20 px-2 py-0.5 rounded">{l}</span>)}</div>, isBest: () => false },
                        {
                            label: "Capabilities", render: (a: Agent) => <span className="text-body text-sm">{a.capabilities.length} features</span>,
                            isBest: (a: Agent) => a.capabilities.length === bestCaps
                        },
                        { label: "Industries", render: (a: Agent) => <div className="flex flex-wrap justify-center gap-1">{a.industries.map(i => <span key={i} className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-2 py-0.5 rounded">{i}</span>)}</div>, isBest: () => false },
                        { label: "Verified", render: (a: Agent) => a.verified ? <Check className="w-4 h-4 text-blue-400 mx-auto" /> : <Minus className="w-4 h-4 text-dim mx-auto" />, isBest: (a: Agent) => a.verified },
                        { label: "Sandbox", render: (a: Agent) => a.sandboxAvailable ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-dim mx-auto" />, isBest: (a: Agent) => a.sandboxAvailable },
                        {
                            label: "Reviews", render: (a: Agent) => <span className="text-body text-sm">{a.reviewCount.toLocaleString()}</span>,
                            isBest: (a: Agent) => a.reviewCount === bestReviews
                        },
                    ].map((row, i) => (
                        <div key={row.label} className={`grid border-b border-white/[0.04] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}
                            style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                            <div className="p-4 flex items-center">
                                <span className="text-xs font-semibold text-sub uppercase tracking-wider">{row.label}</span>
                            </div>
                            {selected.map(a => (
                                <div key={a.id} className={`p-4 flex items-center justify-center text-center ${row.isBest(a) ? "winner-glow bg-blue-500/[0.03]" : ""}`}>
                                    {row.render(a)}
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.main>
    )
}
