"use client"
import { useState } from "react"
import { BarChart3 } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { WorkflowBackLink } from "@/components/workflow-back-link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMockApp } from "@/components/mock-app-provider"
import { healthStatusConfig, type CheckinType, type HealthStatus } from "@/lib/employees"

const order: HealthStatus[] = ["excellent", "good", "normal", "caution", "bad"]
const colors: Record<HealthStatus, string> = { excellent: "bg-emerald-600", good: "bg-green-500", normal: "bg-slate-400", caution: "bg-amber-500", bad: "bg-red-600" }

export default function TeamTrendsPage() {
  const { employees } = useMockApp(); const [type, setType] = useState<CheckinType>("clockIn")
  const entries = employees.flatMap((employee) => employee.records.slice(0, 31).map((record) => record[type]).filter(Boolean))
  const counts = Object.fromEntries(order.map((status) => [status, entries.filter((item) => item?.status === status).length])) as Record<HealthStatus, number>
  return <div className="min-h-screen bg-background"><AppHeader role="manager" authenticated /><main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8"><div className="flex items-center justify-between gap-4"><WorkflowBackLink href="/manager/menu" label="メニューへ戻る" /><div className="flex gap-2"><Button size="sm" variant={type === "clockIn" ? "default" : "outline"} onClick={() => setType("clockIn")}>出勤時</Button><Button size="sm" variant={type === "clockOut" ? "default" : "outline"} onClick={() => setType("clockOut")}>退勤時</Button></div></div><div><h1 className="flex items-center gap-2 text-2xl font-bold"><BarChart3 className="h-6 w-6 text-primary" />1か月のチーム体調傾向</h1><p className="mt-1 text-sm text-muted-foreground">担当従業員の直近1か月の回答割合を確認できます。</p></div><div className="grid gap-4 sm:grid-cols-2"><Card><CardContent className="p-5"><p className="text-3xl font-bold">{employees.length}</p><p className="text-sm text-muted-foreground">対象従業員数</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-3xl font-bold">{entries.length}</p><p className="text-sm text-muted-foreground">記録数</p></CardContent></Card></div><Card><CardHeader><CardTitle>{type === "clockIn" ? "出勤時" : "退勤時"}の回答割合</CardTitle></CardHeader><CardContent className="flex flex-col gap-5">{order.map((status) => { const percentage = entries.length ? Math.round((counts[status] / entries.length) * 100) : 0; return <div key={status} className="flex flex-col gap-2"><div className="flex justify-between text-sm"><span>{healthStatusConfig[status].label}</span><strong>{percentage}%</strong></div><div className="h-3 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${colors[status]}`} style={{ width: `${percentage}%` }} /></div><p className="text-xs text-muted-foreground">{counts[status]}件</p></div> })}</CardContent></Card></main></div>
}
