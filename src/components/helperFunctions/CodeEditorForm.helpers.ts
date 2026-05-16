import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { TaskStatsState } from '../../state/taskStatsContext'
import {
  runCodeTests,
  type CodeTestCase,
  type CodeTestRunResult,
} from '../../utils/codeTestRunner'
import type { CodeEditorSubmission } from '../CodeEditorForm'

type RunTestsParams = {
  code: string
  testCases: CodeTestCase[]
  setTestResult: Dispatch<SetStateAction<CodeTestRunResult | null>>
  setIsRunningTests: Dispatch<SetStateAction<boolean>>
}

type RegisterSubmittedResultParams = {
  setTaskStats: Dispatch<SetStateAction<TaskStatsState>>
  taskId: string
  result: CodeTestRunResult
}

type SubmitCodeParams = {
  event: FormEvent<HTMLFormElement>
  code: string
  runTests: () => Promise<CodeTestRunResult>
  registerSubmittedResult: (result: CodeTestRunResult) => void
  onSubmitComplete?: (submission: CodeEditorSubmission) => void
  scrollToTestSummary: () => void
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error)
}

export const createFailedTestRunResult = (
  error: unknown,
): CodeTestRunResult => ({
  status: 'failed',
  passed: 0,
  failed: 1,
  total: 1,
  cases: [
    {
      name: 'Compile and execute TypeScript',
      passed: false,
      error: getErrorMessage(error),
    },
  ],
})

const getSubmittedTaskResult = (
  result: CodeTestRunResult,
): 'passed' | 'failed' => {
  return result.status === 'passed' ? 'passed' : 'failed'
}

const getPassedTestNames = (result: CodeTestRunResult) => {
  return result.cases
    .filter((testCase) => testCase.passed)
    .map((testCase) => testCase.name)
}

const getTotalPassedTests = (passedTestsByTaskId: Record<string, string[]>) => {
  return Object.values(passedTestsByTaskId).reduce(
    (total, taskPassedTests) => total + taskPassedTests.length,
    0,
  )
}

export const getUpdatedTaskStats = (
  currentStats: TaskStatsState,
  taskId: string,
  result: CodeTestRunResult,
): TaskStatsState => {
  const taskResultsById = {
    ...currentStats.taskResultsById,
    [taskId]: getSubmittedTaskResult(result),
  }
  const passedTestsByTaskId = {
    ...currentStats.passedTestsByTaskId,
    [taskId]: getPassedTestNames(result),
  }
  const submittedResults = Object.values(taskResultsById)

  return {
    ...currentStats,
    passedTests: getTotalPassedTests(passedTestsByTaskId),
    completedTasks: submittedResults.length,
    passedTasks: submittedResults.filter((taskResult) => taskResult === 'passed')
      .length,
    failedTasks: submittedResults.filter((taskResult) => taskResult === 'failed')
      .length,
    taskResultsById,
    passedTestsByTaskId,
  }
}

export const runTests = async ({
  code,
  testCases,
  setTestResult,
  setIsRunningTests,
}: RunTestsParams) => {
  setIsRunningTests(true)

  try {
    const result = await runCodeTests(code, testCases)

    setTestResult(result)
    return result
  } catch (error) {
    const failedResult = createFailedTestRunResult(error)

    setTestResult(failedResult)
    return failedResult
  } finally {
    setIsRunningTests(false)
  }
}

export const registerSubmittedResult = ({
  setTaskStats,
  taskId,
  result,
}: RegisterSubmittedResultParams) => {
  setTaskStats((currentStats) => getUpdatedTaskStats(currentStats, taskId, result))
}

export const submitCode = async ({
  event,
  code,
  runTests,
  registerSubmittedResult,
  onSubmitComplete,
  scrollToTestSummary,
}: SubmitCodeParams) => {
  event.preventDefault()
  const result = await runTests()
  const submission = {
    code,
    result,
    submittedAt: new Date().toISOString(),
  }

  registerSubmittedResult(result)
  onSubmitComplete?.(submission)
  scrollToTestSummary()
}
