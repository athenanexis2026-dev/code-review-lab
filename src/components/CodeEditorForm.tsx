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

type CodeEditorFormProps = {
  initialCode?: string
  testCases?: CodeTestCase[]
  onSubmitComplete?: () => void
}

export function CodeEditorForm({
  initialCode = '',
  testCases = [],
  onSubmitComplete,
}: CodeEditorFormProps) {
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
    } catch (error) {
      setTestResult({
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
      })
    } finally {
      setIsRunningTests(false)
    }
  }

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await runTests()
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
