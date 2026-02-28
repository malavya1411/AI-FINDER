import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
    ExternalLink, Copy, Check, ArrowLeft, Cpu, Code, Database, Globe,
    Sparkles, Lightbulb, Star, TrendingUp, Terminal, Zap,
    ChevronDown, ChevronUp, Save, Wand2,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { analyzeQuery, recommendTechStack, generatePrompt, saveToHistory } from "@/lib/matchEngine"
import type { Agent } from "@/data/agents"
import type { TechStack } from "@/data/techStacks"
import { motion } from "framer-motion"

const stackIcons: Record<string, React.ReactNode> = { frontend: <Code className="w-4 h-4" />, backend: <Terminal className="w-4 h-4" />, database: <Database className="w-4 h-4" />, hosting: <Globe className="w-4 h-4" /> }
const stackColors: Record<string, string> = { frontend: "bg-blue-500/15 border-blue-400/25 text-blue-300", backend: "bg-emerald-500/15 border-emerald-400/25 text-emerald-300", database: "bg-amber-500/15 border-amber-400/25 text-amber-300", hosting: "bg-violet-500/15 border-violet-400/25 text-violet-300" }

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Results() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const rawQuery = searchParams.get("q") || ""
    const query = rawQuery.replace(/<[^>]*>/g, "").trim().slice(0, 500)

    const [results, setResults] = useState<{ agent: Agent; score: number; reasoning: string }[]>([])
    const [techStack, setTechStack] = useState<TechStack | null>(null)
    const [prompt, setPrompt] = useState("")
    const [refinedPrompt, setRefinedPrompt] = useState("")
    const [refining, setRefining] = useState(false)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("agents")
    const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
    const [showSave, setShowSave] = useState(false)
    const [templateName, setTemplateName] = useState("")

    useEffect(() => {
        if (!query) return
        setLoading(true)

        const timer = setTimeout(() => {
            const matches = analyzeQuery(query)
            setResults(matches)
            setTechStack(recommendTechStack(query))
            if (matches.length > 0) {
                setPrompt(generatePrompt(query, matches[0].agent))
                saveToHistory(query, matches[0].agent.name)
                setExpandedAgent(matches[0].agent.id)
            }
            setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [query])

    const handleCopyPrompt = async () => {
        await navigator.clipboard.writeText(refinedPrompt || prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRefinePrompt = () => {
        if (!results.length) return
        setRefining(true)
        setTimeout(() => {
            const agent = results[0].agent
            setRefinedPrompt(`# Optimized Super-Prompt for ${agent.name}

## Context & Role
You are an expert ${agent.category.toLowerCase()} assistant with deep knowledge in: ${agent.capabilities.join(", ")}.

## Task
${query}

## Instructions
1. Analyze the request thoroughly before responding
2. Break down complex problems into clear, actionable steps
3. Provide specific, implementable solutions — not generic advice
4. Include relevant examples, code snippets, or templates where applicable
5. Consider edge cases and potential pitfalls
6. Suggest follow-up improvements or optimizations

## Output Format
- Start with a brief summary of your approach
- Use structured sections with clear headings
- Include "Next Steps" at the end with 2-3 actionable follow-ups

## Constraints
- Be thorough but concise — no unnecessary fluff
- Prioritize practical, working solutions over theoretical explanations
- If unsure about specifics, state assumptions clearly`)
            setRefining(false)
        }, 1200)
    }

    const handleSaveTemplate = () => {
        if (!templateName.trim()) return
        const templates = (() => { try { const r = localStorage.getItem("af-templates"); return r ? JSON.parse(r) : [] } catch { return [] } })()
        templates.unshift({
            id: Date.now().toString(36),
            name: templateName.replace(/<[^>]*>/g, "").trim().slice(0, 100),
            query,
            agents: results.map(r => r.agent.name),
            techStack: techStack?.useCase || undefined,
            tags: results.length > 0 ? [results[0].agent.category] : [],
            createdAt: Date.now(),
        })
        try { localStorage.setItem("af-templates", JSON.stringify(templates.slice(0, 50))) } catch { }
        setShowSave(false); setTemplateName("")
    }

    const topMatch = results[0]
    const maxScore = topMatch?.score || 1

    if (!query) {
        return (
            <motion.div className="container mx-auto px-4 py-20 text-center" {...pageTransition}>
                <p className="text-sub">No query provided.</p>
                <button className="mt-4 btn-secondary px-5 py-2 rounded-full text-sm cursor-pointer" onClick={() => navigate("/")}>Go Back</button>
            </motion.div>
        )
    }

    return (
        <motion.div className="flex-1 flex flex-col" {...pageTransition}>
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-white border-transparent animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-sub" />
                    </div>
                    <p className="text-sub font-medium">Analyzing your problem...</p>
                    <p className="text-xs text-dim">Matching against 18 AI agents</p>
                </div>
            ) : (
                <main className="container mx-auto px-6 pt-24 pb-8 max-w-6xl">
                    {/* Header */}
                    <motion.div className="flex items-start justify-between gap-3 mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                        <div className="flex items-start gap-3">
                            <button onClick={() => navigate("/")} className="shrink-0 mt-1.5 text-sub hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Results for your query</h1>
                                <p className="text-sm text-sub mt-1">{query}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowSave(true)} className="btn-secondary px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                            <Save className="w-3.5 h-3.5" /> Save as Template
                        </button>
                    </motion.div>

                    {/* Save template modal */}
                    {showSave && (
                        <motion.div className="glass rounded-xl p-5 mb-6 flex items-center gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name..." maxLength={100}
                                className="flex-1 input-dark rounded-lg px-4 py-2.5 text-sm" onKeyDown={e => { if (e.key === "Enter") handleSaveTemplate() }} />
                            <button onClick={handleSaveTemplate} className="btn-primary px-4 py-2.5 rounded-lg text-sm cursor-pointer">Save</button>
                            <button onClick={() => setShowSave(false)} className="text-dim hover:text-white cursor-pointer"><ChevronUp className="w-4 h-4" /></button>
                        </motion.div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                        {[
                            { label: "TOP MATCH", value: topMatch?.agent.name || "—" },
                            { label: "CONFIDENCE", value: `${Math.min(Math.round((maxScore / 15) * 100), 99)}%` },
                            { label: "AGENTS FOUND", value: `${results.length}` },
                            { label: "BEST CATEGORY", value: topMatch?.agent.category || "—" },
                        ].map((card, i) => (
                            <motion.div key={i} className="glass rounded-2xl px-5 py-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}>
                                <p className="text-[11px] text-dim font-semibold uppercase tracking-widest mb-1.5">{card.label}</p>
                                <p className="font-bold text-lg truncate text-heading">{card.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-8 bg-transparent border-0 p-0 h-auto gap-2">
                            {[
                                { value: "agents", icon: <Sparkles className="w-3.5 h-3.5" />, label: `AI Agents (${results.length})` },
                                ...(techStack ? [{ value: "techstack", icon: <Cpu className="w-3.5 h-3.5" />, label: "Tech Stack" }] : []),
                                { value: "prompt", icon: <Copy className="w-3.5 h-3.5" />, label: "Prompt" },
                            ].map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-sm px-4 py-2 rounded-full pill data-[state=active]:pill-active transition-all">
                                    {tab.icon}{tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Agents Tab */}
                        <TabsContent value="agents">
                            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                                <div className="space-y-4">
                                    {results.length === 0 ? (
                                        <div className="glass rounded-2xl py-12 text-center text-sub">No direct matches found. Try describing your problem in more detail.</div>
                                    ) : results.map(({ agent, score, reasoning }, i) => {
                                        const matchPct = Math.min(Math.round((score / 15) * 100), 99)
                                        const isExpanded = expandedAgent === agent.id
                                        return (
                                            <motion.div key={agent.id} className="glass rounded-2xl cursor-pointer" onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}>
                                                <div className="px-6 pt-5 pb-2">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold btn-primary">#{i + 1}</div>
                                                            <div className="min-w-0">
                                                                <div className="text-base font-bold text-heading flex items-center gap-2.5">
                                                                    {agent.name}
                                                                    {agent.verified && <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-400/25 px-1.5 py-0.5 rounded">✓</span>}
                                                                    <span className="text-[11px] py-0.5 px-2 rounded-md pill">{agent.category}</span>
                                                                </div>
                                                                <p className="mt-0.5 text-xs text-sub line-clamp-1">{agent.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            {/* Confidence circle */}
                                                            <div className="relative w-12 h-12">
                                                                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                                                                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                                                    <circle cx="20" cy="20" r="16" fill="none" stroke="#3b82f6" strokeWidth="3"
                                                                        strokeDasharray={`${matchPct} ${100 - matchPct}`} strokeLinecap="round" />
                                                                </svg>
                                                                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-heading">{matchPct}%</span>
                                                            </div>
                                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-6 pb-5 pt-1">
                                                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4 bg-white/[0.03] border border-white/[0.05]">
                                                        <Lightbulb className="w-4 h-4 mt-0.5 text-dim shrink-0" />
                                                        <p className="text-xs text-sub leading-relaxed">{reasoning}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {agent.bestFor.map(bf => <span key={bf} className="text-[12px] py-1 px-3 rounded-lg pill">{bf}</span>)}
                                                    </div>
                                                    {isExpanded && (
                                                        <div className="pt-4 border-t border-white/[0.06] space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                            <div>
                                                                <p className="text-[11px] font-semibold text-dim uppercase tracking-widest mb-2.5">Capabilities</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {agent.capabilities.map(cap => (
                                                                        <span key={cap} className="inline-flex items-center gap-1.5 text-[12px] pill rounded-lg px-3 py-1.5">
                                                                            <Zap className="w-3 h-3 text-blue-400" />{cap}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                                    <span className="text-sm font-semibold text-heading">{agent.rating}</span>
                                                                    <span className="text-xs text-dim">({agent.reviewCount})</span>
                                                                </div>
                                                                <span className="text-sm text-sub">{agent.pricing}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 pt-2 flex-wrap">
                                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/refine?q=${encodeURIComponent(query)}&agent=${agent.id}`) }}
                                                                    className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Customize Prompt</button>
                                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/agent/${agent.id}`) }}
                                                                    className="btn-primary px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">View Details</button>
                                                                <a href={agent.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                                                    <button className="btn-secondary px-4 py-2 rounded-lg text-sm cursor-pointer flex items-center gap-1.5">
                                                                        Visit <ExternalLink className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!isExpanded && (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                                <span className="text-xs text-body">{agent.rating}</span>
                                                                <span className="text-xs text-dim">{agent.pricing}</span>
                                                            </div>
                                                            <a href={agent.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                                                <button className="pill text-xs px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1">Visit <ExternalLink className="w-3 h-3" /></button>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                                {/* Sidebar */}
                                {results.length > 0 && (
                                    <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                                        <div className="glass rounded-2xl sticky top-20">
                                            <div className="px-5 pt-5 pb-3">
                                                <h3 className="text-sm font-bold text-heading flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sub" />Quick Comparison</h3>
                                            </div>
                                            <div className="px-5 pb-5 space-y-3.5">
                                                {results.map(({ agent, score }) => {
                                                    const pct = Math.min(Math.round((score / 15) * 100), 99)
                                                    return (
                                                        <div key={agent.id} className="space-y-1.5 cursor-pointer" onClick={() => navigate(`/agent/${agent.id}`)}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-medium text-body truncate mr-2">{agent.name}</span>
                                                                <span className="text-xs text-dim font-semibold tabular-nums">{pct}%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%`, opacity: pct > 50 ? 1 : 0.6 }} />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                <div className="pt-4 border-t border-white/[0.06]">
                                                    <button onClick={() => navigate(`/compare?agents=${results.map(r => r.agent.id).slice(0, 3).join(",")}`)}
                                                        className="w-full btn-secondary px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer">
                                                        Full Comparison →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Tech Stack Tab */}
                        {techStack && (
                            <TabsContent value="techstack">
                                <motion.div className="glass rounded-2xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 btn-primary rounded-xl flex items-center justify-center"><Cpu className="w-5 h-5" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-heading">Recommended Tech Stack</h3>
                                                <p className="text-xs text-sub mt-0.5">Optimized for: {techStack.useCase}</p>
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {(["frontend", "backend", "database", "hosting"] as const).map(key => (
                                                <div key={key} className={`rounded-xl border p-5 ${stackColors[key]}`}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">{stackIcons[key]}</div>
                                                        <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                                                    </div>
                                                    <p className="font-semibold text-sm mb-2">{techStack[key].name}</p>
                                                    <p className="text-xs leading-relaxed opacity-70">{techStack[key].reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        )}

                        {/* Prompt Tab */}
                        <TabsContent value="prompt">
                            {prompt && results.length > 0 && (
                                <motion.div className="glass rounded-2xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 btn-primary rounded-xl flex items-center justify-center"><Copy className="w-5 h-5" /></div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-heading">{refinedPrompt ? "Optimized Super-Prompt" : "Ready-to-Use Prompt"}</h3>
                                                    <p className="text-xs text-sub mt-0.5">For {results[0].agent.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!refinedPrompt && (
                                                    <button onClick={handleRefinePrompt} disabled={refining}
                                                        className="btn-glow px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-40">
                                                        <Wand2 className={`w-4 h-4 ${refining ? "animate-spin" : ""}`} /> {refining ? "Refining..." : "Refine Prompt ✨"}
                                                    </button>
                                                )}
                                                <button onClick={handleCopyPrompt}
                                                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-all ${copied ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "btn-secondary"}`}>
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    {copied ? "Copied!" : "Copy"}
                                                </button>
                                            </div>
                                        </div>
                                        <pre className="terminal rounded-xl p-5 text-sm whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto text-green-300/80">
                                            {refinedPrompt || prompt}
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                        </TabsContent>
                    </Tabs>
                </main>
            )}
        </motion.div>
    )
}
