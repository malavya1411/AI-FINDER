import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Signup() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const cleanName = name.replace(/<[^>]*>/g, "").trim().slice(0, 100)
        const cleanEmail = email.replace(/<[^>]*>/g, "").trim().slice(0, 254)
        if (cleanName.length < 2) { setError("Name must be at least 2 characters."); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError("Please enter a valid email."); return }
        if (password.length < 8) { setError("Password must be at least 8 characters."); return }
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) { setError("Password must include an uppercase letter and a number."); return }
        navigate("/")
    }

    return (
        <motion.main className="flex-1 flex items-center justify-center px-4 py-16" {...pageTransition}>
            <div className="w-full max-w-md glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-heading text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create account</h2>
                <p className="text-sub text-sm text-center mb-8">Join Agent Finder to save searches and templates</p>
                {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/25 text-sm text-red-300">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your name" maxLength={100}
                            className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com" maxLength={254}
                            className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-dim font-semibold uppercase tracking-widest mb-1.5 block">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••" maxLength={128}
                            className="w-full input-dark rounded-lg px-4 py-3 text-sm" />
                        <p className="text-[11px] text-dim mt-1.5">At least 8 characters, one uppercase, one number</p>
                    </div>
                    <button type="submit" className="w-full btn-glow px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer">Create Account</button>
                </form>
                <p className="text-center text-sm text-sub mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
                </p>
            </div>
        </motion.main>
    )
}
