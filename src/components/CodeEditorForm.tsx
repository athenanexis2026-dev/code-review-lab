import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useRef, useState } from 'react'
import { codeMirrorBasicSetup, typeScriptExtensions } from './config/codeMirrorConfig'
import { CodeTestSummary } from './CodeTestSummary'
import type { CodeTestCase, CodeTestRunResult } from '../utils/codeTestRunner'
import { useTaskStats } from '../state/taskStatsContext'
import {
  registerSubmittedResult,
  runTests,
  submitCode,
} from './helperFunctions/CodeEditorForm.helpers'

export type CodeEditorSubmission = {
  code: string
  result: CodeTestRunResult
  submittedAt: string
}

type CodeEditorFormProps = {
  initialCode?: string
  taskId: string
  testCases?: CodeTestCase[]
  savedSubmission?: CodeEditorSubmission | null
  onSubmitComplete?: (submission: CodeEditorSubmission) => void
}

export const CodeEditorForm = ({
  initialCode = '',
  taskId,
  testCases = [],
  savedSubmission,
  onSubmitComplete,
}: CodeEditorFormProps) => {
  const { setTaskStats } = useTaskStats()
  const [code, setCode] = useState(savedSubmission?.code ?? initialCode)
  const [testResult, setTestResult] = useState<CodeTestRunResult | null>(
    savedSubmission?.result ?? null,
  )
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

  const runCurrentTests = () => {
    return runTests({
      code,
      testCases,
      setTestResult,
      setIsRunningTests,
    })
  }

  const registerCurrentSubmittedResult = (result: CodeTestRunResult) => {
    registerSubmittedResult({
      setTaskStats,
      taskId,
      result,
    })
  }

  const runTestsAndScroll = async () => {
    await runCurrentTests()
    scrollToTestSummary()
  }

  return (
    <form
      className="code-editor-form"
      onSubmit={(event) =>
        submitCode({
          event,
          code,
          runTests: runCurrentTests,
          registerSubmittedResult: registerCurrentSubmittedResult,
          onSubmitComplete,
          scrollToTestSummary,
        })
      }
    >
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
          onClick={runTestsAndScroll}
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
