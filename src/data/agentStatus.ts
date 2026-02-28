import { agents } from "./agents"

export interface AgentStatusEntry {
    agentId: string
    name: string
    status: "operational" | "degraded" | "down"
    uptime: number
    latency: number
    lastChecked: number
    incidents?: string[]
}

// Generate realistic status data for all agents
function generateStatuses(): AgentStatusEntry[] {
    const now = Date.now()
    return agents.map((agent, i) => {
        let status: "operational" | "degraded" | "down" = "operational"
        let uptime = 99 + Math.random() * 0.99
        let latency = 100 + Math.floor(Math.random() * 400)
        let incidents: string[] | undefined

        // Simulate some degraded/down agents (deterministic by index)
        if (i % 17 === 5) {
            status = "degraded"
            uptime = 97 + Math.random() * 1.5
            latency = 700 + Math.floor(Math.random() * 500)
            incidents = ["Elevated response times observed. Monitoring."]
        } else if (i % 23 === 11) {
            status = "down"
            uptime = 95 + Math.random() * 2
            latency = 0
            incidents = ["Service temporarily unavailable. Team investigating."]
        }

        const minutesAgo = 2 + Math.floor(Math.random() * 10)

        return {
            agentId: agent.id,
            name: agent.name,
            status,
            uptime: parseFloat(uptime.toFixed(2)),
            latency,
            lastChecked: now - minutesAgo * 60000,
            ...(incidents ? { incidents } : {}),
        }
    })
}

export const agentStatuses: AgentStatusEntry[] = generateStatuses()
