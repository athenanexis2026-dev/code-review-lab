import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useRef, useState, type FormEvent } from 'react'
import { codeMirrorBasicSetup, typeScriptExtensions } from './codeMirrorConfig'
import { CodeTestSummary } from './CodeTestSummary'
import {
  runCodeTests,
  type CodeTestCase,
  type CodeTestRunResult,
} from '../utils/codeTestRunner'
import { useTaskStats } from '../state/taskStatsContext'

type CodeEditorFormProps = {
  initialCode?: string
  taskId: string
  testCases?: CodeTestCase[]
  onSubmitComplete?: () => void
}

export function CodeEditorForm({
  initialCode = '',
  taskId,
  testCases = [],
  onSubmitComplete,
}: CodeEditorFormProps) {
  const { setTaskStats } = useTaskStats()
  const [code, setCode] = useState(initialCode)
  const [testResult, setTestResult] = useState<CodeTestRunResult | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const testSummaryRef = useRef<HTMLDivElement>(null)

  const scrollToTestSummary = () => {
    window.requestAnimationFrame(() => {
      testSummaryRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const runTests = async () => {
    setIsRunningTests(true)

    try {
      const result = await runCodeTests(code, testCases)

      setTestResult(result)
      return result
    } catch (error) {
      const failedResult: CodeTestRunResult = {
        status: 'failed',
        passed: 0,
        failed: 1,
        total: 1,
        cases: [
          {
            name: 'Compile and execute TypeScript',
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          },
        ],
      }

      setTestResult(failedResult)
      return failedResult
    } finally {
      setIsRunningTests(false)
    }
  }

  const registerSubmittedResult = (result: CodeTestRunResult) => {
    setTaskStats((currentStats) => {
      const submittedTaskResult: 'passed' | 'failed' =
        result.status === 'passed' ? 'passed' : 'failed'
      const taskResultsById = {
        ...currentStats.taskResultsById,
        [taskId]: submittedTaskResult,
      }
      const passedTestsByTaskId = {
        ...currentStats.passedTestsByTaskId,
        [taskId]: result.cases
          .filter((testCase) => testCase.passed)
          .map((testCase) => testCase.name),
      }
      const submittedResults = Object.values(taskResultsById)
      const passedTests = Object.values(passedTestsByTaskId).reduce(
        (total, taskPassedTests) => total + taskPassedTests.length,
        0,
      )

      return {
        ...currentStats,
        passedTests,
        completedTasks: submittedResults.length,
        passedTasks: submittedResults.filter((taskResult) => taskResult === 'passed')
          .length,
        failedTasks: submittedResults.filter((taskResult) => taskResult === 'failed')
          .length,
        taskResultsById,
        passedTestsByTaskId,
      }
    })
  }

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await runTests()

    registerSubmittedResult(result)
    onSubmitComplete?.()
    scrollToTestSummary()
  }

  return (
    <form className="code-editor-form" onSubmit={submitCode}>
      <div className="code-panel__header">
        <h3>Your solution</h3>
        <span>TypeScript</span>
      </div>
      <CodeMirror
        aria-label="TypeScript solution editor"
        value={code}
        theme={vscodeDark}
        extensions={typeScriptExtensions}
        basicSetup={codeMirrorBasicSetup}
        minHeight="430px"
        onChange={(value) => setCode(value)}
      />
      <div className="code-editor-form__actions">
        <button
          type="button"
          className="secondary"
          onClick={runTests}
          disabled={isRunningTests}
        >
          {isRunningTests ? 'Running...' : 'Run tests'}
        </button>
        <button type="submit" disabled={isRunningTests}>
          Submit
        </button>
      </div>
      <div className="code-test-summary-anchor" ref={testSummaryRef}>
        <CodeTestSummary result={testResult} isRunning={isRunningTests} />
      </div>
    </form>
  )
}
