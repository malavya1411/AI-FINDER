import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path
    const isActiveAny = (paths: string[]) => paths.some(p => location.pathname.startsWith(p))

    const navLinks = [
        { label: "Directory", path: "/directory" },
        { label: "Status", path: "/status" },
        { label: "Community", path: "/community" },
        { label: "History", path: "/history" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-black/20">
            <div className="container mx-auto flex items-center justify-between h-16 px-6">
                {/* Logo */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-6 h-6 text-blue-400"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span
                        className="font-semibold text-lg tracking-tight text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Agent Finder
                    </span>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`text-sm font-medium transition-colors cursor-pointer ${isActive(link.path) ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate("/login")}
                        className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${isActiveAny(["/login", "/signup"])
                            ? "text-white border-white/30 bg-white/10"
                            : "text-white/75 border-white/20 hover:bg-white/8 hover:text-white"
                            }`}
                    >
                        Sign In
                    </button>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl p-4 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <button
                            key={link.path}
                            className={`text-left text-sm font-medium py-2 cursor-pointer ${isActive(link.path) ? "text-white" : "text-white/60"
                                }`}
                            onClick={() => { navigate(link.path); setMobileOpen(false) }}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        className="text-sm font-medium px-4 py-2 rounded-full border text-white border-white/20 cursor-pointer"
                        onClick={() => { navigate("/login"); setMobileOpen(false) }}
                    >
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    )
}
