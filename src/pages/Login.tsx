import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const cleanEmail = email.replace(/<[^>]*>/g, "").trim().slice(0, 254)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError("Please enter a valid email."); return }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return }
        navigate("/")
    }

    return (
        <motion.main className="flex-1 flex items-center justify-center px-4 py-16" {...pageTransition}>
            <div className="w-full max-w-md glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-heading text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome back</h2>
                <p className="text-sub text-sm text-center mb-8">Sign in to access your saved searches</p>
                {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/25 text-sm text-red-300">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    </div>
                    <button type="submit" className="w-full btn-glow px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer">Sign In</button>
                </form>
                <p className="text-center text-sm text-sub mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</Link>
                </p>
            </div>
        </motion.main>
    )
}
