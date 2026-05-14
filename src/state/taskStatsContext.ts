import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type TaskStatsState = {
  tasks: number
  completedTasks: number
  passedTasks: number
  failedTasks: number
}

export type TaskStatsContextValue = TaskStatsState & {
  setTaskStats: Dispatch<SetStateAction<TaskStatsState>>
}

export const defaultTaskStats: TaskStatsState = {
  tasks: 5,
  completedTasks: 0,
  passedTasks: 0,
  failedTasks: 0,
}

export const TaskStatsContext = createContext<TaskStatsContextValue | undefined>(
  undefined,
)

export function useTaskStats() {
  const context = useContext(TaskStatsContext)

  if (!context) {
    throw new Error('useTaskStats must be used within a TaskStatsProvider')
  }

  return context
}
