import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Index from "@/pages/Index"
import Results from "@/pages/Results"
import Directory from "@/pages/Directory"
import History from "@/pages/History"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import AgentDetail from "@/pages/AgentDetail"
import Compare from "@/pages/Compare"
import Status from "@/pages/Status"
import Community from "@/pages/Community"
import SubmitAgent from "@/pages/SubmitAgent"
import Profile from "@/pages/Profile"
import Dashboard from "@/pages/Dashboard"
import RefinementFlow from "@/pages/RefinementFlow"
import { Navbar } from "@/components/Navbar"

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/refine" element={<RefinementFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/status" element={<Status />} />
        <Route path="/community" element={<Community />} />
        <Route path="/submit-agent" element={<SubmitAgent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Persistent dark background */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="fixed inset-0 bg-black/30" />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
