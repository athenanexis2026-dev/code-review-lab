import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type TaskStatsState = {
  tasks: number
  totalTests: number
  passedTests: number
  completedTasks: number
  passedTasks: number
  failedTasks: number
  taskResultsById: Record<string, 'passed' | 'failed'>
  passedTestsByTaskId: Record<string, string[]>
}

export type TaskStatsContextValue = TaskStatsState & {
  setTaskStats: Dispatch<SetStateAction<TaskStatsState>>
  resetTaskStats: () => void
}

export function createDefaultTaskStats(): TaskStatsState {
  return {
    tasks: 5,
    totalTests: 25,
    passedTests: 0,
    completedTasks: 0,
    passedTasks: 0,
    failedTasks: 0,
    taskResultsById: {},
    passedTestsByTaskId: {},
  }
}

export const defaultTaskStats: TaskStatsState = createDefaultTaskStats()

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
