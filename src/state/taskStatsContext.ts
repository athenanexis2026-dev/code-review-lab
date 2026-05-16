import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import { tasks } from '../data/tasks'
import { taskTestsById } from '../tests/taskTests'

type TaskResult = 'passed' | 'failed'

export type TaskStatsState = {
  tasks: number
  totalTests: number
  passedTests: number
  completedTasks: number
  passedTasks: number
  failedTasks: number
  taskResultsById: Record<string, TaskResult>
  passedTestsByTaskId: Record<string, string[]>
}

export type TaskStatsContextValue = TaskStatsState & {
  setTaskStats: Dispatch<SetStateAction<TaskStatsState>>
  resetTaskStats: () => void
}

const getTotalConfiguredTests = () => {
  return tasks.reduce(
    (total, task) => total + (taskTestsById[task.id]?.length ?? 0),
    0,
  )
}

export const createDefaultTaskStats = (): TaskStatsState => {
  return {
    tasks: tasks.length,
    totalTests: getTotalConfiguredTests(),
    passedTests: 0,
    completedTasks: 0,
    passedTasks: 0,
    failedTasks: 0,
    taskResultsById: {},
    passedTestsByTaskId: {},
  }
}

export const TaskStatsContext = createContext<TaskStatsContextValue | undefined>(
  undefined,
)

export const useTaskStats = () => {
  const context = useContext(TaskStatsContext)

  if (!context) {
    throw new Error('useTaskStats must be used within a TaskStatsProvider')
  }

  return context
}
