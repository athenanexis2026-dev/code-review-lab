import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  createDefaultTaskStats,
  TaskStatsContext,
  type TaskStatsState,
} from './taskStatsContext'

type TaskStatsProviderProps = {
  children: ReactNode
}

export function TaskStatsProvider({ children }: TaskStatsProviderProps) {
  const [taskStats, setTaskStats] = useState<TaskStatsState>(createDefaultTaskStats)

  const resetTaskStats = useCallback(() => {
    setTaskStats(createDefaultTaskStats())
  }, [])

  const value = useMemo(
    () => ({
      ...taskStats,
      setTaskStats,
      resetTaskStats,
    }),
    [resetTaskStats, taskStats],
  )

  return (
    <TaskStatsContext.Provider value={value}>{children}</TaskStatsContext.Provider>
  )
}
