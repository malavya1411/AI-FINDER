import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, Send, CheckCircle, BarChart3, Eye, MousePointerClick } from "lucide-react"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

interface Submission { name: string; description: string; status: "pending" | "approved"; views: number; clicks: number; createdAt: string }

export default function SubmitAgent() {
    const navigate = useNavigate()
    const [submitted, setSubmitted] = useState(false)
    const [tab, setTab] = useState<"form" | "dashboard">("form")
    const [form, setForm] = useState({ name: "", description: "", capabilities: "", pricing: "", apiAvailable: false, llms: "", logo: "" })
    const [submissions, setSubmissions] = useState<Submission[]>(() => {
        try { const r = localStorage.getItem("af-submissions"); return r ? JSON.parse(r) : [] } catch { return [] }
    })

    const handleSubmit = () => {
        if (!form.name.trim() || !form.description.trim()) return
        const sub: Submission = {
            name: form.name.replace(/<[^>]*>/g, "").trim().slice(0, 100),
            description: form.description.replace(/<[^>]*>/g, "").trim().slice(0, 500),
            status: "pending", views: Math.floor(Math.random() * 200), clicks: Math.floor(Math.random() * 50),
            createdAt: new Date().toLocaleDateString()
        }
        const updated = [sub, ...submissions]
        setSubmissions(updated)
        try { localStorage.setItem("af-submissions", JSON.stringify(updated.slice(0, 20))) } catch { }
        setSubmitted(true)
        setForm({ name: "", description: "", capabilities: "", pricing: "", apiAvailable: false, llms: "", logo: "" })
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-3xl" {...pageTransition}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Submit an Agent</h1>
            </motion.div>

            {/* Tab selector */}
            <div className="flex gap-2 mb-8">
                <button onClick={() => setTab("form")}
                    className={`text-sm px-4 py-2 rounded-lg cursor-pointer transition-all ${tab === "form" ? "btn-primary" : "btn-secondary"}`}>
                    Submit New
                </button>
                <button onClick={() => setTab("dashboard")}
                    className={`text-sm px-4 py-2 rounded-lg cursor-pointer transition-all ${tab === "dashboard" ? "btn-primary" : "btn-secondary"}`}>
                    My Submissions ({submissions.length})
                </button>
            </div>

            {tab === "form" ? (
                <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                    {submitted && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/25 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <p className="text-sm text-emerald-300">Agent submitted! It will be reviewed before publishing.</p>
                        </div>
                    )}
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Agent Name *</label>
                            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g., MyAI Assistant" maxLength={100} className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Description *</label>
                            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="Describe what your agent does..." maxLength={500} rows={3}
                                className="w-full input-dark rounded-lg px-4 py-3 text-sm resize-none" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Capabilities</label>
                                <input value={form.capabilities} onChange={e => setForm(p => ({ ...p, capabilities: e.target.value }))}
                                    placeholder="Code gen, Writing, ..." maxLength={200} className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Pricing</label>
                                <input value={form.pricing} onChange={e => setForm(p => ({ ...p, pricing: e.target.value }))}
                                    placeholder="Free / Pro $10/mo" maxLength={100} className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Supported LLMs</label>
                                <input value={form.llms} onChange={e => setForm(p => ({ ...p, llms: e.target.value }))}
                                    placeholder="GPT-4, Claude 3, ..." maxLength={200} className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Logo URL</label>
                                <input value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))}
                                    placeholder="https://..." maxLength={300} className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                            </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.apiAvailable} onChange={e => setForm(p => ({ ...p, apiAvailable: e.target.checked }))}
                                className="w-4 h-4 rounded accent-blue-500" />
                            <span className="text-sm text-body">API available for integration</span>
                        </label>
                        <button onClick={handleSubmit} disabled={!form.name.trim() || !form.description.trim()}
                            className="btn-glow px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                            <Send className="w-4 h-4" /> Submit for Review
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {submissions.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <p className="text-sub">No submissions yet.</p>
                            <button onClick={() => setTab("form")} className="mt-3 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">Submit your first agent</button>
                        </div>
                    ) : submissions.map((sub, i) => (
                        <motion.div key={i} className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-heading">{sub.name}</h3>
                                        <span className={`text-[11px] px-2 py-0.5 rounded ${sub.status === "approved" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/25" : "bg-amber-500/15 text-amber-400 border border-amber-400/25"}`}>
                                            {sub.status === "approved" ? "Approved" : "Pending Review"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-sub line-clamp-1">{sub.description}</p>
                                    <p className="text-xs text-dim mt-1">Submitted {sub.createdAt}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-sub"><Eye className="w-3.5 h-3.5" /><span className="text-sm font-semibold">{sub.views}</span></div>
                                        <p className="text-[10px] text-dim">Views</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-sub"><MousePointerClick className="w-3.5 h-3.5" /><span className="text-sm font-semibold">{sub.clicks}</span></div>
                                        <p className="text-[10px] text-dim">Clicks</p>
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
