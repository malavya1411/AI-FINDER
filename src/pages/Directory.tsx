import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ExternalLink, Star, Shield, Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react"
import { agents, categories, industryTags, capabilityTags, type Agent } from "@/data/agents"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const pricingModels = ["free", "freemium", "usage-based", "subscription"]
const accessTypes = ["api", "browser", "open-source", "hybrid"]

export default function Directory() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedPricing, setSelectedPricing] = useState<string[]>([])
    const [selectedAccess, setSelectedAccess] = useState<string[]>([])
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
    const [selectedCaps, setSelectedCaps] = useState<string[]>([])
    const [compareList, setCompareList] = useState<string[]>([])

    const toggleFilter = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
        setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
    }

    const hasActiveFilters = selectedPricing.length + selectedAccess.length + selectedIndustries.length + selectedCaps.length > 0
    const clearFilters = () => { setSelectedPricing([]); setSelectedAccess([]); setSelectedIndustries([]); setSelectedCaps([]) }

    const filtered = useMemo(() => {
        let list = agents
        const cleanSearch = search.replace(/<[^>]*>/g, "").trim().toLowerCase()
        if (cleanSearch) {
            list = list.filter(a => a.name.toLowerCase().includes(cleanSearch) || a.description.toLowerCase().includes(cleanSearch) || a.keywords.some(k => k.includes(cleanSearch)))
        }
        if (category !== "All") list = list.filter(a => a.category === category)
        if (selectedPricing.length) list = list.filter(a => selectedPricing.includes(a.pricingModel))
        if (selectedAccess.length) list = list.filter(a => selectedAccess.includes(a.accessType))
        if (selectedIndustries.length) list = list.filter(a => a.industries.some(i => selectedIndustries.includes(i)))
        if (selectedCaps.length) list = list.filter(a => selectedCaps.some(c => a.capabilities.some(cap => cap.toLowerCase().includes(c.toLowerCase()))))
        return list
    }, [search, category, selectedPricing, selectedAccess, selectedIndustries, selectedCaps])

    const toggleCompare = (id: string) => {
        setCompareList(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev)
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12" {...pageTransition}>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <h1 className="text-3xl font-bold text-heading mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agent Directory</h1>
                <p className="text-sub">Browse our curated catalog of {agents.length} AI tools and agents.</p>
            </motion.div>

            {/* Search + Filter toggle */}
            <motion.div className="flex gap-3 mb-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..."
                        maxLength={200} className="w-full input-dark rounded-xl pl-11 pr-4 py-3 text-sm" />
                </div>
                <button onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 rounded-xl text-sm font-medium cursor-pointer transition-all ${showFilters ? "btn-primary" : "btn-secondary"}`}>
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                </button>
            </motion.div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <motion.div className="glass rounded-2xl p-5 mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-heading">Advanced Filters</h3>
                        {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Clear all</button>}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div>
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-2.5">Pricing Model</p>
                            <div className="flex flex-wrap gap-1.5">
                                {pricingModels.map(p => (
                                    <button key={p} onClick={() => toggleFilter(selectedPricing, setSelectedPricing, p)}
                                        className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all capitalize ${selectedPricing.includes(p) ? "pill-active" : "pill"}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-2.5">Access Type</p>
                            <div className="flex flex-wrap gap-1.5">
                                {accessTypes.map(a => (
                                    <button key={a} onClick={() => toggleFilter(selectedAccess, setSelectedAccess, a)}
                                        className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all capitalize ${selectedAccess.includes(a) ? "pill-active" : "pill"}`}>
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-2.5">Industry</p>
                            <div className="flex flex-wrap gap-1.5">
                                {industryTags.slice(0, 8).map(i => (
                                    <button key={i} onClick={() => toggleFilter(selectedIndustries, setSelectedIndustries, i)}
                                        className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all ${selectedIndustries.includes(i) ? "pill-active" : "pill"}`}>
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-2.5">Capabilities</p>
                            <div className="flex flex-wrap gap-1.5">
                                {capabilityTags.slice(0, 8).map(c => (
                                    <button key={c} onClick={() => toggleFilter(selectedCaps, setSelectedCaps, c)}
                                        className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all ${selectedCaps.includes(c) ? "pill-active" : "pill"}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Category Chips */}
            <motion.div className="flex flex-wrap gap-2 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
                <button onClick={() => setCategory("All")}
                    className={`text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all ${category === "All" ? "pill-active" : "pill"}`}>
                    All
                </button>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all ${category === cat ? "pill-active" : "pill"}`}>
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Results count */}
            <p className="text-xs text-dim mb-4">{filtered.length} agent{filtered.length !== 1 ? "s" : ""} found</p>

            {/* Agent Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((agent, i) => (
                    <motion.div key={agent.id}
                        className="glass rounded-2xl p-5 flex flex-col cursor-pointer group"
                        onClick={() => navigate(`/agent/${agent.id}`)}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
                    >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-heading group-hover:text-blue-300 transition-colors">{agent.name}</h3>
                                    {agent.verified && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                                </div>
                                <p className="text-xs text-sub line-clamp-2">{agent.description}</p>
                            </div>
                        </div>

                        {/* Rating + Category */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-heading">{agent.rating}</span>
                                <span className="text-xs text-dim">({agent.reviewCount})</span>
                            </div>
                            <span className="pill text-xs px-2.5 py-0.5 rounded-md">{agent.category}</span>
                        </div>

                        {/* Best for tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                            {agent.bestFor.slice(0, 3).map(bf => (
                                <span key={bf} className="text-[11px] pill px-2 py-0.5 rounded">{bf}</span>
                            ))}
                            {agent.bestFor.length > 3 && <span className="text-[11px] text-dim">+{agent.bestFor.length - 3}</span>}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                            <span className="text-xs text-dim">{agent.pricing}</span>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button onClick={() => toggleCompare(agent.id)}
                                    className={`text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-all ${compareList.includes(agent.id) ? "pill-active" : "pill"}`}>
                                    {compareList.includes(agent.id) ? "✓ Compare" : "Compare"}
                                </button>
                                <a href={agent.link} target="_blank" rel="noopener noreferrer">
                                    <button className="pill text-xs px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 hover:pill-active transition-all">
                                        Visit <ExternalLink className="w-3 h-3" />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center mt-4">
                    <p className="text-sub">No agents match your filters.</p>
                    <button onClick={clearFilters} className="mt-3 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">Clear all filters</button>
                </div>
            )}

            {/* Compare floating bar */}
            {compareList.length >= 2 && (
                <motion.div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl shadow-black/40"
                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20 }}>
                    <span className="text-sm text-body font-medium">{compareList.length} agents selected</span>
                    <button onClick={() => navigate(`/compare?agents=${compareList.join(",")}`)}
                        className="btn-glow px-5 py-2 rounded-full text-sm font-semibold cursor-pointer">
                        Compare Now
                    </button>
                    <button onClick={() => setCompareList([])} className="text-dim hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </motion.div>
            )}
        </motion.main>
    )
}
