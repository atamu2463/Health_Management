"use client"

import { createContext, useContext, useMemo, useState } from "react"
import {
  allEmployeeAccounts,
  getLocalDateKey,
  initialRegisteredIds,
  type CheckinType,
  type Employee,
  type HealthEntry,
} from "@/lib/employees"

interface MockAppState {
  employees: Employee[]
  managers: string[]
  managerByEmployee: Record<string, string>
  addEmployee: (employee: Employee) => boolean
  updateEmployee: (
    employeeId: string,
    details: Pick<Employee, "name" | "email">,
  ) => void
  deactivateEmployee: (employeeId: string) => void
  transferEmployee: (employeeId: string, manager: string) => void
  addHealthEntry: (
    employeeId: string,
    date: string,
    type: CheckinType,
    entry: HealthEntry,
  ) => void
}

const managers = ["鈴木 花子", "小林 翔太", "加藤 美穂"]

const MockAppContext = createContext<MockAppState | null>(null)

export function MockAppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [employees, setEmployees] = useState(() =>
    allEmployeeAccounts.filter((employee) =>
      initialRegisteredIds.includes(employee.id),
    ),
  )

  const [managerByEmployee, setManagerByEmployee] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      initialRegisteredIds.map((id) => [id, "鈴木 花子"]),
    ),
  )

  const value = useMemo<MockAppState>(
    () => ({
      employees,
      managers,
      managerByEmployee,

      addEmployee: (employee) => {
        const isDuplicate = employees.some(
          (item) => item.email === employee.email,
        )

        if (isDuplicate) {
          return false
        }

        setEmployees((current) => [...current, employee])

        setManagerByEmployee((current) => ({
          ...current,
          [employee.id]: "鈴木 花子",
        }))

        return true
      },

      updateEmployee: (employeeId, details) => {
        setEmployees((current) =>
          current.map((employee) =>
            employee.id === employeeId
              ? { ...employee, ...details }
              : employee,
          ),
        )
      },

      deactivateEmployee: (employeeId) => {
        const deactivatedAt = getLocalDateKey()

        setEmployees((current) =>
          current.map((employee) =>
            employee.id === employeeId
              ? { ...employee, isActive: false, deactivatedAt }
              : employee,
          ),
        )
      },

      transferEmployee: (employeeId, manager) => {
        setManagerByEmployee((current) => ({
          ...current,
          [employeeId]: manager,
        }))
      },

      addHealthEntry: (employeeId, date, type, entry) => {
        setEmployees((current) =>
          current.map((employee) => {
            if (employee.id !== employeeId) {
              return employee
            }

            const existingRecord = employee.records.find(
              (record) => record.date === date,
            )

            if (existingRecord) {
              return {
                ...employee,
                records: employee.records.map((record) =>
                  record.date === date
                    ? { ...record, [type]: entry }
                    : record,
                ),
              }
            }

            return {
              ...employee,
              records: [
                { date, [type]: entry },
                ...employee.records,
              ],
            }
          }),
        )
      },
    }),
    [employees, managerByEmployee],
  )

  return (
    <MockAppContext.Provider value={value}>
      {children}
    </MockAppContext.Provider>
  )
}

export function useMockApp() {
  const context = useContext(MockAppContext)

  if (!context) {
    throw new Error("useMockApp must be used inside MockAppProvider")
  }

  return context
}