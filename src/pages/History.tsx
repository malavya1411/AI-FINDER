import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Trash2, Clock, Search } from "lucide-react"
import { getHistory, clearHistory, type SearchHistoryItem } from "@/lib/matchEngine"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function History() {
    const navigate = useNavigate()
    const [history, setHistory] = useState<SearchHistoryItem[]>(getHistory)

    const handleClear = () => {
        clearHistory()
        setHistory([])
    }

    const formatDate = (ts: number) => {
        const d = new Date(ts)
        const now = Date.now()
        const diff = now - ts
        if (diff < 60000) return "Just now"
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return d.toLocaleDateString()
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-3xl" {...pageTransition}>
            <motion.div className="flex items-center justify-between gap-4 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Search History</h1>
                </div>
                {history.length > 0 && (
                    <button onClick={handleClear} className="btn-secondary px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
                        <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                )}
            </motion.div>

            {history.length === 0 ? (
                <motion.div className="glass rounded-2xl p-12 text-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                    <Search className="w-12 h-12 text-dim mx-auto mb-4" />
                    <p className="text-sub text-lg mb-2">No search history yet</p>
                    <p className="text-dim text-sm mb-4">Your recent searches will appear here.</p>
                    <button onClick={() => navigate("/")} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer">Start Searching</button>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {history.map((item, i) => (
                        <motion.div key={item.id}
                            className="glass rounded-xl p-5 cursor-pointer group"
                            onClick={() => navigate(`/results?q=${encodeURIComponent(item.query)}`)}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-heading group-hover:text-blue-300 transition-colors truncate">{item.query}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-400/20 px-2 py-0.5 rounded">{item.topAgentName}</span>
                                        <span className="text-xs text-dim flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(item.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.main>
    )
}
