import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Trash2, Play, Edit3, Tag, Layers, Clock } from "lucide-react"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export interface SavedTemplate {
    id: string
    name: string
    query: string
    agents: string[]
    techStack?: string
    tags: string[]
    createdAt: number
}

export default function Dashboard() {
    const navigate = useNavigate()
    const [templates, setTemplates] = useState<SavedTemplate[]>(() => {
        try { const r = localStorage.getItem("af-templates"); return r ? JSON.parse(r) : [] } catch { return [] }
    })

    const deleteTemplate = (id: string) => {
        const updated = templates.filter(t => t.id !== id)
        setTemplates(updated)
        try { localStorage.setItem("af-templates", JSON.stringify(updated)) } catch { }
    }

    const rerun = (template: SavedTemplate) => {
        navigate(`/results?q=${encodeURIComponent(template.query)}`)
    }

    const daysAgo = (ts: number) => {
        const d = Math.floor((Date.now() - ts) / 86400000)
        return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-4xl" {...pageTransition}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <div>
                    <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Saved Templates</h1>
                    <p className="text-sub text-sm mt-1">Your saved agent combinations and workflows</p>
                </div>
            </motion.div>

            {templates.length === 0 ? (
                <motion.div className="glass rounded-2xl p-12 text-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                    <Layers className="w-12 h-12 text-dim mx-auto mb-4" />
                    <p className="text-sub text-lg mb-2">No saved templates yet</p>
                    <p className="text-dim text-sm mb-4">Search for AI agents and save your favorite combinations as templates.</p>
                    <button onClick={() => navigate("/")} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer">Find AI Agents</button>
                </motion.div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {templates.map((template, i) => (
                        <motion.div key={template.id} className="glass rounded-2xl p-5"
                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="font-bold text-heading">{template.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => rerun(template)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-sub hover:text-white transition-colors cursor-pointer" title="Re-run">
                                        <Play className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => deleteTemplate(template.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-sub hover:text-red-400 transition-colors cursor-pointer" title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-sub line-clamp-2 mb-3">{template.query}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {template.agents.map(a => (
                                    <span key={a} className="text-xs bg-blue-500/10 text-blue-300 border border-blue-400/20 px-2 py-0.5 rounded">{a}</span>
                                ))}
                            </div>
                            {template.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {template.tags.map(t => (
                                        <span key={t} className="text-[11px] pill px-2 py-0.5 rounded flex items-center gap-1">
                                            <Tag className="w-2.5 h-2.5" />{t}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-dim pt-3 border-t border-white/[0.06]">
                                <Clock className="w-3 h-3" /> {daysAgo(template.createdAt)}
                                {template.techStack && <span className="ml-auto pill px-2 py-0.5 rounded text-[11px]">{template.techStack}</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.main>
    )
}
