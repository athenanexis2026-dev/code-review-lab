import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useState, type FormEvent } from 'react'
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
}

export function CodeEditorForm({
  initialCode = '',
  testCases = [],
}: CodeEditorFormProps) {
  const [code, setCode] = useState(initialCode)
  const [testResult, setTestResult] = useState<CodeTestRunResult | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)

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

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        <button type="button" className="secondary" onClick={runTests}>
          Run tests
        </button>
        <button type="submit">Submit</button>
      </div>
      <CodeTestSummary result={testResult} isRunning={isRunningTests} />
    </form>
  )
}
