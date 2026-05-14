import { useMemo, useState, type ReactNode } from 'react'
import {
  defaultTaskStats,
  TaskStatsContext,
  type TaskStatsState,
} from './taskStatsContext'

type TaskStatsProviderProps = {
  children: ReactNode
}

export function TaskStatsProvider({ children }: TaskStatsProviderProps) {
  const [taskStats, setTaskStats] = useState<TaskStatsState>(defaultTaskStats)

  const value = useMemo(
    () => ({
      ...taskStats,
      setTaskStats,
    }),
    [taskStats],
  )

  return (
    <TaskStatsContext.Provider value={value}>{children}</TaskStatsContext.Provider>
  )
}
