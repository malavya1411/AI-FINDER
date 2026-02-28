import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const pricingOptions = ["No preference", "Free", "Freemium", "Usage-based", "Subscription"]
const llmOptions = ["GPT-4o", "GPT-4", "Claude 3.5", "Claude 3 Opus", "Gemini", "Llama 3", "Mistral"]
const levels = ["Beginner", "Intermediate", "Expert"]
const domains = ["Software Development", "Marketing", "Content Creation", "Research", "Data Analysis", "Design", "Education", "Finance", "Healthcare", "General"]

export default function Profile() {
    const navigate = useNavigate()
    const [saved, setSaved] = useState(false)
    const [prefs, setPrefs] = useState(() => {
        try { const r = localStorage.getItem("af-prefs"); return r ? JSON.parse(r) : { pricing: "No preference", llms: [] as string[], level: "Intermediate", domain: "General" } }
        catch { return { pricing: "No preference", llms: [] as string[], level: "Intermediate", domain: "General" } }
    })

    const toggleLLM = (llm: string) => {
        setPrefs((p: typeof prefs) => ({
            ...p, llms: p.llms.includes(llm) ? p.llms.filter((l: string) => l !== llm) : [...p.llms, llm]
        }))
    }

    const handleSave = () => {
        try { localStorage.setItem("af-prefs", JSON.stringify(prefs)) } catch { }
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <motion.main className="container mx-auto px-6 pt-24 pb-12 max-w-2xl" {...pageTransition}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={() => navigate("/")} className="text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-3xl font-bold text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Preferences</h1>
            </motion.div>

            <motion.div className="glass rounded-2xl p-6 space-y-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                {/* Technical Level */}
                <div>
                    <p className="text-xs text-dim font-semibold uppercase tracking-widest mb-3">Technical Level</p>
                    <div className="flex gap-2">
                        {levels.map(l => (
                            <button key={l} onClick={() => setPrefs((p: typeof prefs) => ({ ...p, level: l }))}
                                className={`flex-1 text-sm py-2.5 rounded-xl cursor-pointer transition-all font-medium ${prefs.level === l ? "btn-primary" : "btn-secondary"}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preferred Pricing */}
                <div>
                    <p className="text-xs text-dim font-semibold uppercase tracking-widest mb-3">Preferred Pricing</p>
                    <select value={prefs.pricing} onChange={e => setPrefs((p: typeof prefs) => ({ ...p, pricing: e.target.value }))}
                        className="w-full input-dark rounded-lg px-4 py-3 text-sm cursor-pointer appearance-none">
                        {pricingOptions.map(o => <option key={o} value={o} className="bg-[#0a0f1e]">{o}</option>)}
                    </select>
                </div>

                {/* Domain */}
                <div>
                    <p className="text-xs text-dim font-semibold uppercase tracking-widest mb-3">Domain of Work</p>
                    <select value={prefs.domain} onChange={e => setPrefs((p: typeof prefs) => ({ ...p, domain: e.target.value }))}
                        className="w-full input-dark rounded-lg px-4 py-3 text-sm cursor-pointer appearance-none">
                        {domains.map(d => <option key={d} value={d} className="bg-[#0a0f1e]">{d}</option>)}
                    </select>
                </div>

                {/* Preferred LLMs */}
                <div>
                    <p className="text-xs text-dim font-semibold uppercase tracking-widest mb-3">Preferred LLMs</p>
                    <div className="flex flex-wrap gap-2">
                        {llmOptions.map(llm => (
                            <button key={llm} onClick={() => toggleLLM(llm)}
                                className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all ${prefs.llms.includes(llm) ? "pill-active" : "pill"}`}>
                                {llm}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save */}
                <button onClick={handleSave}
                    className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl cursor-pointer text-sm transition-all ${saved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "btn-glow"}`}>
                    {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
                </button>

                <p className="text-xs text-dim leading-relaxed">
                    Your preferences will be used to personalize agent recommendations. They're stored locally and never shared.
                </p>
            </motion.div>
        </motion.main>
    )
}
