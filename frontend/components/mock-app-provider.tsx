"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { allEmployeeAccounts, initialRegisteredIds, type Employee } from "@/lib/employees"

interface MockAppState {
  employees: Employee[]
  managers: string[]
  managerByEmployee: Record<string, string>
  addEmployee: (employee: Employee) => void
  updateEmployee: (employeeId: string, details: Pick<Employee, "name" | "email">) => void
  deactivateEmployee: (employeeId: string) => void
  transferEmployee: (employeeId: string, manager: string) => void
}

const MockAppContext = createContext<MockAppState | null>(null)

export function MockAppProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState(() => allEmployeeAccounts.filter((employee) => initialRegisteredIds.includes(employee.id)))
  const [managerByEmployee, setManagerByEmployee] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialRegisteredIds.map((id) => [id, "鈴木 花子"])),
  )
  const managers = ["鈴木 花子", "小林 翔太", "加藤 美穂"]

  const value = useMemo<MockAppState>(() => ({
    employees,
    managers,
    managerByEmployee,
    addEmployee: (employee) => {
      setEmployees((current) => current.some((item) => item.email === employee.email) ? current : [...current, employee])
      setManagerByEmployee((current) => ({ ...current, [employee.id]: "鈴木 花子" }))
    },
    updateEmployee: (employeeId, details) => {
      setEmployees((current) => current.map((employee) => employee.id === employeeId ? { ...employee, ...details } : employee))
    },
    deactivateEmployee: (employeeId) => {
      const deactivatedAt = new Date().toISOString().slice(0, 10)
      setEmployees((current) => current.map((employee) => employee.id === employeeId ? { ...employee, isActive: false, deactivatedAt } : employee))
    },
    transferEmployee: (employeeId, manager) => {
      setManagerByEmployee((current) => ({ ...current, [employeeId]: manager }))
      if (manager !== "鈴木 花子") setEmployees((current) => current.filter((employee) => employee.id !== employeeId))
    },
  }), [employees, managerByEmployee])

  return <MockAppContext.Provider value={value}>{children}</MockAppContext.Provider>
}

export function useMockApp() {
  const context = useContext(MockAppContext)
  if (!context) throw new Error("useMockApp must be used inside MockAppProvider")
  return context
}
