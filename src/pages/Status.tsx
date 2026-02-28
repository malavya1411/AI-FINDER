import { Activity, ArrowLeft, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { agentStatuses } from "@/data/agentStatus"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const statusIcon: Record<string, React.ReactNode> = {
    operational: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    degraded: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    down: <XCircle className="w-4 h-4 text-red-400" />,
}
const statusLabel: Record<string, string> = {
    operational: "Operational",
    degraded: "Degraded",
    down: "Down",
}
const statusColor: Record<string, string> = {
    operational: "text-emerald-400",
    degraded: "text-amber-400",
    down: "text-red-400",
}

export default function Status() {
    const navigate = useNavigate()
    const operational = agentStatuses.filter(s => s.status === "operational").length
    const degraded = agentStatuses.filter(s => s.status === "degraded").length
    const down = agentStatuses.filter(s => s.status === "down").length

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl" {...pageTransition}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <div>
                    <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agent Status</h1>
                    <p className="text-sub text-sm mt-1">Real-time availability of AI agents</p>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div className="grid grid-cols-3 gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                <div className="glass rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{operational}</p>
                    <p className="text-xs text-dim mt-0.5">Operational</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{degraded}</p>
                    <p className="text-xs text-dim mt-0.5">Degraded</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">{down}</p>
                    <p className="text-xs text-dim mt-0.5">Down</p>
                </div>
            </motion.div>

            {/* Status Table */}
            <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                {/* Header */}
                <div className="grid grid-cols-[1fr_120px_100px_140px_140px] px-6 py-3 border-b border-white/[0.06]">
                    <span className="text-[11px] text-dim font-semibold uppercase tracking-widest">Agent</span>
                    <span className="text-[11px] text-dim font-semibold uppercase tracking-widest">Status</span>
                    <span className="text-[11px] text-dim font-semibold uppercase tracking-widest text-right">Uptime</span>
                    <span className="text-[11px] text-dim font-semibold uppercase tracking-widest text-right">Latency</span>
                    <span className="text-[11px] text-dim font-semibold uppercase tracking-widest text-right">Last Check</span>
                </div>
                {/* Rows */}
                {agentStatuses.map((entry, i) => (
                    <motion.div key={entry.agentId}
                        className={`grid grid-cols-[1fr_120px_100px_140px_140px] px-6 py-4 border-b border-white/[0.04] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition-colors cursor-pointer`}
                        onClick={() => navigate(`/agent/${entry.agentId}`)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.15 + i * 0.03 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-medium text-sm text-heading">{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {statusIcon[entry.status]}
                            <span className={`text-sm font-medium ${statusColor[entry.status]}`}>{statusLabel[entry.status]}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-body font-mono">{entry.uptime}%</span>
                        </div>
                        <div className="text-right">
                            {entry.status === "down" ? (
                                <span className="text-sm text-dim">—</span>
                            ) : (
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                        <div className="h-full rounded-full" style={{
                                            width: `${Math.min(100, (entry.latency / 1500) * 100)}%`,
                                            background: entry.latency < 300 ? "#22c55e" : entry.latency < 600 ? "#f59e0b" : "#ef4444",
                                        }} />
                                    </div>
                                    <span className="text-sm font-mono text-body">{entry.latency}ms</span>
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-dim flex items-center justify-end gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.round((Date.now() - entry.lastChecked) / 60000)}m ago
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Incidents */}
            {agentStatuses.filter(s => s.incidents?.length).map(entry => (
                <motion.div key={entry.agentId} className="glass rounded-xl p-5 mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                    <div className="flex items-center gap-2 mb-3">
                        {statusIcon[entry.status]}
                        <span className="text-sm font-semibold text-heading">{entry.name}</span>
                        <span className={`text-xs ${statusColor[entry.status]}`}>{statusLabel[entry.status]}</span>
                    </div>
                    {entry.incidents!.map((inc, i) => (
                        <p key={i} className="text-sm text-sub pl-6 mb-1">• {inc}</p>
                    ))}
                </motion.div>
            ))}
        </motion.main>
    )
}
