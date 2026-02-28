import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Heart, Bookmark, ChevronRight, Send, ArrowUpRight, Sparkles } from "lucide-react"
import { recipes, type Recipe } from "@/data/recipes"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Community() {
    const navigate = useNavigate()
    const [upvoted, setUpvoted] = useState<Set<string>>(new Set())
    const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
    const [showSubmit, setShowSubmit] = useState(false)
    const [submitForm, setSubmitForm] = useState({ title: "", description: "", agents: "", prompts: "", outcome: "" })

    const toggleUpvote = (id: string) => setUpvoted(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    const toggleBookmark = (id: string) => setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

    const handleSubmitRecipe = () => {
        if (!submitForm.title.trim() || !submitForm.description.trim()) return
        setShowSubmit(false)
        setSubmitForm({ title: "", description: "", agents: "", prompts: "", outcome: "" })
    }

    const daysAgo = (ts: number) => {
        const d = Math.floor((Date.now() - ts) / 86400000)
        return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-6xl" {...pageTransition}>
            <motion.div className="flex items-start justify-between gap-4 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-start gap-3">
                    <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer mt-1"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Community Recipes</h1>
                        <p className="text-sub text-sm mt-1">Discover workflows shared by the Agent Finder community</p>
                    </div>
                </div>
                <button onClick={() => setShowSubmit(!showSubmit)}
                    className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-2 shrink-0">
                    <Sparkles className="w-4 h-4" /> Share Workflow
                </button>
            </motion.div>

            {/* Submit Form */}
            {showSubmit && (
                <motion.div className="glass rounded-2xl p-6 mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Share Your Workflow</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs text-dim mb-1.5 block">Title</label>
                            <input value={submitForm.title} onChange={e => setSubmitForm(p => ({ ...p, title: e.target.value }))}
                                placeholder="My AI Workflow" maxLength={100} className="w-full input-dark rounded-lg px-4 py-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs text-dim mb-1.5 block">Agents Used</label>
                            <input value={submitForm.agents} onChange={e => setSubmitForm(p => ({ ...p, agents: e.target.value }))}
                                placeholder="ChatGPT, Midjourney, ..." maxLength={200} className="w-full input-dark rounded-lg px-4 py-2.5 text-sm" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-dim mb-1.5 block">Description</label>
                        <textarea value={submitForm.description} onChange={e => setSubmitForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe your workflow..." maxLength={500} rows={3}
                            className="w-full input-dark rounded-lg px-4 py-2.5 text-sm resize-none" />
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-dim mb-1.5 block">Prompt Chain (one per line)</label>
                        <textarea value={submitForm.prompts} onChange={e => setSubmitForm(p => ({ ...p, prompts: e.target.value }))}
                            placeholder={"Step 1: Generate ideas...\nStep 2: Write draft...\nStep 3: Create visuals..."} maxLength={1000} rows={3}
                            className="w-full input-dark rounded-lg px-4 py-2.5 text-sm resize-none font-mono" />
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-dim mb-1.5 block">Outcome</label>
                        <input value={submitForm.outcome} onChange={e => setSubmitForm(p => ({ ...p, outcome: e.target.value }))}
                            placeholder="What did you achieve?" maxLength={300} className="w-full input-dark rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSubmitRecipe} className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2"><Send className="w-3.5 h-3.5" /> Submit</button>
                        <button onClick={() => setShowSubmit(false)} className="btn-secondary px-5 py-2.5 rounded-lg text-sm cursor-pointer">Cancel</button>
                    </div>
                </motion.div>
            )}

            {/* Recipe Grid */}
            <div className="grid md:grid-cols-2 gap-5">
                {recipes.map((recipe, i) => (
                    <motion.div key={recipe.id} className="glass rounded-2xl p-6 flex flex-col"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <h3 className="font-bold text-heading text-lg mb-1">{recipe.title}</h3>
                                <p className="text-xs text-dim">by {recipe.author} · {daysAgo(recipe.createdAt)}</p>
                            </div>
                        </div>
                        <p className="text-sm text-sub mb-4 line-clamp-2">{recipe.description}</p>

                        {/* Agents used */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {recipe.agentNames.map(name => (
                                <span key={name} className="text-xs bg-blue-500/10 text-blue-300 border border-blue-400/20 px-2.5 py-1 rounded-md">{name}</span>
                            ))}
                        </div>

                        {/* Prompt chain */}
                        <div className="bg-white/[0.03] rounded-xl p-4 mb-4 border border-white/[0.05] flex-1">
                            <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-2.5">Prompt Chain</p>
                            <div className="space-y-2">
                                {recipe.promptChain.map((step, j) => (
                                    <div key={j} className="flex items-start gap-2">
                                        <span className="text-[11px] font-mono text-blue-400 shrink-0 mt-0.5">{j + 1}.</span>
                                        <p className="text-xs text-body leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Outcome */}
                        <div className="flex items-start gap-2 mb-4 px-1">
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-emerald-300/70">{recipe.outcome}</p>
                        </div>

                        {/* Tags + Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                            <div className="flex gap-1.5">
                                {recipe.tags.map(t => <span key={t} className="text-[11px] pill px-2 py-0.5 rounded">{t}</span>)}
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleUpvote(recipe.id)}
                                    className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${upvoted.has(recipe.id) ? "text-red-400" : "text-dim hover:text-red-400"}`}>
                                    <Heart className={`w-3.5 h-3.5 ${upvoted.has(recipe.id) ? "fill-red-400" : ""}`} />
                                    {recipe.upvotes + (upvoted.has(recipe.id) ? 1 : 0)}
                                </button>
                                <button onClick={() => toggleBookmark(recipe.id)}
                                    className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${bookmarked.has(recipe.id) ? "text-blue-400" : "text-dim hover:text-blue-400"}`}>
                                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked.has(recipe.id) ? "fill-blue-400" : ""}`} />
                                    {recipe.bookmarks + (bookmarked.has(recipe.id) ? 1 : 0)}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.main>
    )
}
