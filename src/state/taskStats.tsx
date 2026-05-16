import { useState, type ReactNode } from 'react'
import {
  createDefaultTaskStats,
  TaskStatsContext,
  type TaskStatsState,
} from './taskStatsContext'

type TaskStatsProviderProps = {
  children: ReactNode
}

export const TaskStatsProvider = ({ children }: TaskStatsProviderProps) => {
  const [taskStats, setTaskStats] = useState<TaskStatsState>(createDefaultTaskStats)

  const resetTaskStats = () => {
    setTaskStats(createDefaultTaskStats())
  }

  const value = {
    ...taskStats,
    setTaskStats,
    resetTaskStats,
  }

  return (
    <TaskStatsContext.Provider value={value}>{children}</TaskStatsContext.Provider>
  )
}
